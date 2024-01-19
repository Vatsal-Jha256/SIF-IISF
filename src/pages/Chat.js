import React, { useState, useRef, useEffect } from "react";
import "./Chat.css";
import Send from "./../img/send.png";
import axios from "axios";
import AutoLinkText from "react-autolink-text2";

const Chat = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const languages = [
    "English",
    "Hindi",
    "Telugu",
    "Tamil",
    "Kannada",
    "Bengali",
    "Marathi",
    "Odia",
    "Assamese",
    "Kashmiri (Arabic)",
    "Punjabi",
    "Kashmiri (Devanagari)",
    "Sanskrit",
    "Bodo",
    "Maithili",
    "Santali",
    "Dogri",
    "Malayalam",
    "Sindhi (Arabic)",
    "Sindhi (Devanagari)",
    "Konkani",
    "Manipuri (Bengali)",
    "Manipuri (Meitei)",
    "Nepali",
    "Urdu",
  ];
  const baseURL = "https://sif.ngrok.io";

  const [userMessage, setUserMessage] = useState("");
  const [chatbotMessages, setChatbotMessages] = useState([]);
  const [replySpeed, setReplySpeed] = useState("0");
  const [firstQ, setFirstQ] = useState(true);
  const [recommendedQuestions] = useState([
    "Find an Aadhar Centre near me.",
    "Hospitals near me.",
    "Tell me about LULC 50k 2005-06 Maharashtra.",
    "What is Bhuvan?",
  ]);

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef(null);

  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [chatbotMessages]);

  const handleInputChange = (event) => {
    setUserMessage(event.target.value);
  };
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleSendMessage = async (question) => {
    if (selectedLanguage !== "English" && replySpeed === "0") {
      setChatbotMessages((prevMessages) => [
        ...prevMessages,
        { text: question, sender: "user" },
      ]);
      setChatbotMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "I'm sorry, 'Superfast' only works with English.\nPlease change your selected model and try again!",
          sender: "chatbot",
        },
      ]);
      setUserMessage("");
      return;
    }
    if (firstQ) setFirstQ(false);

    setChatbotMessages((prevMessages) => [
      ...prevMessages,
      { text: question, sender: "user" },
    ]);
    setUserMessage("");

    try {
      const response = await axios.post(
        baseURL + "/query",
        {
          query: question,
          lang: selectedLanguage,
          model: replySpeed,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const chatbotResponse = response.data;

      setChatbotMessages((prevMessages) => [
        ...prevMessages,
        { text: chatbotResponse, sender: "chatbot" },
      ]);

      speak(chatbotResponse);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage(userMessage);
    }
  };

  const speak = (text) => {
    if (selectedLanguage !== "English") {
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage;

    utterance.onend = () => {};

    window.speechSynthesis.speak(utterance);
  };

  const handleSpeedToggle = (speed) => {
    setReplySpeed(speed);
  };

  const handleQuestionSelect = (question) => {
    setUserMessage(question);
    handleSendMessage(question);
  };

  const handleMicButtonClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      let chunks = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/mp3" });
        const base64data = await convertBlobToBase64(audioBlob);
        console.log("Base64 Encoded Audio:", base64data);

        // Send base64 data to the server
        sendAudioToServer(base64data);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const sendAudioToServer = async (base64data) => {
    console.log("Sending audio", base64data);
    setChatbotMessages((prevMessages) => [
      ...prevMessages,
      { text: "What is Bhuvan?", sender: "user" },
    ]);
    setUserMessage("");
    try {
      const response = await axios.post(
        baseURL + "/upload-audio",
        {
          base64info: base64data,
          lang: selectedLanguage,
          model: replySpeed,
          query: "",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "true",
          },
        }
      );

      const chatbotResponse = response.data;

      setChatbotMessages((prevMessages) => [
        ...prevMessages,
        { text: chatbotResponse, sender: "chatbot" },
      ]);

      speak(chatbotResponse);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result.split(",")[1];
        resolve(base64data);
      };
      reader.readAsDataURL(blob);
    });
  };

  return (
    <div className="chatbot-container">
      <div className="chat-tray">
        <div className="speed-toggler">
          <button
            onClick={() => handleSpeedToggle("2")}
            className={replySpeed === "2" ? "active btn-1" : "btn-1"}
          >
            Normal
          </button>
          <button
            onClick={() => handleSpeedToggle("1")}
            className={replySpeed === "1" ? "active btn-2" : "btn-2"}
          >
            Fast
          </button>
          <button
            onClick={() => handleSpeedToggle("0")}
            className={replySpeed === "0" ? "active btn-3" : "btn-3"}
          >
            Superfast
          </button>
        </div>
        <div className="dropdown-container">
          <p className="dropdown-title">Language </p>
          <div className="dropdown">
            <button className="dropbtn">{selectedLanguage}</button>
            <div className="dropdown-content">
              {languages.map((language) => (
                <span
                  key={language}
                  onClick={() => handleLanguageChange(language)}
                >
                  {language}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="recommended-questions"
        style={{
          visibility: firstQ ? "visible" : "hidden",
          height: firstQ ? "auto" : "0px",
        }}
      >
        {recommendedQuestions.map((question, index) => (
          <button key={index} onClick={() => handleQuestionSelect(question)}>
            {question}
          </button>
        ))}
      </div>

      <div ref={messagesContainerRef} className="chatbot-messages">
        {chatbotMessages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            <AutoLinkText text={message.text}></AutoLinkText>
          </div>
        ))}
      </div>

      <div className="user-input">
        {/* Mic icon button added here */}
        <button className="mic-btn" onClick={handleMicButtonClick}>
          {isRecording ? "🔴" : "🎤"}
        </button>
        <input
          type="text"
          placeholder="Type your message..."
          value={userMessage}
          className="user-input-box"
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={() => handleSendMessage(userMessage)}
          className="input-btn"
        >
          <img src={Send} alt="" className="submit-logo" />
        </button>
      </div>
    </div>
  );
};

export default Chat;
