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
import { FormPerson, Person } from "@/models";
import { useAppDispatch } from "@/store/hook";
import { showSnackbar } from "@/store/slices/snackbarSlice";
import { createPerson, fetchPerson, updatePerson } from "@/services/PersonService";

interface PersonDialogProps {
  onClose: () => void;
  onSubmitted: () => Promise<void>;
  organizationId: string;
  open: boolean;
  editId?: string;
}

const validationCreateSchema = Yup.object({
  name: Yup.string().required(),
  organization_id: Yup.string().required(),
  phone: Yup.string().required(),
  email: Yup.string().required().email(),
  avatar: Yup.mixed().required(),
});
const validationUpdateSchema = Yup.object({
  name: Yup.string().required(),
  organization_id: Yup.string().required(),
  phone: Yup.string().required(),
  email: Yup.string().required().email(),
  avatar: Yup.mixed().nullable(),
});

const InputHidden = styled("input")({
  display: "none",
});

const PersonDialog: React.FC<PersonDialogProps> = (props) => {
  const dispatch = useAppDispatch();
  const [editAvatar, setEditAvatar] = useState("");
  useEffect(() => {
    async function getData(id: string) {
      const data = await fetchPerson(id);
      if (data) {
        formik.setValues({
          name: data.name,
          email: data.email,
          phone: data.phone,
          organization_id: props.organizationId,
          avatar: null,
        });
        setEditAvatar(data.avatar);
      }
    }

    if (props.editId) {
      getData(props.editId);
    } else {
      formik.resetForm();
    }
    formik.setFieldValue('organization_id', props.organizationId);
  }, [props.editId]);

  const formik = useFormik<FormPerson>({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      organization_id: "",
      avatar: null,
    },
    validationSchema: props.editId ? validationUpdateSchema : validationCreateSchema,
    async onSubmit(values) {
      let hasSaved: Person | null = null;
      if (props.editId) {
        hasSaved = await updatePerson(values, props.editId);
      } else {
        hasSaved = await createPerson(values);
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
        setEditAvatar("");
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
      <DialogTitle>Form Person</DialogTitle>
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
          <Stack alignItems="center" spacing={1}>
            {formik.values.avatar ? (
              <Avatar
                src={URL.createObjectURL(formik.values.avatar)}
                sx={{
                  width: 128,
                  height: 128,
                }}
              />
            ) : (
              <>
                {editAvatar != "" ? (
                  <Avatar
                    src={editAvatar}
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
                  formik.setFieldValue("avatar", event.target.files![0]);
                }}
              />
              <Button variant="outlined" component="span">
                Choose avatar
              </Button>
            </label>
            <Typography variant="caption">*Avatar is required</Typography>
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

export default PersonDialog;
