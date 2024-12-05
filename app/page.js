"use client";

import { useState } from "react";
import surprisePrompts from "./surprisePrompts";

export default function Home() {
  const [error, setError] = useState("");
  const [value, setValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  // Fetch response
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
      const text = data.text;

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

  // Handles Clear functionality
  const handleClear = (e) => {
    e.preventDefault();
    setChatHistory([]);
  };

  // Handles SurpriseMe functionality
  const handleSurpriseMe = () => {
    // Random prompt logic
    const randomPrompt =
      surprisePrompts[Math.floor(Math.random() * surprisePrompts.length)];
    setValue(randomPrompt);
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
          <button
            className={`${buttonStyle} px-4 py-2 rounded-lg`}
            onClick={handleSurpriseMe}
          >
            Surprise me
          </button>
        </div>

        <div className="flex mt-6 items-center gap-1">
          <input
            className="w-full px-2 py-3 font-sans text-sm tracking-wider outline-none rounded-l-lg"
            value={value}
            placeholder="What's on your mind?"
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />

          <button
            className={`${buttonStyle} px-4 py-3 rounded-r-lg`}
            onClick={getResponse}
          >
            Ask
          </button>

          {error && (
            <p className="font-sans text-xs text-red-500 mt-4">{error}</p>
          )}
        </div>

        <div className="my-2.5 py-2 flex justify-end">
          <button
            className="text-xs text-gray-800 font-sans font-medium tracking-wider underline"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>

        {/* Search Results */}
        <div className="flex flex-col gap-3 h-full">
          {chatHistory.map((chatItem, _index) => (
            <div
              key={_index}
              className={`flex ${
                chatItem.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <p
                className={`py-2 px-3 w-fit max-w-[90%] text-sm text-white font-sans rounded-lg
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
