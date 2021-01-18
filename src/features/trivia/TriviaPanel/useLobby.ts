import { useToast } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import {
  selectQuestion,
  setSelectedAnswer,
  updateQuestion,
} from "../triviaSlice";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage"; // Name of the event
const SOCKET_SERVER_URL = "http://192.168.0.10:5000";

const useLobby = (
  questionObject = {},
  userName = `mordan${Math.floor(Math.random() * 100)}`
) => {
  //   const socket = io(SOCKET_SERVER_URL);
  const [connectedUsers, setConnectedUsers] = useState<any[]>([]);
  const [hosting, setHosting] = useState(false);
  const socketRef = useRef<any>();

  const currentQuestion = useSelector(selectQuestion);

  const toast = useToast();

  const dispatch = useDispatch();

  //   useEffect(() => {
  //     socketRef.current = io(SOCKET_SERVER_URL);
  //   });

  const connect = () => {
    socketRef.current = io(SOCKET_SERVER_URL);
    socketRef.current.emit("addUser", userName);

    socketRef.current.on("updateChat", (user, msg) => {
      console.log(msg);
      toast({
        title: "Success",
        description: msg,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      if (msg.includes("joined")) {
        setConnectedUsers([...connectedUsers, user]);
        console.log(connectedUsers);
      }
    });

    socketRef.current.on("hostMessage", (isHosting) => {
      setHosting(isHosting);
    });

    socketRef.current.on("selectChoice", (answer) => {
      if (!hosting) {
        dispatch(setSelectedAnswer(answer));
      }
    });

    socketRef.current.on("sendNewQuestion", () => {
      if (hosting) {
        socketRef.current.emit("updateCurrentQuestion", currentQuestion);
        console.log("sending question,", currentQuestion);
      }
    });

    socketRef.current.on("receiveNewQuestion", (question) => {
      if (!hosting) {
        dispatch(updateQuestion(question));
      }
    });
  };

  const addUser = () => {
    socketRef.current.emit("addUser", userName);
  };

  const switchRoom = (roomName) => {
    setConnectedUsers([]);
    socketRef.current.emit("switchRoom", roomName);

    if (!hosting) {
      socketRef.current.emit("requestCurrentQuestion");
    }
  };

  const emitSelectAnswer = (answer) => {
    socketRef.current.emit("selectChoice", answer);
  };

  const emitNewQuestion = (question) => {
    socketRef.current.emit("sendNewQuestion", question);
  };

  const requestNewQuestion = () => {
    socketRef.current.emit("requestCurrentQuestion");
  };

  return {
    addUser,
    switchRoom,
    connect,
    connectedUsers,
    hosting,
    emitSelectAnswer,
    emitNewQuestion,
    requestNewQuestion,
  };
};

export default useLobby;
