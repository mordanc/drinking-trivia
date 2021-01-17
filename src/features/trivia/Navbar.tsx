import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Input,
  useDisclosure,
} from "@chakra-ui/react";

import hamburger from "../../app/images/menu-white-48dp.svg";

import SettingsDrawer from "./Settings/SettingsDrawer";

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  return (
    <div className="navbar">
      <SettingsDrawer isOpen={isOpen} onClose={onClose} btnRef={btnRef} />
      <img
        onClick={onOpen}
        className={"settings_button"}
        src={hamburger}
        alt="Settings"
      />
    </div>
  );
}
