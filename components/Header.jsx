import { useState, useRef, useEffect } from "react";

import { FaFileExport, FaFileImport } from "react-icons/fa6";
import clsx from "clsx";

const Header = ({ onChange, onClick, exportUrl, changeSyntax }) => {
  const stylingButtons = [
    {
      name: "B",
      syntax: { syntax: "**", double: true, sample: "Bold" },
      className: "font-bold",
    },
    {
      name: "I",
      syntax: { syntax: "*", double: true, sample: "Italic" },
      className: "italic ",
    },
    {
      name: "S",
      syntax: { syntax: "~", double: true, sample: "Strikethrough" },
      className: "line-through",
    },
    {
      name: "H1",
      syntax: { syntax: " # ", double: false, sample: "Heading1" },
      className: "font-xl font-bold",
    },
    {
      name: "H2",
      syntax: { syntax: " ## ", double: false, sample: "Heading2" },
      className: "font-xl font-bold",
    },
    {
      name: "H3",
      syntax: { syntax: " ### ", double: false, sample: "Heading2" },
      className: "font-xl font-bold",
    },
    {
      name: "H4",
      syntax: { syntax: " #### ", double: false, sample: "Heading3" },
      className: "font-xl font-bold",
    },
  ];
  return (
    <header className=" fixed  top-0  px-2 bg-[#025756] text-xl flex items-center justify-between text-stone-100 w-full h-9 ">
      <div className="hidden md:block ">
        {" "}
        {stylingButtons.map((button, i) => (
          <button
            key={i}
            onClick={() => changeSyntax(button.syntax)}
            className={clsx(button.className, "p-3")}
          >
            {button.name}
          </button>
        ))}{" "}
      </div>
      <div className="flex items-center">
        {" "}
        <span className=" group mx-2  flex items-center cursor-pointer relative hover">
          {" "}
          <input
            onChange={(e) => onChange(e)}
            type="file"
            id="avatar"
            name="avatar"
            accept=".md"
            className="opacity-0 w-full absolute !cursor-pointer"
          />
          <FaFileImport />
          <span className="absolute opacity-0 text-sm relativ text-black  bottom-[-50px] left-[-30px] group-hover:opacity-100">
            Import md file.
          </span>
        </span>
        <span
          onClick={onClick}
          className="mx-2 group relative flex items-center cursor-pointer"
        >
          <a href={exportUrl} download={"/document.md"}>
            {" "}
            <FaFileExport />
          </a>
          <span className="absolute opacity-0 text-sm text-black  bottom-[-50px] left-[-30px] group-hover:opacity-100">
            Export as md.
          </span>
        </span>
      </div>
    </header>
  );
};
export default Header;
