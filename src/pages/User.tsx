/* eslint-disable react-hooks/exhaustive-deps */
import UserDialog from "@/components/UserDialog";
import { PaginateType, User } from "@/models";
import { deleteUser, fetchUsers } from "@/services/UserService";
import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
const UserPage: React.FC = () => {
  const [table, setTable] = useState<PaginateType<User> | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [editId, setEditId] = useState<string>("");

  useEffect(() => {
    getTable();
  }, [page, rowsPerPage]);

  async function getTable() {
    const res = await fetchUsers(page, rowsPerPage);
    setTable(res);
  }

  function toggleDialog() {
    setEditId('')
    setOpenDialog(!openDialog);
  }

  function onEditDialog(id: string) {
    setEditId(id);
    setOpenDialog(true);
  }

  function onRowsPerPageChange(event: React.ChangeEvent<HTMLInputElement>) {
    setRowsPerPage(Number(event.target.value));
    setPage(1);
  }
  function handleChangePage(_event: unknown, newPage: number) {
    setPage(newPage + 1);
  }
  async function onDelete(id: string) {
    await deleteUser(id);
    getTable();
  }
  return (
    <Box m={4}>
      <UserDialog
        onClose={toggleDialog}
        editId={editId}
        open={openDialog}
        onSubmitted={getTable}
      />
      <Box my={2}>
        <Button size="small" variant="contained" onClick={() => toggleDialog()}>
          Create User
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Organization</TableCell>
              <TableCell>Is Customer manager</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {table &&
              table.data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    {row.user_organization?.organization?.name}
                  </TableCell>
                  <TableCell>
                    {row.user_organization?.is_manager ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        onClick={() => onEditDialog(row.id)}
                        variant="outlined"
                        size="small"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => onDelete(row.id)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              {table && (
                <TablePagination
                  colSpan={6}
                  count={table.total}
                  rowsPerPage={rowsPerPage}
                  page={page - 1}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={onRowsPerPageChange}
                />
              )}
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserPage;
