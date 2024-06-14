import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Box } from "@chakra-ui/react";
import "./style.css";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

function textEditor() {
  const [editorHtml, setEditorHtml] = useState("");
  const handleEditorChange = (html) => {
    setEditorHtml(html);
  };

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["clean"],
      [{ indent: "-1" }, { indent: "+1" }],
    ],
  };

  return (
    <Box maxH="600px" minW={{ base: "10%", lg: "50%", xl: "70%" }} align="center" overflow="auto" my={10} mx={5}>
      <ReactQuill theme="snow" value={editorHtml} onChange={handleEditorChange} modules={modules} placeholder="Write Your Chapter Here or Generated With AI" />
    </Box>
  );
}

export default textEditor;
