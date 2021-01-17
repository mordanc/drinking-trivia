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
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  selectAllCategories,
  setAllCategories,
} from "../triviaSlice";

export default function SettingsDrawer({ isOpen, onClose, btnRef }) {
  const allCategories = useSelector(selectAllCategories);

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
      size={"full"}
      // @ts-ignore
      finalFocusRef={btnRef}
    >
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Categories</DrawerHeader>

          <DrawerBody>
            <Input
              placeholder="Type to filter..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />

            <Center pt="1rem">
              <Button onClick={() => toggleAllCategories()}>Toggle All</Button>
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
