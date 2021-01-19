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
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";

import hamburger from "../../app/images/menu-white-48dp.svg";

import SettingsDrawer from "./Settings/SettingsDrawer";
import { useSelector } from "react-redux";
import { selectIsHost, selectRoomName } from "./triviaSlice";
import { HamburgerIcon } from "@chakra-ui/icons";

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isHost = useSelector(selectIsHost);
  const roomName = useSelector(selectRoomName);

  const btnRef = React.useRef();

  const size = useBreakpointValue({
    sm: "sm",
    md: "md",
    lg: "lg",
    xl: "xl",
  });

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      className="navbar"
      p="1rem"
    >
      <SettingsDrawer isOpen={isOpen} onClose={onClose} btnRef={btnRef} />
      <IconButton
        onClick={onOpen}
        aria-label="Search database"
        icon={<HamburgerIcon />}
      />
      {roomName ? (
        <span>
          Connected to: <Text as="i">{roomName}</Text>
        </span>
      ) : (
        ""
      )}
      <Text>{isHost ? "You are the host" : "You are not the host"}</Text>
    </Flex>
  );
}
