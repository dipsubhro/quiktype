const Key = ({
  char,
  large,
  isActive,
}: {
  char: string;
  large?: boolean;
  isActive: boolean;
}) => {
  const sizeStyle = large ? "w-40" : "w-16";
  const colorStyle = isActive
    ? "bg-gray-300 text-gray-900 border-gray-300 shadow-inner"
    : "bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700 hover:text-gray-100 cursor-pointer";

  return (
    <div
      className={`flex items-center justify-center h-10 border rounded-xl m-0.5 text-xs font-medium select-none transition-colors duration-150 ${sizeStyle} ${colorStyle}`}
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
    <div className="p-3 rounded-lg bg-gray-900 shadow-lg mt-8 max-w-md mx-auto">
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
      <div className="flex justify-center mt-1">
        <Key
          char="space"
          large={true}
          isActive={isKeyActive("space", activeKey)}
        />
      </div>
    </div>
  );
};

export default KeyboardDisplay;
