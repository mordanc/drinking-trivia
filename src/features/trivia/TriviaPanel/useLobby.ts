import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage"; // Name of the event
const SOCKET_SERVER_URL = "http://192.168.0.10:5000";

const useChat = (questionObject = {}, userName = "mordan") => {
  const [messages, setMessages] = useState([]); // Sent and received messages
  const [hosting, setHosting] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<any[]>([]);
  const [currentRoom, setCurrentRoom] = useState("");

  const socketRef = useRef<any>();

  useEffect(() => {
    // Creates a WebSocket connection
    socketRef.current = io(SOCKET_SERVER_URL);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("adduser", userName);
    });

    socketRef.current.on("hostMessage", (isHosting) => {
      setHosting(isHosting);
    });

    socketRef.current.on("updatechat", (user, msg) => {
      // should probably store socket id along with userID, and use the socket id to remove ppl
      if (msg?.includes("joined")) {
        setConnectedUsers([...connectedUsers, user]);
      } else {
        setConnectedUsers(connectedUsers.map((userName) => userName !== user));
      }
    });

    socketRef.current.on("sendNewQuestion", () => {
      socketRef.current.emit("updateCurrentQuestion", questionObject);
    });

    // Destroys the socket reference
    // when the connection is closed
    return () => {
      socketRef.current.disconnect();
    };
  }, [userName, hosting]);

  const joinRoom = (roomName) => {
    socketRef.current.emit("switchRoom", roomName);
    setCurrentRoom(roomName);
  };

  const updateCurrentQuestion = (questionObject) => {
    socketRef.current.emit("updateCurrentQuestion", questionObject);
  };

  const requestCurrentQuestion = () => {
    socketRef.current.emit("requestCurrentQuestion");
  };

  // Sends a message to the server that
  // forwards it to all users in the same room
  const sendMessage = (messageBody) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      senderId: socketRef.current.id,
    });
  };

  return {
    messages,
    sendMessage,
    hosting,
    connectedUsers,
    joinRoom,
    currentRoom,
    requestCurrentQuestion,
  };
};

export default useChat;
