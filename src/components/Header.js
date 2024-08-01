import React from 'react';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Logo from '../components/images/Logo.png'; 
import { Link } from "react-router-dom";
import MenuTransitions from "../services/MenuTransitions";

export default function Header() {
  const userLogeado = JSON.parse(localStorage.getItem("user"));
  const isAdmin = userLogeado?.role === 'admin';
  const isOwner = userLogeado?.role === 'owner';

  return (
    <AppBar position="static" sx={{ backgroundColor: "#2C3E50", height: 70 }}>
      <Toolbar>
        <Link to="/dashboard">
          <img
            src={Logo}
            alt="Logo"
            style={{ height: 90, cursor: "pointer" }}
          />
        </Link>

        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        ></Typography>

        <div>
          <Link to="/dashboard">
            <Button sx={{ color: "#FFFFFF", margin: "16px", ':hover': { color: '#95A5A6' } }}>Home</Button>
          </Link>
          {isOwner && (
            <Link to="/my-flats">
              <Button sx={{ color: "#FFFFFF", margin: "16px", ':hover': { color: '#95A5A6' } }}>My Flats</Button>
            </Link>
          )}
          <Link to="/favorites">
            <Button sx={{ color: "#FFFFFF", margin: "16px", ':hover': { color: '#95A5A6' } }}>Favorites</Button>
          </Link>
          {isAdmin && (
            <>
              <Link to="/all-users">
                <Button sx={{ color: "#FFFFFF", margin: "16px", ':hover': { color: '#95A5A6' } }}>Users</Button>
              </Link>
            </>
          )}
        </div>

        <MenuTransitions />
      </Toolbar>
    </AppBar>
  );
}
