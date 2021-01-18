import { Flex, Input, Button, HStack, useToast } from "@chakra-ui/react";
import React, { useState } from "react";

export default function RoomForm({ joinRoom }) {
  const [roomName, setRoomName] = useState("");

  const toast = useToast();
  return (
    <HStack mt="1rem">
      <Input
        value={roomName}
        onChange={(e) => setRoomName(e.target.value.toLowerCase())}
      />
      <Button
        onClick={() => {
          joinRoom(roomName);
        }}
      >
        Join Room
      </Button>
    </HStack>
  );
}
