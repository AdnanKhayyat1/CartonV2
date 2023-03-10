import React, { useEffect, useRef, useState } from "react";
import "./Editor.css";
import Editor from "./Editor";
import { supabase } from "../../supabaseClient";
import { useParams } from "react-router-dom";
import Header from "./header/Header";
import { FaChevronLeft } from "react-icons/fa";

const Page = ({ passedID, setShowPage, useCase = "" }) => {
  const [blocks, setBlocks] = useState(null);
  const [saveTrigger, setSaveTrigger] = useState(false);
  const [isFS, setIsFS] = useState(false);
  const ref = useRef(null);
  const params = useParams();
  const [id, setId] = useState(() => {
    if (!passedID) {
      return params.id;
    } else {
      return passedID;
    }
  });

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        console.log("turned off page");
        setShowPage(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("pages")
          .select()
          .eq("id", id);

        if (error) throw error;

        const fetchedBlocks = {
          time: new Date().getTime(),
          blocks: data[0].blocks.data,
        };
        return setBlocks(fetchedBlocks);
      } catch (error) {
        alert(error.error_description || error.message);
      }
    };
    if (passedID) {
      setId(passedID);
    }

    fetchData();
  }, []);

  return (
    <div className={(useCase === "") ? "full-page-wrapper" : "pagelet-wrapper"} ref={ref}>
      <Header saveHandler={setSaveTrigger} fsHandler={setIsFS} />

      {blocks ? (
        <Editor
          data={blocks}
          saveTrigger={saveTrigger}
          setSaveTrigger={setSaveTrigger}
          id={id}
          useCase={useCase}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default React.memo(Page);
