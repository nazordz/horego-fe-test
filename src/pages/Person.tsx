/* eslint-disable react-hooks/exhaustive-deps */
import PersonDialog from "@/components/PersonDialog";
import { Organization, PaginateType, Person } from "@/models";
import { fetchOrganization } from "@/services/OrganizationService";
import { deletePerson, fetchPersons } from "@/services/PersonService";
import { isAdmin, isModerator as isManager } from "@/utils/permission";
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Link,
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
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type PersonProps = {
  organizationId: string;
};

const PersonPage: React.FC = () => {
  const { organizationId } = useParams<PersonProps>();
  const [table, setTable] = useState<PaginateType<Person> | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [editId, setEditId] = useState<string>("");
  const [organization, setOrganization] = useState<Organization | null>(null);

  async function fetchData() {
    if (organizationId) {
      const persons = await fetchPersons(organizationId, rowsPerPage, page);
      setTable(persons);
    }
  }

  async function getOrganization(orgId: string) {
    const org = await fetchOrganization(orgId);
    setOrganization(org);
  }

  useEffect(() => {
    if (organizationId) {
      getOrganization(organizationId);
    }
  }, [organizationId]);

  useEffect(() => {
    if (organizationId) {
      fetchData();
    }
  }, [organizationId, rowsPerPage, page]);

  function handleChangePage(_event: unknown, newPage: number) {
    setPage(newPage + 1);
  }

  function onRowsPerPageChange(event: React.ChangeEvent<HTMLInputElement>) {
    setRowsPerPage(Number(event.target.value));
    setPage(1);
  }

  async function onDelete(id: string) {
    await deletePerson(id);
    if (organizationId) {
      fetchData();
    }
  }

  function toggleDialog() {
    setEditId("");
    setOpenDialog(!openDialog);
  }
  function onEditDialog(id: string) {
    setEditId(id);
    setOpenDialog(true);
  }

  return (
    <Box m={4}>
      <Breadcrumbs>
        <Link underline="hover" href={"/organization"}>
          Organizations
        </Link>
        <Link underline="hover" href={"/organization"}>
          {organization?.name}
        </Link>
        <Typography>Persons</Typography>
      </Breadcrumbs>
      {organizationId && (
        <PersonDialog
          organizationId={organizationId}
          open={openDialog}
          editId={editId}
          onSubmitted={fetchData}
          onClose={() => toggleDialog()}
        />
      )}
      {(isAdmin() || isManager()) && (
        <Box my={2}>
          <Button
            size="small"
            variant="contained"
            onClick={() => toggleDialog()}
          >
            Create Person
          </Button>
        </Box>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Avatar</TableCell>
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
                  <TableCell>
                    <Avatar
                      sx={{ width: 56, height: 56 }}
                      src={row.avatar}
                      alt="avatar"
                    />
                  </TableCell>
                  <TableCell>
                    {dayjs(row.created_at).format("DD-MM-YYYY HH:mm")}
                  </TableCell>
                  <TableCell>
                    {(isAdmin() || isManager()) && (
                      <>
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
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell></TableCell>
              </TableRow>
            )}
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

export default PersonPage;
