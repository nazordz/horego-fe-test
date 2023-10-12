/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
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
  TextField,
  styled,
} from "@mui/material";
import {
  deleteOrganization,
  fetchOrganizations,
} from "@/services/OrganizationService";
import { Organization, PaginateType } from "@/models";
import dayjs from "dayjs";
import OrganizationDialog from "@/components/OrganizationDialog";
import { isAdmin } from "@/utils/permission";

const OrganizationPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [table, setTable] = useState<PaginateType<Organization> | null>(null);
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [editId, setEditId] = useState<string>('');

  async function getOrganizations() {
    const data = await fetchOrganizations(page, rowsPerPage, search);
    setTable(data);
  }
  useEffect(() => {
    getOrganizations();
  }, [search, rowsPerPage, page]);

  function handleChangePage(_event: unknown, newPage: number) {
    setPage(newPage + 1);
  }

  function onRowsPerPageChange(event: React.ChangeEvent<HTMLInputElement>) {
    setRowsPerPage(Number(event.target.value));
    setPage(1);
  }

  function onSearch(key: string) {
    if (key == "Enter") {
      setSearch(searchKeyword);
      setPage(1);
    }
  }

  async function onDelete(id: string) {
    await deleteOrganization(id);
    getOrganizations();
  }

  const Image = styled("img")(() => ({
    width: 80,
    height: 80,
  }));

  function toggleDialog() {
    setEditId('');
    setOpenDialog(!openDialog);
  }

  function onEditDialog(id: string) {
    setEditId(id)
    setOpenDialog(true);
  }

  return (
    <Box m={4}>
      <OrganizationDialog editId={editId} onSubmitted={getOrganizations} open={openDialog} onClose={() => toggleDialog()} />
      <Stack direction="row" spacing={2}>
        <TextField
          name="Search"
          placeholder="Search"
          size="medium"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyUp={(e) => onSearch(e.key)}
          helperText="*Press enter to search"
        />
        {isAdmin() && (
          <Box>
            <Button
              size="small"
              variant="contained"
              onClick={() => toggleDialog()}
            >
              Create Organization
            </Button>
          </Box>
        )}
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Website</TableCell>
              <TableCell>Logo</TableCell>
              <TableCell>Created at</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {table ? (
              table.data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.website}</TableCell>
                  <TableCell>
                    <Image src={row.logo} alt="logo" width={80} height={80} />
                  </TableCell>
                  <TableCell>
                    {dayjs(row.created_at).format("DD-MM-YYYY HH:mm")}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        href={`/organization/${row.id}/person`}
                        variant="outlined"
                        size="small">
                        Detail
                      </Button>
                      {isAdmin() && (
                        <>
                          <Button
                          variant="outlined"
                          color="warning"
                          size="small"
                          onClick={() => onEditDialog(row.id)}
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
                        </>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>No data</TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
            {table && (
              <TablePagination
                colSpan={7}
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

export default OrganizationPage;
