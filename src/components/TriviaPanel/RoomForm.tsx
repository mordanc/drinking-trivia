import {
  Flex,
  Input,
  Button,
  HStack,
  useToast,
  FormControl,
} from "@chakra-ui/react";
import React, { useState } from "react";

export default function RoomForm({ joinRoom }) {
  const [roomName, setRoomName] = useState("");

  const toast = useToast();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <FormControl>
        <HStack mt="1rem">
          <Input
            value={roomName}
            onChange={(e) => setRoomName(e.target.value.toLowerCase())}
          />
          <Button
            type="submit"
            onClick={() => {
              joinRoom(roomName);
            }}
          >
            Join Room
          </Button>
        </HStack>
      </FormControl>
    </form>
  );
}
