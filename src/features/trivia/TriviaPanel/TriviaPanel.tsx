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
} from "@chakra-ui/react";
import { Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import he from "he";

import { HttpService } from "../../../httpService";

import { Question } from "../types";

import "./TriviaPanel.css";
import { Tags } from "./Tags";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestion, selectIsLoading, selectQuestion } from "../triviaSlice";

export default function TriviaPanel() {
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState("");

  const question = useSelector(selectQuestion);
  const loading = useSelector(selectIsLoading);

  const dispatch = useDispatch();

  const getNewQuestion = () => {
    dispatch(fetchQuestion());
  };

  useEffect(() => {
    getNewQuestion();
  }, []);

  useEffect(() => {
    console.log(question);
    if (!question) return;
    const allOptions = [
      ...question.incorrect_answers,
      question.correct_answer,
    ].sort(() => Math.random() - 0.5);

    setOptions(allOptions);
  }, [question]);

  const isSelectedAnswer = (option) => option === selectedOption;
  const isCorrectAnswer = (answer) => answer === question?.correct_answer;

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
                className={`hoverable ${
                  isSelectedAnswer(answer)
                    ? isCorrectAnswer(answer)
                      ? "correct-answer"
                      : "incorrect-answer"
                    : isCorrectAnswer(answer) &&
                      selectedOption &&
                      selectedOption !== answer
                    ? "correct-answer"
                    : ""
                }`}
                key={index}
                onClick={() => setSelectedOption(answer)}
              >
                {answer ? he.decode(answer) : <span></span>}
              </div>
            ))}
            <Flex justifyContent="space-between">
              <Button onClick={() => setSelectedOption("")}>Hide Answer</Button>
              <Button onClick={() => getNewQuestion()}>New Question</Button>
            </Flex>
          </div>
        </Stack>
      )}
    </Container>
  );
}
