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
  Text,
  Flex,
  Container,
} from "@chakra-ui/react";

import hamburger from "../../app/images/menu-white-48dp.svg";

import SettingsDrawer from "./Settings/SettingsDrawer";
import { useSelector } from "react-redux";
import { selectIsHost } from "./triviaSlice";

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isHost = useSelector(selectIsHost);
  const btnRef = React.useRef();

  return (
    <Container>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        className="navbar"
      >
        <SettingsDrawer isOpen={isOpen} onClose={onClose} btnRef={btnRef} />
        <img
          onClick={onOpen}
          className={"settings_button"}
          src={hamburger}
          alt="Settings"
        />
        <Text>{isHost ? "You are the host" : "You are not the host"}</Text>
      </Flex>
    </Container>
  );
}
