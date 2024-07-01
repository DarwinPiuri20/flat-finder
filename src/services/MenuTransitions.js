import { Menu } from "@mui/base/Menu";
import { MenuButton } from "@mui/base/MenuButton";
import { MenuItem } from "@mui/base/MenuItem";
import * as React from "react";
import { PopupContext } from "@mui/base/Unstable_Popup";
import { CssTransition } from "@mui/base/Transitions";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "@mui/base/Dropdown";

import personImage from "../components/images/person2.png";
import i1 from "../components/images/i1.png";
import i2 from "../components/images/i2.png";
import i3 from "../components/images/i3.png";

export default function MenuTransitions() {
  const navigate = useNavigate();

  const createHandleMenuClick = (menuItem) => {
    return () => {
      if (menuItem === "Log out") {
        // Aquí puedes agregar la lógica de cierre de sesión
      }

      if (menuItem === "Profile") {
        navigate("/profile");
      }

      if (menuItem === "Account") {
        navigate("/profile/edit");
      }
    };
  };

  return (
    <Dropdown>
      <MenuButton>
        <div
          id="dropdownAvatarNameButton"
          data-dropdown-toggle="dropdownAvatarName"
          className="flex items-center text-sm pe-1 font-medium rounded-full md:me-0 text-gray-900"
        >
          <img
            src={personImage}
            alt="person"
            style={{ width: "30px", height: "30px", borderRadius: "50%" }}
          />
          <span id="nameUserLog"></span>
          <svg
            className="w-2.5 h-2.5 ms-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </div>
      </MenuButton>
      <Menu slots={{ listbox: AnimatedListbox }}>
        <MenuItem onClick={createHandleMenuClick("Profile")}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={i1}
              alt="person"
              style={{
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                marginRight: "15px",
              }}
            />
            My Profile
          </div>
        </MenuItem>
        <MenuItem onClick={createHandleMenuClick("Account")}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={i2}
              alt="person"
              style={{
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                marginRight: "15px",
              }}
            />
            Account Settings
          </div>
        </MenuItem>
        <MenuItem onClick={createHandleMenuClick("Log out")}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={i3}
              alt="person"
              style={{
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                marginRight: "15px",
              }}
            />
            Log out
          </div>
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}

const AnimatedListbox = React.forwardRef(function AnimatedListbox(props, ref) {
  const { ownerState, ...other } = props;
  const popupContext = React.useContext(PopupContext);

  if (popupContext == null) {
    throw new Error(
      "The `AnimatedListbox` component cannot be rendered outside a `Popup` component"
    );
  }

  const verticalPlacement = popupContext.placement.split("-")[0];

  return (
    <CssTransition
      className={`placement-${verticalPlacement}`}
      enterClassName="open"
      exitClassName="closed"
    >
      <Listbox {...other} ref={ref} />
    </CssTransition>
  );
});

const Listbox = styled("ul")(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 6px;
  margin: 12px 0;
  min-width: 200px;
  border-radius: 12px;
  overflow: auto;
  outline: 0px;
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  box-shadow: 0px 4px 30px ${
    theme.palette.mode === "dark" ? grey[900] : grey[200]
  };
  z-index: 1;

  .closed & {
    opacity: 0;
    transform: scale(0.95, 0.8);
    transition: opacity 200ms ease-in, transform 200ms ease-in;
  }
  
  .open & {
    opacity: 1;
    transform: scale(1, 1);
    transition: opacity 100ms ease-out, transform 100ms cubic-bezier(0.43, 0.29, 0.37, 1.48);
  }

  .placement-top & {
    transform-origin: bottom;
  }

  .placement-bottom & {
    transform-origin: top.
  }
  `
);

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};
