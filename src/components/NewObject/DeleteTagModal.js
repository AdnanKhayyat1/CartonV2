import React from "react";

function DeleteTagModal() {
  const deleteTagsFromCellStore = useCellStore(
    (state) => state.deleteTagFromAllCells,
    shallow
  );
  const [objectTags, updateObjectTags] = useObjectStore(
    (state) => [state.tags, state.updateTags],
    shallow
  );
  const deleteTagEverywhere = async (tagID) => {
    try {
      setIsLoading(true);
      // delete tag from all cells (FE)
      deleteTagsFromCellStore(tagID);
      // push changes to backend (BE)
      const resCells = await CellApi.deleteTagFromCells(tagID);
      if (!resCells.data) throw new Error("Cell POST call failed");
      // delete tag from current page (FE)
      if (objectTags.includes(tagID)) {
        const updatedObjectTags = objectTags.filter((tag) => {
          return tag != tagID;
        });
        updateObjectTags(updatedObjectTags);
      }
      // delete tag from all pages (BE)
      const resObjects = await ObjectApi.removeTagFromObjects(tagID);
      if (resObjects.status !== 200) throw new Error("Object POST call failed");

      // delete tag (FE, BE)
      const resTags = await TagApi.deleteTagById(tagID);
      if (resTags.status !== 200) throw new Error("Tag DELETE call failed");
      var updatedTags = tags.filter((tag) => {
        return tag._id != tagID;
      });
      updateTags(updatedTags);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return <div>DeleteTagModal</div>;
}

export default DeleteTagModal;
