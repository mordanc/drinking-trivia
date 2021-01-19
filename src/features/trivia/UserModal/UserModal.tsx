import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  CloseButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";

export default function UserModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [errorText, setErrorText] = useState("");

  const verifyInput = () => {
    if (!name) {
      setErrorText("Please enter a value for user name");
      return;
    }
    if (name.length > 20) {
      setErrorText("No more than 20 characters in user name");
      return;
    }
    onClose(name);
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter a user name</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={(e) => e.preventDefault()}>
              <VStack>
                <Input value={name} onChange={(e) => setName(e.target.value)} />

                {errorText ? (
                  <Alert status="error">
                    <AlertIcon />
                    <AlertDescription>{errorText}</AlertDescription>

                    <CloseButton
                      onClick={() => setErrorText("")}
                      position="absolute"
                      right="8px"
                      top="8px"
                    />
                  </Alert>
                ) : (
                  ""
                )}
                <Button
                  type="submit"
                  alignSelf="flex-end"
                  colorScheme="blue"
                  mr={3}
                  onClick={verifyInput}
                >
                  Submit
                </Button>
              </VStack>
            </form>
          </ModalBody>

          {/* <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={verifyInput}>
              Submit
            </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </>
  );
}
