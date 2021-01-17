import React from "react";
import logo from "./logo.svg";
import { Counter } from "./features/counter/Counter";
import "./App.css";
import TriviaPanel from "./features/trivia/TriviaPanel/TriviaPanel";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};

const customTheme = extendTheme({ config });

function App() {
  return (
    <div className="App">
      <ChakraProvider theme={customTheme}>
        <TriviaPanel />
      </ChakraProvider>
    </div>
  );
}

export default App;
