import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownEditor = () => {
  const [value, setValue] = useState("");
  return (
    <div className=" flex min-h-screen  ">
      <section className="w-[50%] min-h-screen pt-5 px-5 bg-red-200 border-r-2 border-indigo-600   ">
        {" "}
        <textarea
          className="w-full h-full  bg-yellow-200 resize-none focus:outline-none "
          placeholder="Feed me some Markdown 🍕"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />
      </section>

      <section className="w-[50%] min-h-screen bg-stone-200 pt-5 px-5 ">
        <article>
          <Markdown remarkPlugins={[remarkGfm]} className="prose  min-w-full">
            {value}
          </Markdown>
        </article>
      </section>
    </div>
  );
};
export default MarkdownEditor;
