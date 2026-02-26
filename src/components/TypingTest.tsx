import React, { useState, useEffect, useRef, useCallback } from "react";
import { getRandomText } from "@/lib/textSamples";
import { useTypingSound } from "@/hooks/useTypingSound";
import type { SoundType } from "@/hooks/useTypingSound";
import { Volume2, VolumeX } from "lucide-react";

const Key = ({
  char,
  large,
  isActive,
}: {
  char: string;
  large?: boolean;
  isActive: boolean;
  status?: "correct" | "incorrect" | "neutral";
}) => {
  const size = large ? "w-80" : "w-20";
  const colors = isActive
    ? status === "correct"
      ? "bg-green-500 text-white border-green-600 shadow-md"
      : status === "incorrect"
        ? "bg-red-500 text-white border-red-600 shadow-md"
        : "bg-primary text-primary-foreground border-primary shadow-md"
    : "bg-card text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground";

  return (
    <div
      className={`flex items-center justify-center h-12 border rounded-lg m-0.5 text-sm font-medium select-none transition-colors duration-100 ${size} ${colors}`}
      title={`Key: ${char.toUpperCase()}`}
    >
      {char.toUpperCase()}
    </div>
  );
};

const KeyboardDisplay = ({
  activeKey,
  keyStatus,
}: {
  activeKey: string | null;
  keyStatus: "correct" | "incorrect" | "neutral";
}) => {
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
    <div className="mt-10 max-w-6xl mx-auto select-none">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center mb-2">
          {row.map((char) => (
            <Key
              key={char}
              char={char}
              isActive={isKeyActive(char, activeKey)}
              status={isKeyActive(char, activeKey) ? keyStatus : undefined}
            />
          ))}
        </div>
      ))}
      <div className="flex justify-center">
        <Key
          char="space"
          large
          isActive={isKeyActive("space", activeKey)}
          status={isKeyActive("space", activeKey) ? keyStatus : undefined}
        />
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { playSound, isMuted, toggleMute, selectedSound, setSelectedSound } =
    useTypingSound();

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

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key;
      if (key === "Escape") {
        resetTest();
        return;
      }
      if (key === "Tab") {
        event.preventDefault();
        const sounds: SoundType[] = ["mechanical", "gaming", "click"];

        if (isMuted) {
          // Currently muted, switch to first sound and unmute
          toggleMute();
          setSelectedSound(sounds[0]);
        } else {
          const currentIndex = sounds.indexOf(selectedSound);
          if (currentIndex === sounds.length - 1) {
            // Last sound, switch to mute
            toggleMute();
          } else {
            // Next sound
            setSelectedSound(sounds[currentIndex + 1]);
          }
        }
        setIsDropdownOpen(true);
        return;
      }

      // Close dropdown on any other key press
      if (isDropdownOpen) {
        setIsDropdownOpen(false);
      }

      if (key.length === 1 || key === "Spacebar" || key === " ") {
        const effectiveKey = key === "Spacebar" ? " " : key;
        setActiveKey(effectiveKey);
        playSound();
      }
    },
    [playSound, selectedSound, setSelectedSound],
  );

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
          (correctWordsTyped / elapsedTimeInSeconds) * 60,
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
    isTyped: boolean,
  ) => {
    if (!isTyped) {
      return "text-foreground";
    }
    if (typedChar === originalChar) {
      return "text-green-500 font-semibold";
    }
    return "text-red-500 font-semibold line-through opacity-70";
  };

  const isTestComplete = userInput.length >= textToType.length;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative bg-transparent">
      <div className="absolute top-8 left-8 select-none">
        <div className="text-xl font-semibold text-muted-foreground drop-shadow-md flex items-center space-x-2">
          <span>press</span>
          <kbd className="px-2 py-1 rounded bg-muted text-muted-foreground border border-border shadow-inner font-mono text-sm">
            ESC
          </kbd>
          <span>to reset</span>
        </div>
      </div>

      <div className="absolute top-8 right-8 select-none">
        <div className="text-xl text-muted-foreground flex space-x-6 font-medium">
          <span>WPM: {wpm}</span>
          <span>Accuracy: {accuracy}%</span>
        </div>
      </div>
      <h1 className="text-4xl font-bold mb-8 drop-shadow-md select-none">
        <kbd className="px-1 py-1 rounded-md bg-muted text-muted-foreground border border-border shadow-inner">
          Quik
        </kbd>
        <span className="text-foreground">Type</span>
      </h1>

      <div
        className="text-4xl mb-8 w-full max-w-3xl min-h-[120px] select-none cursor-text outline-none text-center break-words"
        onClick={() => inputRef.current?.focus()}
      >
        {textToType.split("").map((char, index) => (
          <span
            key={index}
            className={`${getCharClassBW(
              char,
              userInput[index],
              index < userInput.length,
            )} relative`}
          >
            {index === userInput.length && !isTestComplete && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 text-xs text-muted-foreground whitespace-nowrap font-mono z-10 bg-background px-1 rounded">
                wpm: {wpm}
              </div>
            )}
            {char}
          </span>
        ))}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        className="opacity-0 absolute inset-0 -z-10 h-0 w-0"
        placeholder="Start typing here..."
        aria-label="Typing input"
        disabled={isTestComplete}
        spellCheck={false}
        autoComplete="off"
      />

      {isTestComplete && (
        <div className="mt-6 text-xl text-foreground font-semibold select-none">
          <div className="mt-2">
            <span className="text-foreground">
              {(() => {
                if (accuracy === 100) return "Flawless victory! Perfection.";
                if (wpm >= 100 && accuracy >= 95)
                  return "Godlike typing! You're unstoppable!";
                if (wpm >= 80 && accuracy >= 95)
                  return "Lightning fast and precise! Amazing!";
                if (wpm >= 60 && accuracy >= 90)
                  return "Impressive speed and accuracy! Keep it up!";
                if (wpm >= 60 && accuracy < 90)
                  return "Fast fingers! Focus a bit more on accuracy.";
                if (wpm >= 40 && accuracy >= 95)
                  return "Great precision! Try to push your speed a bit.";
                if (wpm >= 40 && accuracy >= 80)
                  return "Good job! You're getting better.";
                if (accuracy < 80)
                  return "Accuracy is key. Slow down and focus on precision.";
                return "Keep practicing! Every keystroke counts.";
              })()}
            </span>
          </div>
        </div>
      )}

      <KeyboardDisplay
        activeKey={activeKey}
        keyStatus={
          activeKey
            ? activeKey.toLowerCase() ===
              textToType[userInput.length]?.toLowerCase()
              ? "correct"
              : "incorrect"
            : "neutral"
        }
      />

      <div className="absolute bottom-8 left-8 select-none">
        <div className="text-xl font-semibold text-muted-foreground drop-shadow-md flex items-center space-x-2">
          <span>press</span>
          <kbd className="px-2 py-1 rounded bg-muted text-muted-foreground border border-border shadow-inner font-mono text-sm">
            tab
          </kbd>
          <span>to switch key sound effect</span>
          <div className="relative inline-flex items-center ml-2">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center p-2 rounded-md bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              title="Sound settings"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            {isDropdownOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-32 bg-popover text-popover-foreground rounded-md shadow-lg border border-border overflow-hidden z-50">
                {(["mechanical", "gaming", "click"] as SoundType[]).map(
                  (sound) => (
                    <button
                      key={sound}
                      onClick={() => {
                        setSelectedSound(sound);
                        if (isMuted) toggleMute();
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors ${
                        !isMuted && selectedSound === sound
                          ? "bg-accent text-accent-foreground"
                          : ""
                      }`}
                    >
                      <span className="capitalize">{sound}</span>
                    </button>
                  ),
                )}
                <button
                  onClick={() => {
                    if (!isMuted) toggleMute();
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors ${
                    isMuted ? "bg-accent text-accent-foreground" : ""
                  }`}
                >
                  <span className="capitalize">Mute</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingTest;
