import React from "react";
import { Flex, Tag, TagLabel, TagLeftIcon } from "@chakra-ui/react";

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "easy":
      return "green";
    case "medium":
      return "orange";
    case "hard":
      return "red";
    default:
      return "green";
  }
};

export const Tags = ({ type, difficulty, category }) => {
  return (
    <Flex>
      <Tag mr={2} size="lg" variant="subtle">
        <TagLabel>
          {type === "boolean" ? "True or False" : "Multiple Choice"}
        </TagLabel>
      </Tag>

      <Tag
        variant="subtle"
        size="lg"
        mr={2}
        colorScheme={getDifficultyColor(difficulty)}
      >
        <TagLabel>{difficulty}</TagLabel>
      </Tag>

      <Tag size="lg" variant="subtle" colorScheme="cyan">
        <TagLeftIcon boxSize="12px" />
        <TagLabel>{category}</TagLabel>
      </Tag>
    </Flex>
  );
};
