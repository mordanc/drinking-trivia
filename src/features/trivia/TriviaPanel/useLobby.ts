import { useToast } from "@chakra-ui/react";
import userEvent from "@testing-library/user-event";
import { connected } from "process";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import {
  addUserToList,
  removeUserFromList,
  selectQuestion,
  setIsHost,
  setRoomName,
  setSelectedAnswer,
  updateQuestion,
} from "../triviaSlice";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage"; // Name of the event
// const SOCKET_SERVER_URL = "https://drinking-trivia-backend.herokuapp.com/";
const SOCKET_SERVER_URL = process.env.BACKEND_URL || "http://192.168.0.10:5000";

const useLobby = () => {
  const [hosting, setHosting] = useState(false);
  const [toggle, setToggle] = useState(false);
  const socketRef = useRef<any>();

  const currentQuestion = useSelector(selectQuestion);

  const dispatch = useDispatch();

  const toast = useToast();

  const sendQuestion = (question) => {
    socketRef?.current?.emit("sendingQuestion", question);
  };

  const connect = (userName = `mordan${Math.floor(Math.random() * 100)}`) => {
    socketRef.current = io(SOCKET_SERVER_URL);
    socketRef.current.emit("addUser", userName);

    socketRef.current.on("switchRoomSuccess", (roomName, msg) => {
      toast({ status: "success", description: msg });
      dispatch(setRoomName(roomName));
      console.log("switch success,", msg);
    });

    socketRef.current.on("hostMessage", (isHosting) => {
      setHosting(isHosting);
      dispatch(setIsHost(isHosting));
    });

    socketRef.current.on("userJoined", ({ id, name }) => {
      console.log("user joined");

      if (name !== userName) {
        toast({
          status: "success",
          description: `${name} has joined the room`,
        });
        setToggle(!toggle);
        dispatch(addUserToList({ id, name }));
        console.log("adding user:", { id, name });
      }
    });

    socketRef.current.on("userLeft", ({ id, name }) => {
      console.log("user left");

      if (name !== userName) {
        toast({
          status: "error",
          description: `${name} has left the room`,
        });
        dispatch(removeUserFromList({ id, name }));
      }
    });

    socketRef.current.on("receiveQuestion", (question) => {
      console.log("receiving question from host", question);

      dispatch(updateQuestion(question));
    });

    socketRef.current.on("selectChoice", (answer) => {
      console.log("someone selected a choice", answer);

      dispatch(setSelectedAnswer(answer));
    });
  };

  const switchRoom = (roomName) => {
    socketRef.current.emit("switchRoom", roomName);
  };

  const updateCurrentQuestion = () => {
    socketRef.current.emit("updateCurrentQuestion", currentQuestion);
  };

  const selectAnswer = (answer) => {
    socketRef?.current?.emit("selectChoice", answer);
    dispatch(setSelectedAnswer(answer));
  };

  const updateSelectedCategories = (selectedCategories) => {
    socketRef.current.emit("updateSelectedCategories", selectedCategories);
  };

  const selectNewHotseat = (socketId) => {
    socketRef.current.emit("selectNewHotseat", socketId);
  };

  return {
    connect,
    switchRoom,
    updateCurrentQuestion,
    selectAnswer,
    hosting,
    sendQuestion,
    toggle,
  };
};

export default useLobby;
