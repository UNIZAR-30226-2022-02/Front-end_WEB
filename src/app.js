import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "https://serverrisk.herokuapp.com";

function App() {
  const [response, setResponse] = useState("");

 

  return (
    <p>
      It's <time dateTime={response}>{response}</time>
    </p>
  );
}

export default App;