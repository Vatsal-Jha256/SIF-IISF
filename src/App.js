// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Account from "./pages/Account";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/login" element={<Account />} />
        <Route path="/chatbot" element={<Chat />} />
      </Routes>
    </>
  );
};

export default App;
