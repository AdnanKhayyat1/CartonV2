import { default as React, useEffect, useRef, useState, useCallback } from "react";

import EditorJS from "@editorjs/editorjs";

import "./Editor.css";
import { BLOCK_TOOLS, DEFAULT_INITIAL_DATA } from "../../tools/constants";

import { useCellStore } from "../stores/cellStore";
import { CellApi } from "../../api/cellApi";
import { useMutation } from "react-query";
const EDITTOR_HOLDER_ID = "editorjs";

const Editor = ({cell}) => {
  const ejInstance = useRef(null);
  const customID = `${EDITTOR_HOLDER_ID}-${cell._id}`;
  const updateEditorData = useCellStore((state) => state.updateCellById);

  const mutation = useMutation({
    mutationFn: CellApi.updateCell,
    onSuccess: (data) => {
      if (data.status === 200) {
        updateEditorData(cell._id, data.data);
      }
    },
    onError: (error) => {
      console.log(error);
    },
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
      data: cell.data,
      onReady: () => {
        ejInstance.current = editor;
      },
      onChange: async () => {
        
        await ejInstance.current.save().then(
           (outputData) => {
       
            
            mutation.mutate({
              _id: cell._id,
              mode: cell.mode,
              order: cell.order,
              data: outputData,           
            });
            
          }
        );
      },
      tools: BLOCK_TOOLS,
    });
  };

  return (
    <React.Fragment>
      <div id={customID} className="editor-page"></div>
    </React.Fragment>
  );
};

export default React.memo(Editor);
