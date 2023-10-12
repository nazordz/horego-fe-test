/* eslint-disable react-hooks/exhaustive-deps */
import { useAppSelector } from "@/store/hook";
import { SnackbarState, showSnackbar } from "@/store/slices/snackbarSlice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

interface IProps {
  roles: string[];
  children: React.ReactNode;
}

const ProtectedRoles: React.FC<IProps> = (props) => {
  const authenticate = useAppSelector((state) => state.authentication);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (authenticate.user && !props.roles.includes(authenticate.user.role)) {
      const snakebarState: SnackbarState = {
        isOpen: true,
        message: "Access Declined!",
        variant: "error",
      };
      dispatch(showSnackbar(snakebarState));
      navigate('/organization');
    }
  }, [authenticate]);

  const { children } = props;

  return <>{children}</>;
};

export default ProtectedRoles;
