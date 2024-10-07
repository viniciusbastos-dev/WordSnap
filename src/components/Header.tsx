import React from "react";

interface Props {}
const Header: React.FC<Props> = () => {
  return (
    <header className="bg-gray-100 px-6 py-4 flex rounded-2xl dark:bg-opacity-5">
      <h1 className="font-medium text-5xl uppercase tracking-[10px]">
        Word Quest
      </h1>
    </header>
  );
};

export default Header;
