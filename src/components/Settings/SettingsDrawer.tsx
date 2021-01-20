import React, { useEffect, useState } from "react";
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
  Stack,
  Flex,
  Switch,
  Center,
  useBreakpointValue,
  Accordion,
  AccordionButton,
  Text,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  selectAllCategories,
  selectConnectedUsers,
  selectIsHost,
  selectRoomName,
  setAllCategories,
} from "../triviaSlice";
import { PhoneIcon, Search2Icon } from "@chakra-ui/icons";

export default function SettingsDrawer({ isOpen, onClose, btnRef }) {
  const allCategories = useSelector(selectAllCategories);
  const connectedUsers = useSelector(selectConnectedUsers);
  const isHost = useSelector(selectIsHost);
  const roomName = useSelector(selectRoomName);

  const size = useBreakpointValue({
    sm: "full",
    md: "full",
    lg: "lg",
    xl: "lg",
  });

  const [filteredCategories, setFilteredCategories] = useState(allCategories);
  const [filter, setFilter] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  useEffect(() => {
    if (!filter) {
      setFilteredCategories(allCategories);
      return;
    }
    const filtered = allCategories.filter((category) =>
      category?.name?.toLowerCase()?.includes(filter?.toLowerCase())
    );

    setFilteredCategories(filtered);
  }, [filter, allCategories]);

  const toggleCategory = (categoryToSelect) => {
    const temp = allCategories.map((category) => {
      if (category.name === categoryToSelect.name) {
        return { ...category, selected: !category.selected };
      }
      return category;
    });

    dispatch(setAllCategories(temp));
    setFilteredCategories(temp);
  };

  const toggleAllCategories = () => {
    const temp = allCategories.map((category) => ({
      ...category,
      selected: !category.selected,
    }));

    dispatch(setAllCategories(temp));
    setFilteredCategories(temp);
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="left"
      onClose={onClose}
      size={size || "full"}
      // @ts-ignore
      finalFocusRef={btnRef}
    >
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Settings</DrawerHeader>

          <DrawerBody>
            <Flex alignItems="center">
              <Text fontWeight="bold" fontSize="xl">
                Room:&nbsp;
              </Text>
              <Text>
                {roomName ? roomName : "You have not connected to a room yet"}
              </Text>
            </Flex>

            <Flex alignItems="center" mb="1rem">
              <Text fontWeight="bold" fontSize="xl">
                Host:&nbsp;
              </Text>
              <Text>{`You are${isHost ? "" : " not"} the host`}</Text>
            </Flex>

            <Tabs variant="soft-rounded" colorScheme="blue">
              <TabList>
                <Tab color="white">User List</Tab>
                <Tab color="white">Categories</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  {connectedUsers.length
                    ? connectedUsers.map((user) => (
                        <Text key={user.id}>{user.name}</Text>
                      ))
                    : "Looks empty"}
                </TabPanel>
                <TabPanel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<Search2Icon color="gray.300" />}
                    />
                    <Input
                      placeholder="Type to filter..."
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    />
                  </InputGroup>

                  <Center pt="1rem">
                    <Button onClick={() => toggleAllCategories()}>
                      Toggle All
                    </Button>
                  </Center>

                  <Stack mt="1rem" textAlign="left">
                    {filteredCategories.map((category: any, index) => (
                      <Flex
                        onClick={() => toggleCategory(category)}
                        justifyContent="space-between"
                        key={index}
                      >
                        {category.name}
                        <Switch
                          onChange={() => toggleCategory(category)}
                          isChecked={category.selected}
                        />
                      </Flex>
                    ))}
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
}
