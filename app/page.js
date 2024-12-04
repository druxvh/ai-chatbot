"use client";

import { useState } from "react";

export default function Home() {
  const [error, setError] = useState("");
  const [value, setValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const getResponse = async () => {
    if (!value) {
      setError("Error, ask a question?");
      return;
    }
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

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: "user", parts: value },
        { role: "bot", parts: data.text },
      ]);

      setValue("");
    } catch (error) {
      console.error(err);
      setError("Something went wrong, please try again later.");
    }
  };

  const buttonStyle =
    "px-4 py-2 bg-black text-white text-[12px] text-nowrap font-sans font-semibold";

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
          <button className={`${buttonStyle} rounded-lg`}>Surprise me</button>
        </div>

        <div className="flex mt-8 items-center gap-1">
          <input
            className="w-full p-2 font-sans text-sm tracking-wider outline-none "
            value={value}
            placeholder="How to make a car's engine?"
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />

          {!error ? (
            <button className={`${buttonStyle}`} onClick={getResponse}>
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
        <div className="flex flex-col gap-2 h-full mt-10 relative">
          {chatHistory.map((chatItem, _index) => (
            <p
              key={_index}
              className="py-2 px-3 w-fit max-w-[75%] bg-gray-700 text-white rounded-lg"
            >
              {chatItem.parts}
            </p>
          ))}
        </div>
      </div>
    </main>
  );
}
