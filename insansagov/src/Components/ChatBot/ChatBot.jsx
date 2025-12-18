import React, { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import { MessageCircle, Send, X, MinusCircle, User, Bot } from "lucide-react";
import axios from "axios";
import parse from "html-react-parser";
import { DotLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { generateSlugUrl } from "../../Utils/urlUtils.utils";
import { formatDate } from "../../Utils/dateFormatter";

const ChatBot = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [isChatBotLoading, setIsChatBotLoading] = useState(false);
  const containerRef = useRef(null);
  const dragRef = useRef(null);
  const windowRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (windowRef.current && !windowRef.current.contains(event.target)) {
        setIsOpen(false); // Call function when clicking outside
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", isBot: true },
  ]);
  const [inputText, setInputText] = useState("");
  const [unreadCount, setUnreadCount] = useState(1);
  const [isBouncing, setIsBouncing] = useState(false);

  // React.useEffect(() => {
  //     let bounceInterval;
  //     if (unreadCount > 0 && !isOpen) {
  //         bounceInterval = setInterval(() => {
  //             setIsBouncing(true);
  //             setTimeout(() => setIsBouncing(false), 1000);
  //         }, 5000);
  //     }
  //     return () => clearInterval(bounceInterval);
  // }, [unreadCount, isOpen]);

  // Scroll to the bottom whenever items change
  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleGetExamDetails = async (e, event) => {
    e.preventDefault();

    const newUserMessage = {
      id: messages.length + 1,
      text: event.name,
      isBot: false,
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputText("");

    {
      try {
        setIsChatBotLoading(true);
        const response = await axios.post(
          `https://insansachatbot.onrender.com/api/chatbot/event`,
          { event_id: event.id },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setIsChatBotLoading(false);
        // console.log(response.data);
        const botResponse = response.data;
        var responseText = `Details of ${response.data.name}`;
        var responseSet = [];
        var responseType = "details";

        if (botResponse) {
          responseSet = [
            botResponse.date_of_commencement,
            botResponse._id,
            formatDate(botResponse.end_date),
            botResponse.apply_link,
            botResponse.name,
          ];
        } else {
          responseText = `${botResponse.response}`;
        }

        const newBotMessage = {
          id: messages.length + 2,
          text: responseText,
          type: responseType,
          set: responseSet,
          isBot: true,
        };
        // console.log(parse(responseText));
        setMessages((prevMessages) => [...prevMessages, newBotMessage]);
      } catch (err) {
        console.log(err);
      }

      if (!isOpen) {
        setUnreadCount((prevCount) => prevCount + 1);
        setIsBouncing(true);
        setTimeout(() => setIsBouncing(false), 1000);
      }
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (inputText.trim() === "") return;

    const newUserMessage = {
      id: messages.length + 1,
      text: inputText,
      isBot: false,
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputText("");

    {
      try {
        setIsChatBotLoading(true);
        // console.log
        const response = await axios.post(
          `https://insansachatbot.onrender.com/api/chatbot`,
          { query: newUserMessage.text },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setIsChatBotLoading(false);
        // console.log(response.data);
        const botResponse = response.data;
        var responseText = ``;
        var responseSet = [];
        var responseType = "events";

        if (botResponse.events) {
          responseText = `Events under ${response.data.organization.abbreviation}`;
          responseSet = botResponse.events;
        } else {
          // console.log(botResponse);
          responseText = `${botResponse.message || botResponse.response}`;
          responseType = `normal`;
        }

        const newBotMessage = {
          id: messages.length + 2,
          text: responseText,
          type: responseType,
          set: responseSet,
          isBot: true,
        };
        // console.log(parse(responseText));
        setMessages((prevMessages) => [...prevMessages, newBotMessage]);
      } catch (err) {
        console.log(err);
      }

      if (!isOpen) {
        setUnreadCount((prevCount) => prevCount + 1);
        setIsBouncing(true);
        setTimeout(() => setIsBouncing(false), 1000);
      }
    }
  };

  const fetchBotResponse = async (input) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return `I'm here to help with "${input}". Let me know more details!`;
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
    setIsBouncing(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleOpenChat}
        className={`fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600
          rounded-full shadow-lg hover:shadow-xl transition-all duration-300
          flex items-center justify-center text-white group
          ${
            isBouncing
              ? "animate-bounce"
              : "hover:scale-110 transform transition-transform duration-300"
          }`}
        aria-label="Open chat"
        onMouseEnter={() => setIsBouncing(true)}
        onMouseLeave={() => setIsBouncing(false)}
      >
        <MessageCircle
          className={`w-8 h-8 transition-transform duration-300
          ${isBouncing ? "scale-110" : "group-hover:scale-110"}`}
        />
        {unreadCount > 0 && (
          <div
            className="absolute -top-1 -right-1 h-6 w-6 bg-red-500 text-white text-xs
            font-bold flex items-center justify-center rounded-full shadow-lg border-2
            border-white animate-pulse"
          >
            {unreadCount}
          </div>
        )}
      </button>
    );
  }

  const addMessage = (type, message) => {
    const newBotMessage = {
      id: messages.length + 2,
      type: type,
      set: [message],
      isBot: true,
    };

    setMessages((prev) => [...prev, newBotMessage]);
  };

  const chatWindow = (
    <div
      id="chat-window"
      ref={windowRef}
      className={`z-50 fixed bottom-6 right-6 w-80 md:w-96 ${
        isMinimized ? "h-14" : "h-[600px]"
      }
     rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden
      ${isOpen ? "animate-in slide-in-from-right" : ""}`}
    >
      <div
        className="drag-handle p-3 bg-gradient-to-r from-indigo-500 to-purple-600
        text-white rounded-t-2xl flex justify-between items-center cursor-move
        hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
      >
        <div className="flex-1 text-center">
          <h2 className="text-sm font-medium">AskGyapak</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-white/20 rounded-full transition-all duration-300
              transform hover:scale-110 active:scale-95"
            aria-label="Minimize chat"
          >
            <MinusCircle size={16} />
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              setMessages([
                {
                  id: 1,
                  text: "Hello! How can I help you today?",
                  isBot: true,
                },
              ]);
            }}
            className="p-1 hover:bg-white/20 rounded-full transition-all duration-300
              transform hover:scale-110 active:scale-95"
            aria-label="Close chat"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div
            ref={containerRef}
            className="backdrop-blur-md bg-opacity-10 flex-1 p-4 overflow-y-auto bg-gray-900 h-[calc(100%-140px)] space-y-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {messages.length <= 1 && (
              <div className="max-w-2xl mx-auto my-4">
                {/* Header Section - Reduced padding and font sizes */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl p-4 text-white">
                  <div className="flex items-center justify-center mb-2">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                  <h1 className="text-xl font-bold text-center mb-1">
                    Welcome to AskGyapak your ChatAssistant
                  </h1>
                  <p className="text-sm text-center text-blue-100">
                    Your intelligent conversation partner
                  </p>
                </div>

                {/* Notes Section - Reduced padding and spacing */}
                <div className="bg-white rounded-b-xl shadow-lg p-4 border border-gray-200">
                  {/* Note 1 */}
                  <div className="mb-3">
                    <div className="flex items-center mb-1">
                      <div className="bg-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        1
                      </div>
                      <h2 className="ml-2 font-bold text-gray-800 text-sm">
                        Important Note
                      </h2>
                    </div>
                    <p className="text-gray-600 ml-8 text-sm">
                      <span className="text-blue-600 font-bold mr-1">
                        ✖ Close:
                      </span>{" "}
                      Deletes all responses. <br />
                      <span className="text-yellow-500 font-bold mr-1">
                        ➖ Minimize:
                      </span>{" "}
                      Saves the chat for later. <br />
                      <span className="text-red-500 font-bold mr-1">
                        🔄 Refresh:
                      </span>{" "}
                      Deletes all data.
                    </p>
                  </div>

                  {/* Note 2 */}
                  <div>
                    <div className="flex items-center mb-1">
                      <div className="bg-purple-600 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        2
                      </div>
                      <h2 className="ml-2 font-bold text-gray-800 text-sm">
                        Getting Started with AskGyapak
                      </h2>
                    </div>
                    <p className="text-gray-600 ml-8 text-sm">
                      AskGyapak provides all the information you need about any
                      government exam you're searching for. Use the{" "}
                      <span className="text-blue-600 font-bold">More Info</span>{" "}
                      button to visit a detailed page with comprehensive exam
                      details, or click{" "}
                      <span className="text-green-600 font-bold">Apply</span> to
                      be redirected to the official exam page for applications.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${
                  message.isBot ? "justify-start" : "justify-end"
                }
                  animate-in slide-in-from-${message.isBot ? "left" : "right"}`}
              >
                {message.isBot && (
                  <div
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600
                    flex items-center justify-center text-white transform hover:scale-110 transition-transform"
                  >
                    <Bot size={16} />
                  </div>
                )}

                <div
                  className={`max-w-[70%] p-4 rounded-2xl shadow-lg transition-all duration-300 ${
                    message.isBot
                      ? "bg-white shadow-sm"
                      : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                  }`}
                >
                  {message.type === "events" && (
                    <div className="space-y-2 space-x-2">
                      <p className="text-sm font-medium">{message.text}</p>
                      {message.set.map((event, idx) => (
                        <button
                          key={idx}
                          className="px-3 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-md hover:bg-purple-800"
                          onClick={(e) => {
                            handleGetExamDetails(e, event);
                          }}
                        >
                          {event.name}
                        </button>
                      ))}
                    </div>
                  )}
                  {message.type === "details" && (
                    <div className="space-y-2 space-x-2">
                      <p className="text-sm font-medium">{message.text}</p>
                      <button
                        className="px-3 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-md hover:bg-purple-800"
                        onClick={() => {
                          const url = message.set[3];
                          if (
                            url.startsWith("http://") ||
                            url.startsWith("https://")
                          ) {
                            window.open(url, "_blank");
                          } else {
                            console.error("Invalid URL:", url);
                          }
                        }}
                      >
                        Apply Link
                      </button>
                      {message.set[0] && (
                        <button
                          onClick={() =>
                            addMessage("start-date", message.set[0])
                          }
                          className="px-3 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-md hover:bg-purple-800"
                        >
                          Start Date
                        </button>
                      )}
                      {message.set[2] && (
                        <button
                          onClick={() => addMessage("end-date", message.set[2])}
                          className="px-3 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-md hover:bg-purple-800"
                        >
                          End Date
                        </button>
                      )}
                      <button
                        className="px-3 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-md hover:bg-purple-800"
                        onClick={() => {
                          const url = message.set[1];
                          navigate(
                            generateSlugUrl(message.set[4], message.set[1])
                          );
                          // if (url.startsWith("http://") || url.startsWith("https://")) {
                          //     window.location.href = url;
                          // } else {
                          //     console.error("Invalid URL:", url);
                          // }
                        }}
                      >
                        More Info
                      </button>
                    </div>
                  )}
                  {/* {message.type === "all" && (
                                        <div className="space-y-2 space-x-2">
                                            <p className="text-sm font-medium">Details for {message.set[4]}</p>
                                            <button
                                                className="px-3 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-md hover:bg-purple-800"
                                                onClick={() => {
                                                    const url = message.set[0];
                                                    if (url.startsWith("http://") || url.startsWith("https://")) {
                                                        window.open(url, "_blank");
                                                    } else {
                                                        console.error("Invalid URL:", url);
                                                    }
                                                }}
                                            >
                                                Apply Link
                                            </button>
                                            {
                                                message.set[1] && message.set[1]!="" && (
                                                    <button onClick={() => (addMessage("start-date", message.set[1]))} className="px-3 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-md hover:bg-purple-800">
                                                        Start Date
                                                    </button>
                                                )
                                            }
                                            {
                                                
                                                message.set[2] && message.set[2]!=="" && (
                                                    <button onClick={() => (addMessage("end-date", message.set[2]))} className="px-3 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-md hover:bg-purple-800">
                                                        End Date
                                                    </button>
                                                )
                                            }
                                            <button
                                                className="px-3 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-md hover:bg-purple-800"
                                                onClick={() => {
                                                    const url = message.set[3];
                                                    if (url.startsWith("http://") || url.startsWith("https://")) {
                                                        window.location.href = url;
                                                    } else {
                                                        console.error("Invalid URL:", url);
                                                    }
                                                }}
                                            >
                                                More Info
                                            </button>
                                        </div>
                                    )} */}
                  {/* {
                                        message.type === "date" && (
                                            <div className="space-y-2 space-x-2">
                                                <p className="text-sm font-medium">Details for {message.set[2]}</p>
                                                <button onClick={() => (addMessage("start-date", message.set[0]))} className="px-3 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-md hover:bg-purple-800">
                                                    Start Date
                                                </button>
                                                <button onClick={() => (addMessage("end-date", message.set[1]))} className="px-3 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-md hover:bg-purple-800">
                                                    End Date
                                                </button>
                                            </div>
                                        )
                                    }
                                    {
                                        message.type === "no-date" && (
                                            <div className="space-y-2 space-x-2">
                                                <p className="text-sm font-medium">Details for {message.set[2]}</p>
                                                <button
                                                    className="px-3 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-md hover:bg-purple-800"
                                                    onClick={() => {
                                                        const url = message.set[0];
                                                        if (url.startsWith("http://") || url.startsWith("https://")) {
                                                            window.open(url, "_blank");
                                                        } else {
                                                            console.error("Invalid URL:", url);
                                                        }
                                                    }}
                                                >
                                                    Apply Link
                                                </button>
                                                <button
                                                    className="px-3 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-md hover:bg-purple-800"
                                                    onClick={() => {
                                                        const url = message.set[1];
                                                        if (url.startsWith("http://") || url.startsWith("https://")) {
                                                            window.location.href = url;
                                                        } else {
                                                            console.error("Invalid URL:", url);
                                                        }
                                                    }}
                                                >
                                                    More Info
                                                </button>
                                            </div>
                                        )
                                    }
                                    {
                                        message.type === "no-apply-link" && (
                                            <div className="space-y-2 space-x-2">
                                                <p className="text-sm font-medium">Details for {message.set[3]}</p>
                                                <button onClick={() => (addMessage("start-date", message.set[1]))} className="px-3 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-md hover:bg-purple-800">
                                                    Start Date
                                                </button>
                                                <button onClick={() => (addMessage("end-date", message.set[2]))} className="px-3 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-md hover:bg-purple-800">
                                                    End Date
                                                </button>
                                                <button
                                                    className="px-3 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-md hover:bg-purple-800"
                                                    onClick={() => {
                                                        const url = message.set[0];
                                                        if (url.startsWith("http://") || url.startsWith("https://")) {
                                                            window.location.href = url;
                                                        } else {
                                                            console.error("Invalid URL:", url);
                                                        }
                                                    }}
                                                >
                                                    More Info
                                                </button>
                                            </div>
                                        )
                                    } */}
                  {message.type === "start-date" && (
                    <div className="space-y-4">
                      <p className="text-sm font-medium">
                        Start date for {message.set[1]}
                      </p>
                      <button className="px-5 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-md hover:bg-purple-800">
                        {message.set[0]}
                      </button>
                    </div>
                  )}
                  {message.type === "end-date" && (
                    <div className="space-y-4">
                      <p className="text-sm font-medium">
                        End date for {message.set[1]}
                      </p>
                      <button className="px-5 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-md hover:bg-purple-800">
                        {message.set[0]}
                      </button>
                    </div>
                  )}
                  {/* {
                                    message.type === "link" && (
                                        <div className="space-y-4">
                                            <p className="text-sm font-medium">Links for {message.set[2]}</p>
                                            <button
                                                className="px-5 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-md hover:bg-purple-800"
                                                onClick={() => {
                                                    const url = message.set[0];
                                                    if (url.startsWith("http://") || url.startsWith("https://")) {
                                                        window.open(url, "_blank");
                                                    } else {
                                                        console.error("Invalid URL:", url);
                                                    }
                                                }}
                                            >
                                                Apply Link
                                            </button>
                                            <button
                                                className="px-5 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-md hover:bg-purple-800"
                                                onClick={() => {
                                                    const url = message.set[1];
                                                    if (url.startsWith("http://") || url.startsWith("https://")) {
                                                        window.location.href = url;
                                                    } else {
                                                        console.error("Invalid URL:", url);
                                                    }
                                                }}
                                            >
                                                More Info
                                            </button>
                                        </div>
                                    )} */}
                  {!["events", "details"].includes(message.type) && (
                    <div className="text-sm flex flex-wrap">{message.text}</div>
                  )}
                </div>

                {!message.isBot && (
                  <div
                    className=" w-8 h-8 rounded-full bg-gray-200 border border-gray-400 flex items-center justify-center
                    transform hover:scale-110 transition-transform"
                  >
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}

            <DotLoader
              speedMultiplier={1.6}
              size={25}
              color={"#8854EB"}
              loading={isChatBotLoading}
            />
            {/* <SyncLoader size={6} color={'#8854EB'} loading={true} /> */}
          </div>

          <form
            onSubmit={handleSend}
            className="h-full p-4 border-t-gray-400 bg-white border-t"
          >
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-3 bg-gray-100 rounded-xl text-sm focus:outline-none
                  focus:ring-2 focus:ring-indigo-500 transition-all duration-300
                  hover:bg-gray-50"
              />
              <button
                type="submit"
                className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white
                  rounded-xl hover:shadow-lg focus:outline-none focus:ring-2
                  focus:ring-indigo-500 transition-all duration-300
                  transform hover:scale-105 active:scale-95"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );

  return (
    <Draggable
      ref={dragRef}
      disabled={!isDesktop}
      handle=".drag-handle"
      bounds="body"
    >
      {chatWindow}
    </Draggable>
  );
};

export default ChatBot;
