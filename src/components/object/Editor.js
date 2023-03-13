import { default as React, useEffect, useRef, useState } from "react";

import { supabase } from "../../api/supabaseClient";
import EditorJS from "@editorjs/editorjs";

import "./Editor.css";
import { useNavigate } from "react-router-dom";
import { BLOCK_TOOLS } from "../../tools/constants";

import { useCellStore } from "../NewObject/GridColumn"
const EDITTOR_HOLDER_ID = "editorjs";

const Editor = ({
  data,
  saveTrigger,
  setSaveTrigger,
  id,
  editorID,
  isDragging,
  useCase = "",
}) => {
  const ejInstance = useRef(null);
  const [editorData, setEditorData] = React.useState(data);
  const navigate = useNavigate();
  const [customID, setCustomID] = useState(() => {
    return editorID ? editorID : EDITTOR_HOLDER_ID;
  });

  useEffect(() => {
    return () => {
      if (!ejInstance.current) {
        initEditor();
      }
      ejInstance.current = null;
    };
  }, []);

  const initEditor = () => {
    const editor = new EditorJS({
      holder: customID,
      data: editorData,
      onReady: () => {
        ejInstance.current = editor;
      },
      onChange: async (api, event) => {},
      tools: BLOCK_TOOLS,
    });
  };
  const goBackHome = () => {
    navigate("/");
  };

  useEffect(() => {
    if (saveTrigger) {
      ejInstance.current
        .save()
        .then(async (outputData) => {
          try {
            const { error } = await supabase
              .from("pages")
              .update({ blocks: { data: outputData.blocks } })
              .eq("id", id);

            if (error) throw error;

            const { error2 } = await supabase
              .from("pages")
              .update({ title: outputData.blocks[0].data.text })
              .eq("id", id);

            if (error2) throw error;
          } catch (error) {
            console.log(error);
          }
          setSaveTrigger(false);

          goBackHome();
        })
        .catch((error) => {
          console.log("Saving failed: ", error);
        });
    }
  }, [saveTrigger]);

  return (
    <React.Fragment>
      <div id={customID} className="editor-page"></div>
    </React.Fragment>
  );
};

export default React.memo(Editor);
