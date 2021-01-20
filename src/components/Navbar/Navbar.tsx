import React from "react";
import {
  useDisclosure,
  Flex,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";

import SettingsDrawer from "../Settings/SettingsDrawer";
import { useSelector } from "react-redux";
import { selectIsHost, selectRoomName } from "../triviaSlice";
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
    </Flex>
  );
}
