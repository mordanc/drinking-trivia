import React, { useEffect, useState } from "react";
import {
  Button,
  Center,
  Container,
  Flex,
  Heading,
  HStack,
  Spinner,
  Stack,
  useToast,
  Text,
} from "@chakra-ui/react";
import he from "he";
import { useDispatch, useSelector } from "react-redux";

import { Tags } from "./Tags";
import {
  fetchQuestion,
  selectIsLoading,
  selectQuestion,
  selectSelectedAnswer,
  setSelectedAnswer,
} from "../triviaSlice";
import useLobby from "./useLobby";

import "./TriviaPanel.css";
import RoomForm from "./RoomForm";

export default function TriviaPanel() {
  const [options, setOptions] = useState<string[]>([]);
  const selectedAnswer = useSelector(selectSelectedAnswer);

  const question = useSelector(selectQuestion);
  const loading = useSelector(selectIsLoading);

  const dispatch = useDispatch();

  const toast = useToast();

  const getNewQuestion = () => {
    dispatch(fetchQuestion());
  };

  const {
    switchRoom,
    connect,
    connectedUsers,
    hosting,
    emitSelectAnswer,
    emitNewQuestion,
    requestNewQuestion,
  } = useLobby();

  const selectAnswer = (answer) => {
    emitSelectAnswer(answer);
    dispatch(setSelectedAnswer(answer));
  };

  useEffect(() => {
    getNewQuestion();
    connect();
  }, []);

  useEffect(() => {
    if (hosting) {
      emitNewQuestion(question);
    } else {
      requestNewQuestion();
    }
  }, [hosting]);

  useEffect(() => {
    if (!question) return;

    const allOptions = [
      ...question.incorrect_answers,
      question.correct_answer,
    ].sort(() => Math.random() - 0.5);

    setOptions(allOptions);

    if (hosting) {
      emitNewQuestion(question);
    }
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
          <Heading>
            {question ? he.decode(question?.question) : <span></span>}
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

            <Flex justifyContent="space-between">
              <Button onClick={() => selectAnswer("")}>Hide Answer</Button>
              <Button onClick={() => getNewQuestion()}>New Question</Button>
            </Flex>

            <RoomForm joinRoom={switchRoom} />

            <Text>{hosting ? "y" : "n"}</Text>

            <Flex>
              {connectedUsers.map((user, index) => (
                <li key={index}>{user}</li>
              ))}
            </Flex>
          </div>
        </Stack>
      )}
    </Container>
  );
}
