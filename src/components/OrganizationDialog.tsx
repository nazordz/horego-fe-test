/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import {
  createOrganization,
  fetchOrganization,
  updateOrganization,
} from "@/services/OrganizationService";
import { FormOrganization, Organization } from "@/models";
import { useAppDispatch } from "@/store/hook";
import { showSnackbar } from "@/store/slices/snackbarSlice";

interface OrganizationDialogProps {
  onClose: () => void;
  onSubmitted: () => Promise<void>;
  open: boolean;
  editId?: string;
}

const validationCreateSchema = Yup.object({
  name: Yup.string().required(),
  phone: Yup.string().required(),
  email: Yup.string().required().email(),
  website: Yup.string().required(),
  logo: Yup.mixed().required(),
});
const validationUpdateSchema = Yup.object({
  name: Yup.string().required(),
  phone: Yup.string().required(),
  email: Yup.string().required().email(),
  website: Yup.string().required(),
  logo: Yup.mixed().nullable(),
});

const InputHidden = styled("input")({
  display: "none",
});

const OrganizationDialog: React.FC<OrganizationDialogProps> = (props) => {
  const dispatch = useAppDispatch();
  const [editLogo, setEditLogo] = useState("");
  useEffect(() => {
    async function getData(id: string) {
      const data = await fetchOrganization(id);
      if (data) {
        formik.setValues({
          name: data.name,
          email: data.email,
          phone: data.phone,
          website: data.website,
          logo: null,
        });
        setEditLogo(data.logo);
      }
    }
    if (props.editId) {
      getData(props.editId);
    } else {
      formik.resetForm();
    }
  }, [props.editId]);

  const formik = useFormik<FormOrganization>({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      website: "",
      logo: null,
    },
    validationSchema: props.editId ? validationUpdateSchema : validationCreateSchema,
    async onSubmit(values) {
      let hasSaved: Organization | null = null;
      if (props.editId) {
        hasSaved = await updateOrganization(values, props.editId);
      } else {
        hasSaved = await createOrganization(values);
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
        setEditLogo("");
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
      <DialogTitle>Form Organization</DialogTitle>
      <DialogContent dividers>
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
          <TextField
            name="website"
            label="Website"
            onChange={formik.handleChange}
            value={formik.values.website}
            error={formik.touched.website && Boolean(formik.errors.website)}
            helperText={formik.touched.website && formik.errors.website}
          />
          <Stack alignItems="center" spacing={1}>
            {formik.values.logo ? (
              <Avatar
                src={URL.createObjectURL(formik.values.logo)}
                sx={{
                  width: 128,
                  height: 128,
                }}
              />
            ) : (
              <>
                {editLogo != "" ? (
                  <Avatar
                    src={editLogo}
                    sx={{
                      width: 128,
                      height: 128,
                    }}
                  />
                ) : (
                  <ImageIcon sx={{ fontSize: 128 }} color="action" />
                )}
              </>
            )}
            <label htmlFor="icon-button-file">
              <InputHidden
                accept="image/*"
                id="icon-button-file"
                type="file"
                onChange={(event) => {
                  formik.setFieldValue("logo", event.target.files![0]);
                }}
              />
              <Button variant="outlined" component="span">
                Choose logo
              </Button>
            </label>
            <Typography variant="caption">*Logo is required</Typography>
          </Stack>
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

export default OrganizationDialog;
