import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Center,
  Flex,
  HStack,
  IconButton,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { AddIcon, InfoIcon, MinusIcon } from "@chakra-ui/icons";
import { useDispatch } from "react-redux";

export default function Bets() {
  const [betAmount, setBetAmount] = useState(0);

  const dispatch = useDispatch();

  const updateBetAmount = (operation) => {
    const newAmount = operation === "add" ? betAmount + 1 : betAmount - 1;

    setBetAmount(newAmount);
    dispatch(updateBetAmount(newAmount));
  };
  return (
    <VStack>
      {/* <ButtonGroup>
        <IconButton
          aria-label="Search database"
          icon={<MinusIcon />}
          onClick={() => updateBetAmount("subtract")}
        />
        <Button variant="ghost">{betAmount}</Button>
        <IconButton
          aria-label="Search database"
          icon={<AddIcon />}
          onClick={() => updateBetAmount("add")}
        />
      </ButtonGroup> */}
      <Flex alignItems="center">
        <Text>Bets: {betAmount}&nbsp;</Text>
        <Tooltip
          label="Select a number of seconds to bet against the person in the hotseat, or for yourself"
          fontSize="md"
        >
          <InfoIcon />
        </Tooltip>
      </Flex>
      <Slider
        // width="50%"
        max={12}
        min={0}
        aria-label="slider-ex-1"
        defaultValue={0}
        onChange={(e) => setBetAmount(e)}
        isReadOnly={false}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </VStack>
  );
}
