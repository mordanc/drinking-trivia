import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Flex,
  Heading,
  Spinner,
  Stack,
  useToast,
  Text,
  ButtonGroup,
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowForwardIcon, PhoneIcon, ViewOffIcon } from "@chakra-ui/icons";

import he from "he";
import { useDispatch, useSelector } from "react-redux";

import { Tags } from "./Tags";
import {
  fetchQuestion,
  selectIsLoading,
  selectQuestion,
  selectSelectedAnswer,
} from "../triviaSlice";
import useLobby from "./useLobby";

import "./TriviaPanel.css";
import RoomForm from "./RoomForm";
import UserModal from "../UserModal/UserModal";

export default function TriviaPanel() {
  const [options, setOptions] = useState<string[]>([]);
  const [userName, setUserName] = useState("");
  const selectedAnswer = useSelector(selectSelectedAnswer);

  const question = useSelector(selectQuestion);
  const loading = useSelector(selectIsLoading);

  const dispatch = useDispatch();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const getNewQuestion = () => {
    dispatch(fetchQuestion(sendQuestion));
    selectAnswer("");
  };

  const {
    selectAnswer,
    connect,
    switchRoom,
    hosting,
    toggle,
    sendQuestion,
  } = useLobby();

  const closeModal = (name) => {
    setUserName(name);
    onClose();
  };

  useEffect(() => {
    sendQuestion(question);
  }, [toggle]);

  useEffect(() => {
    if (!userName) {
      onOpen();
    }
  }, []);

  useEffect(() => {
    if (!userName) return;
    getNewQuestion();
    connect(userName);
  }, [userName]);

  useEffect(() => {
    if (!question) return;

    const allOptions = [
      ...question.incorrect_answers,
      question.correct_answer,
    ].sort(() => Math.random() - 0.5);

    setOptions(allOptions);
  }, [question]);

  const isSelectedAnswer = (answer) => answer === selectedAnswer;
  const isCorrectAnswer = (answer) => answer === question?.correct_answer;
  const getClassNameForAnswer = (answer) =>
    isSelectedAnswer(answer)
      ? isCorrectAnswer(answer)
        ? "correct-answer"
        : "incorrect-answer"
      : isCorrectAnswer(answer) && selectedAnswer && selectedAnswer !== answer
      ? "correct-answer"
      : "";

  return (
    <Container className="trivia-panel" maxW="4xl">
      {loading ? (
        <div className="loading-icon">
          <Spinner />
        </div>
      ) : (
        <Stack>
          <UserModal isOpen={isOpen} onClose={closeModal} />

          <Heading>
            {question ? he.decode(question.question) : <span></span>}
          </Heading>

          <Tags
            type={question?.type}
            difficulty={question?.difficulty}
            category={question?.category}
          />

          <div>
            {options.map((answer, index) => (
              <div
                className={`hoverable ${getClassNameForAnswer(answer)}`}
                key={index}
                onClick={() => selectAnswer(answer)}
              >
                {answer ? he.decode(answer) : <span></span>}
              </div>
            ))}

            <Flex justifyContent="space-between" alignItems="center">
              <Button
                rightIcon={<ViewOffIcon />}
                onClick={() => selectAnswer("")}
              >
                Hide Answer
              </Button>
              <Button
                disabled={!hosting}
                colorScheme="blue"
                onClick={() => getNewQuestion()}
                rightIcon={<ArrowForwardIcon />}
              >
                New Question
              </Button>
            </Flex>

            <RoomForm joinRoom={switchRoom} />

            {/* <Flex>
              {connectedUsers.map((user, index) => (
                <li key={index}>{user}</li>
              ))}
            </Flex> */}
          </div>
        </Stack>
      )}
    </Container>
  );
}
