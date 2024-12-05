"use client";

import { useState } from "react";

export default function Home() {
  const [error, setError] = useState("");
  const [value, setValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const getResponse = async () => {

    // If no value
    if (!value) {
      setError("Error, ask a question?");
      return;
    }

    // Sends chathistory and prompt value wihin the body as the request 
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: chatHistory, prompt: value }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong with the API.");
      }

      const data = await response.json();
      const text = data.text

      // keeps the chat history between the user and model
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: "user", parts: value },
        { role: "model", parts: text },
      ]);

      setValue("");
    } catch (error) {
      console.error(err);
      setError("Something went wrong, please try again later.");
    }
  };

  const buttonStyle =
    "bg-black text-white text-xs text-nowrap font-sans font-semibold hover:bg-gray-800 hover:text-white transition ease-in-out delay-100";

  return (
    <main className="max-w-2xl h-screen mx-auto">
      <div className="px-2 h-full">
        <p className="py-10 text-2xl font-mono font-semibold text-center">
          AI Chatbot
        </p>

        <div className="flex items-center gap-4">
          <p className="text-base font-medium font-sans tracking-wide">
            What do you want to know?
          </p>
          <button className={`${buttonStyle} px-4 py-2 rounded-lg`}>Surprise me</button>
        </div>

        <div className="flex mt-6 items-center gap-1">
          <input
            className="w-full px-2 py-3 font-sans text-sm tracking-wider outline-none rounded-l-lg"
            value={value}
            placeholder="How to make a car's engine?"
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />

          {!error ? (
            <button 
            className={`${buttonStyle} px-4 py-3 rounded-r-lg`} 
            onClick={getResponse}>
              Ask
            </button>
          ) : (
            <button className={`${buttonStyle}`}>Clear</button>
          )}

          {error && (
            <p className="font-sans text-xs text-red-500 mt-4">{error}</p>
          )}
        </div>

        {/* Search Results */}
        <div className="flex flex-col gap-3 h-full mt-9">
          {chatHistory.map((chatItem, _index) => (
            <div
              key={_index}
              className={`flex ${
                chatItem.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <p
                className={`py-2 px-3 w-fit max-w-[90%] text-sm text-white rounded-lg
                ${chatItem.role === "user" ? "bg-black" : "bg-gray-700"}
                `}
              >
                {chatItem.parts}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
