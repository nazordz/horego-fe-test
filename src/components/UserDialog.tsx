/* eslint-disable react-hooks/exhaustive-deps */
import { Organization } from "@/models";
import { fetchOrganizations } from "@/services/OrganizationService";
import { createUser, fetchUser, updateUser } from "@/services/UserService";
import { useAppDispatch } from "@/store/hook";
import { showSnackbar } from "@/store/slices/snackbarSlice";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

interface UserDialogProps {
  onClose: () => void;
  onSubmitted: () => Promise<void>;
  open: boolean;
  editId?: string;
}

const validationCreateSchema = Yup.object({
  name: Yup.string().required(),
  phone: Yup.string().required(),
  email: Yup.string().required(),
  password: Yup.string().required(),
  organizationId: Yup.string().required(),
  isManager: Yup.boolean().required(),
});
const validationEditSchema = Yup.object({
  name: Yup.string().required(),
  phone: Yup.string().required(),
  email: Yup.string().required(),
  organizationId: Yup.string().required(),
  isManager: Yup.boolean().required(),
  changePassword: Yup.boolean().required(),
  password: Yup.string().when("changePassword", {
    is: true,
    then(schema) {
      return schema.required();
    },
    otherwise(schema) {
      return schema.nullable();
    },
  }),
});

const UserDialog: React.FC<UserDialogProps> = (props) => {
  const dispatch = useAppDispatch();
  const [organizations, setOrganizations] = useState<Organization[]>([])
  async function getUser() {
    if (props.editId) {
      const usr = await fetchUser(props.editId);
      if (usr) {
        formik.setValues({
          email: usr.email,
          name: usr.name,
          phone: usr.phone,
          password: "",
          changePassword: false,
          isManager: usr.user_organization?.is_manager || false,
          organizationId: usr.user_organization?.organization_id || ''
        });
      }
    } else {
      formik.resetForm();
    }
  }
  async function getOrganizations() {
    const res = await fetchOrganizations(1, 100, '')
    if (res) {
      setOrganizations(res.data)
    }
  }

  useEffect(() => {
    getOrganizations()
  }, [])
  
  useEffect(() => {
    getUser();
  }, [props.editId]);

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      changePassword: false,
      organizationId: '',
      isManager: false
    },
    validationSchema: props.editId
      ? validationEditSchema
      : validationCreateSchema,
    async onSubmit(values) {
      let hasSaved = null;
      if (props.editId) {
        if (values.changePassword == false) {
          values.password = "";
        }
        hasSaved = await updateUser(values, props.editId);
      } else {
        hasSaved = await createUser(values);
      }
      if (hasSaved) {
        formik.resetForm();
        props.onSubmitted();
        dispatch(
          showSnackbar({
            isOpen: true,
            message: "Data created",
            variant: "success",
          })
        );
        props.onClose();
      } else {
        dispatch(
          showSnackbar({
            isOpen: true,
            message: "Can't create data",
            variant: "error",
          })
        );
      }
    },
  });

  return (
    <Dialog fullWidth open={props.open} onClose={props.onClose}>
      <DialogTitle>Form User</DialogTitle>
      <DialogContent>
        <Stack spacing={2} py={2}>
          <TextField
            name="name"
            fullWidth
            label="Name"
            onChange={formik.handleChange}
            value={formik.values.name}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            name="phone"
            label="Phone Number"
            onChange={formik.handleChange}
            value={formik.values.phone}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />
          <TextField
            name="email"
            label="Email"
            onChange={formik.handleChange}
            value={formik.values.email}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <FormControl>
            <InputLabel>Organization</InputLabel>
            <Select
              label="Organization"
              name="organizationId"
              onChange={formik.handleChange}
              value={formik.values.organizationId}
            >
              {organizations.map(org => (
                <MenuItem value={org.id} key={org.id}>
                  {org.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            label="Assigned as manager?"
            control={
              <Checkbox
                checked={formik.values.isManager}
                onChange={(_e, checked) => {
                  formik.setFieldValue("isManager", checked);
                }}
              />
            }
          />
          {props.editId ? (
            <>
              <FormControlLabel
                label="Change password ?"
                control={
                  <Checkbox
                    checked={formik.values.changePassword}
                    onChange={(_e, checked) => {
                      formik.setFieldValue("changePassword", checked);
                    }}
                  />
                }
              />
              {formik.values.changePassword && (
                <TextField
                  name="password"
                  label="Password"
                  type="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />
              )}
            </>
          ) : (
            <TextField
              name="password"
              label="Password"
              type="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="warning" onClick={props.onClose}>
          Close
        </Button>
        <LoadingButton
          loading={formik.isSubmitting}
          onClick={() => formik.submitForm()}
          variant="outlined"
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
export default UserDialog;
