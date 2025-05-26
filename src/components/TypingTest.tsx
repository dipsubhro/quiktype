import React, { useState, useEffect, useRef, useCallback } from "react";
import { getRandomText } from "@/lib/textSamples";

const Key = ({
  char,
  large,
  isActive,
}: {
  char: string;
  large?: boolean;
  isActive: boolean;
}) => {
  const size = large ? "w-56" : "w-16";
  const colors = isActive
    ? "bg-gray-200 text-gray-900 border-gray-300 shadow-md"
    : "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-gray-100";

  return (
    <div
      className={`flex items-center justify-center h-12 border rounded-lg m-0.5 text-sm font-medium select-none transition-colors duration-100 ${size} ${colors}`}
      title={`Key: ${char.toUpperCase()}`}
    >
      {char.toUpperCase()}
    </div>
  );
};

const KeyboardDisplay = ({ activeKey }: { activeKey: string | null }) => {
  const rows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
  ];

  const isKeyActive = (keyChar: string, currentActiveKey: string | null) => {
    if (!currentActiveKey) return false;
    if (keyChar === "space") return currentActiveKey === " ";
    return currentActiveKey.toLowerCase() === keyChar.toLowerCase();
  };

  return (
    <div className="p-4 rounded-lg bg-gray-900 shadow-lg mt-10 max-w-3xl mx-auto select-none">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center mb-2">
          {row.map((char) => (
            <Key
              key={char}
              char={char}
              isActive={isKeyActive(char, activeKey)}
            />
          ))}
        </div>
      ))}
      <div className="flex justify-center">
        <Key char="space" large isActive={isKeyActive("space", activeKey)} />
      </div>
    </div>
  );
};

const TypingTest = () => {
  const [textToType, setTextToType] = useState(getRandomText());
  const [userInput, setUserInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);

  useEffect(() => {
    inputRef.current?.focus();
  }, [textToType]);

  const resetTest = () => {
    setTextToType(getRandomText());
    setUserInput("");
    setActiveKey(null);
    setStartTime(null);
    setWpm(0);
    setAccuracy(0);
    inputRef.current?.focus();
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key;
    if (key === "Escape") {
      resetTest();
      return;
    }
    if (key.length === 1 || key === "Spacebar" || key === " ") {
      const effectiveKey = key === "Spacebar" ? " " : key;
      setActiveKey(effectiveKey);
    }
  }, []);

  const handleKeyUp = useCallback(() => {
    setTimeout(() => setActiveKey(null), 150);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;
    setUserInput(currentValue);

    if (!startTime && currentValue.length > 0) {
      setStartTime(Date.now());
    }

    if (currentValue.length === 0) {
      setWpm(0);
      setAccuracy(0);
      setStartTime(null);
      return;
    }

    if (startTime) {
      const elapsedTimeInSeconds = (Date.now() - startTime) / 1000;

      let correctChars = 0;
      for (let i = 0; i < currentValue.length; i++) {
        if (currentValue[i] === textToType[i]) {
          correctChars++;
        }
      }

      const currentAccuracy =
        currentValue.length > 0
          ? Math.round((correctChars / currentValue.length) * 100)
          : 0;
      setAccuracy(currentAccuracy);

      if (elapsedTimeInSeconds > 0) {
        const correctWordsTyped = correctChars / 5;
        const currentWpm = Math.round(
          (correctWordsTyped / elapsedTimeInSeconds) * 60
        );
        setWpm(currentWpm);
      } else {
        setWpm(0);
      }
    }
  };

  const getCharClassBW = (
    originalChar: string,
    typedChar: string | undefined,
    isTyped: boolean
  ) => {
    if (!isTyped) {
      return "text-white opacity-60";
    }
    if (typedChar === originalChar) {
      return "text-white font-semibold";
    }
    return "text-white font-semibold line-through opacity-70";
  };

  const isTestComplete = userInput.length >= textToType.length;
  const isTestCorrect = userInput === textToType;

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6 relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(30,30,30,0.8), rgba(40,40,40,0.9)), url(/bg4.jpg)`,
      }}
    >
      <h1 className="text-4xl font-bold mb-8 drop-shadow-md select-none">
        <kbd className="px-1 py-1 rounded-md bg-gray-700 text-white border border-gray-600 shadow-inner">
          Quik
        </kbd>
        <span className="text-white">Type</span>
      </h1>

      <div className="text-2xl mb-8 p-6 border border-gray-600 rounded-lg shadow-lg w-full max-w-3xl bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 min-h-[120px] select-none">
        {textToType.split("").map((char, index) => (
          <span
            key={index}
            className={getCharClassBW(
              char,
              userInput[index],
              index < userInput.length
            )}
          >
            {char}
          </span>
        ))}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        className="w-full max-w-3xl p-4 text-xl rounded-lg border border-gray-600 bg-gray-900 text-gray-100 placeholder-gray-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
        placeholder="Start typing here..."
        aria-label="Typing input"
        disabled={isTestComplete}
        spellCheck={false}
        autoComplete="off"
      />

      {userInput.length > 0 && !isTestComplete && (
        <div className="mt-6 text-xl text-gray-200 flex space-x-8 font-medium select-none">
          <span>WPM: {wpm}</span>
          <span>Accuracy: {accuracy}%</span>
        </div>
      )}

      {isTestComplete && (
        <div className="mt-6 text-xl text-gray-200 font-semibold select-none">
          <div>Final WPM: {wpm}</div>
          <div>Accuracy: {accuracy}%</div>
          <div className="mt-2">
            {isTestCorrect ? (
              <span className="text-green-400">Excellent! Perfect match!</span>
            ) : (
              <span className="text-yellow-300">
                Good effort, keep practicing!
              </span>
            )}
          </div>
        </div>
      )}

      <h1 className="text-2xl font-semibold mt-10 text-gray-100 drop-shadow-md select-none flex items-center justify-center space-x-2">
        <span>press</span>
        <kbd className="px-3 py-1 rounded bg-gray-700 text-gray-300 border border-gray-600 shadow-inner font-mono">
          ESC
        </kbd>
        <span>to reset</span>
      </h1>

      <KeyboardDisplay activeKey={activeKey} />
    </div>
  );
};

export default TypingTest;
