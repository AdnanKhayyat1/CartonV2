import React, {useState, useEffect} from 'react'
import { supabase } from '../../api/supabaseClient';
import { COVER_IMAGE_URLS } from '../../tools/constants';
import Editor from './Editor';


function ModalPage({currID}) {
  const [blocks, setBlocks] = useState(null);
  const [saveTrigger, setSaveTrigger] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("pages")
          .select()
          .eq("id", currID);

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

    fetchData();
  }, []);

  return (
    <>
        {blocks ? (
        <Editor
          data={blocks}
          saveTrigger={saveTrigger}
          setSaveTrigger={setSaveTrigger}
          id={currID}
        />
      ) : (
        <p>Loading...</p>
      )}
    </>
  )
}

export default ModalPage