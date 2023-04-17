import React, { useEffect, useState } from "react";
import { CellApi } from "../../api/cellApi";
import { useCellStore } from "../stores/cellStore";
import Editor from "../object/Editor";
import { shallow } from "zustand/shallow";
import { useQuery } from "react-query";
function EditorWrapper({ editorID, isReadOnly = false }) {
  const { isLoading, isError, data, isSuccess } = useQuery(
    ["cell", editorID],
    () => CellApi.getCell(editorID),
    {
      refetchOnMount: "always",
    }
  );
  const setID = useCellStore((state) => state.updateId);
  const [editorData, setEditorData] = useCellStore((state) => [state.data, state.updateData], shallow);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setID(data._id);
      setEditorData(data.data ? data.data : {});
      setIsReady(true);
    }
  }, [isSuccess]);
  if(isLoading) {
    return <div>Loading</div>
  }
  if(isError) {
    return <div>Error</div>
  }

  return (
    <div>
      
      {isReady && <Editor id={editorID} editorData={editorData} isReadOnly={isReadOnly} />}
    </div>
  );
}

export default EditorWrapper;
