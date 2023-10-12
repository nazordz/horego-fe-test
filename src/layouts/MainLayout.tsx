import React from 'react';
import {
  AppBar,
  Container,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import GroupIcon from "@mui/icons-material/Group";
import LogoutIcon from '@mui/icons-material/Logout';
import { Outlet, useNavigate } from "react-router-dom";
import Loader from '../components/Loader';
import { signOut } from '@/services/AuthenticationService';
import { useAppSelector } from '@/store/hook';

const MainLayout: React.FC = () => {

  const navigate = useNavigate();
  const authenticationData = useAppSelector(state => state.authentication)
  
  function onLogout() {
    signOut();
    navigate('/login');
  }
  
  return (
    <Container>
      <AppBar></AppBar>
      <Drawer variant="permanent">
        <List sx={{ width: "100%", maxWidth: 360 }} component="nav">
          <ListItemButton href='/organization'>
            <ListItemIcon>
              <CorporateFareIcon />
            </ListItemIcon>
            <ListItemText>Organizations</ListItemText>
          </ListItemButton>
          {authenticationData.user?.role == 'admin' && (
            <ListItemButton href='/user'>
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText>Users</ListItemText>
            </ListItemButton>
          )}
          <ListItemButton onClick={() => onLogout()}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </ListItemButton>
        </List>
      </Drawer>
      <React.Suspense fallback={<Loader />}>
        <Outlet/>
      </React.Suspense>
    </Container>
  );
};

export default MainLayout;
