import React, { useEffect, useMemo } from "react";
import Uppy from "@uppy/core";
import Webcam from "@uppy/webcam";
import { Dashboard } from "@uppy/react";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import { supabase } from "../../api/supabaseClient";


function Uploader({onUpload}) {
  const uppy = useMemo(() => {
    return new Uppy({
      restrictions: { maxNumberOfFiles: 1 },
      autoProceed: false,
    })
      .use(Webcam)
      .on("complete", async (result) => {
        const url = result.successful[0];
        const encFileName = `${Date.now().toString()}-${url.name.toString()}`
        console.log(encFileName);
        onUpload({ file: encFileName });
        const { data, error } = await supabase.storage
          .from("avatars")
          .upload(`public/${encFileName}`, url.data);
      });
  }, []);

  useEffect(() => {
    return () => uppy.close({reason: "unmount"});
  }, [uppy]);
  return <Dashboard uppy={uppy} plugins={["webcam"]} />;
}

export default Uploader;
