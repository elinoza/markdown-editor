import { useState, useRef, useEffect } from "react";

import Header from "./Header";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownEditor = () => {
  const [value, setValue] = useState("");
  const [exportUrl, setExportUrl] = useState("");
  const [lastSelection, setLastSelection] = useState(null);

  const editorRef = useRef(null);
  const previewRef = useRef(null);
  const isSyncing = useRef(false);

  const textAreaSelection = (syntax) => {
    const txtarea = editorRef.current;
    const start = txtarea.selectionStart;
    const finish = txtarea.selectionEnd;
    const selection = txtarea.value.substring(start, finish);
    const newValue =
      txtarea.value.substring(0, start) +
      syntax.syntax +
      (finish - start === 0 ? syntax.sample : selection) +
      (syntax.double ? syntax.syntax : "") +
      txtarea.value.substring(finish);
    setValue(newValue);
    txtarea.focus();
  };

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
    reader.onload = (e) => {
      setValue(e.target.result);
    };
    if (file) {
      reader.readAsText(file);
    }
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
      <Header
        onChange={handleImport}
        onClick={handleExport}
        changeSyntax={(syntax) => textAreaSelection(syntax)}
        exportUrl={exportUrl}
      />
      <div className="flex mt-[36px] h-[895px]   ">
        <section className="flex-1 overflow-auto">
          <textarea
            ref={editorRef}
            onScroll={() => handleScroll(editorRef.current)}
            className="w-full h-full resize-none pt-5 px-5 pb-5 focus:outline-none "
            placeholder="Markdown here"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            autoFocus
          />
        </section>
        <section
          ref={previewRef}
          onScroll={() => handleScroll(previewRef.current)}
          className="hidden md:flex flex-1   overflow-auto  bg-[#F3E8DB] pt-5 pb-5 px-5 "
        >
          <article>
            <Markdown remarkPlugins={[remarkGfm]} className="prose  min-w-full">
              {value}
            </Markdown>
          </article>
        </section>
      </div>
    </>
  );
};
export default MarkdownEditor;
