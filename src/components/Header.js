import React from 'react';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Logo from '../components/images/Logo.png'; 
import { Link } from "react-router-dom";
import MenuTransitions from "../services/MenuTransitions";

export default function Header() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#398bf7", height: 70 }}>
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
          <Link to="/my-flats">
            <Button sx={{ color: "#FFFFFF", margin: "16px" }}>My Flats</Button>
          </Link>
          <Link to="/favorites">
            <Button sx={{ color: "#FFFFFF", margin: "16px" }}>Favorites</Button>
          </Link>
          <Link to="/all-users">
            <Button sx={{ color: "#FFFFFF", margin: "16px" }}>Users</Button>
          </Link>
          <Link to="/report">
            <Button sx={{ color: "#FFFFFF", margin: "16px" }}>Report</Button>
          </Link>
        </div>

        <MenuTransitions />
      </Toolbar>
    </AppBar>
  );
}
