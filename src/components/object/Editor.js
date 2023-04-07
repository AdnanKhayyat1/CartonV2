import { default as React, useEffect, useRef, useState, useCallback } from "react";

import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Link from "@editorjs/link";
import Checklist from "@editorjs/checklist";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Code from "@editorjs/code";
import SimpleImage from "@editorjs/simple-image";
import Marker from "@editorjs/marker";
import Tooltip from "editorjs-tooltip";
import AttachesTool from '@editorjs/attaches';
import "./Editor.css";
import { DEFAULT_INITIAL_DATA } from "../../tools/constants";

import { useCellStore } from "../stores/cellStore";
import { CellApi } from "../../api/cellApi";
import { useMutation } from "react-query";
const EDITTOR_HOLDER_ID = "editorjs";

const Editor = ({cell , isReadOnly = false}) => {
  const ejInstance = useRef(null);
  const customID = `${EDITTOR_HOLDER_ID}-${cell._id}`;
  const updateEditorData = useCellStore((state) => state.updateCellById);
  const BLOCK_TOOLS = {
    header: {
      class: Header,
      inlineToolbar: true,
      config: {
        placeholder: 'test',
      }
    },
    link: Link,
    checklist: Checklist,
    list: List,
    quote: Quote,
    code: Code,
    image: SimpleImage,
    Marker: {
      class: Marker,
      shortcut: "SHIFT+CMD+M",
    },
    tooltip: {
      class: Tooltip,
      config: {
        location: "left",
        highlightColor: "#FFEFD5",
        underline: true,
        backgroundColor: "#154360",
        textColor: "#FDFEFE",
      },
    },
    attaches: {
      class: AttachesTool,
      
    }
  };

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
    if (!ejInstance.current) {
      console.log(customID);
      initEditor();
    }

  }, [ejInstance.current])
  useEffect(() => {
    return () => {
      if (!ejInstance.current) {
        console.log(customID);
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
              ...cell,
              data: outputData,           
            });
            
          }
        );
      },
      tools: BLOCK_TOOLS,
      readOnly: isReadOnly
    });
  };

  return (
    <React.Fragment>
      <div id={customID} className="editor-page"></div>
    </React.Fragment>
  );
};

export default React.memo(Editor);
