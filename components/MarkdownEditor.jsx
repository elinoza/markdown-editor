import { useState, useRef, useEffect } from "react";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaFileExport, FaFileImport } from "react-icons/fa6";

const MarkdownEditor = () => {
  const [value, setValue] = useState("");
  const [exportUrl, setExportUrl] = useState("");
  const editorRef = useRef(null);
  const previewRef = useRef(null);
  const isSyncing = useRef(false);

  const handleScroll = (currentElement) => {
    if (isSyncing.current) return;
    isSyncing.current = true;

    const otherElement =
      currentElement === editorRef.current
        ? previewRef.current
        : editorRef.current;
    const percentage =
      currentElement.scrollTop /
      (currentElement.scrollHeight - currentElement.clientHeight);
    otherElement.scrollTop =
      percentage * (otherElement.scrollHeight - otherElement.clientHeight);

    setTimeout(() => {
      isSyncing.current = false;
    }, 50);
  };

  const handleExport = () => {
    if (exportUrl) {
      URL.revokeObjectURL(exportUrl);
      setExportUrl(null);
    }
    const blob = new Blob([value], { type: "text/markdown" });
    const url = window.URL.createObjectURL(blob);
    setExportUrl(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = (e) => {
      setValue(e.target.result);
    };
  };

  const handleSample = async () => {
    try {
      const response = await fetch("/sample.md");
      if (response.ok) {
        const data = await response.text();
        setValue(data);
      } else {
        throw new Error(
          `Failed to fetch: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error importing markdown file:", error);
    }
  };

  useEffect(() => {
    handleSample();
  }, []);

  return (
    <>
      <header className="bg-black text-xl flex items-center text-white w-full h-9 ">
        <span
          onClick={handleExport}
          className=" mx-2  flex items-center cursor-pointer relative"
        >
          {" "}
          <input
            onChange={(e) => handleImport(e)}
            type="file"
            id="avatar"
            name="avatar"
            accept=".md"
            className="opacity-0 w-full absolute cursor-pointer"
          />
          <FaFileImport />
        </span>
        <span
          onClick={handleExport}
          className="mx-2 flex items-center cursor-pointer"
        >
          <a href={exportUrl} download={"/document.md"}>
            {" "}
            <FaFileExport />
          </a>
        </span>
      </header>
      <div className="flex h-[895px]  ">
        <div className="flex-1 overflow-auto">
          <textarea
            ref={editorRef}
            onScroll={() => handleScroll(editorRef.current)}
            className="w-full h-full resize-none pt-5 px-5 focus:outline-none "
            placeholder="Feed me some Markdown 🍕"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
          />
        </div>

        <div
          ref={previewRef}
          onScroll={() => handleScroll(previewRef.current)}
          className="flex-1 overflow-auto  bg-stone-200 pt-5 px-5 "
        >
          <article>
            <Markdown
              remarkPlugins={[remarkGfm]}
              className="prose text-5xl min-w-full"
            >
              {value}
            </Markdown>
          </article>
        </div>
      </div>
    </>
  );
};
export default MarkdownEditor;
