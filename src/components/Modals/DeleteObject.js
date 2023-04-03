import { Modal, Typography } from "antd";
import React, { useState } from "react";
import { CellApi } from "../../api/cellApi";
import { ObjectApi } from "../../api/objectApi";
import useObjectStore from "../stores/objectStore";

function DeleteObject({ deleteModal, setDeleteModal, setObjects, objects }) {
  const showModal = deleteModal !== "";
  const [confirmLoading, setConfirmLoading] = useState(false);

  const deleteObject = async () => {
    try {
      setConfirmLoading(true);
      const objectToDelete = await ObjectApi.getObject(deleteModal);
      if (!objectToDelete) throw new Error("Couldnt fetch object to delete");
      // delete cells first
      if (objectToDelete.leftCol.cellIDs.length > 0) {
        const deleteLeftCells = await CellApi.removeCell(
          objectToDelete.leftCol.cellIDs
        );
        if (!deleteLeftCells.acknowledged){
          throw new Error("Couldn't delete cells left");
        }
      }
      if (objectToDelete.rightCol.cellIDs.length > 0) {
        const deleteRightCells = await CellApi.removeCell(
          objectToDelete.rightCol.cellIDs
        );
        if (!deleteRightCells.acknowledged){
          throw new Error("Couldn't delete cells right");
        }
      }
      const deleteObject = await ObjectApi.removeObject(objectToDelete._id);
      if (deleteObject.status !== 200)
        throw new Error("Couldn't delete object");

      const updatedObjects = objects.filter(
        (obj) => obj._id !== objectToDelete._id
      );
      if (updatedObjects.length === objects.length)
        throw new Error("Frontend change not sustained");

      setObjects(updatedObjects);
      setDeleteModal("");
    } catch (err) {
      console.log(err);
    } finally {
      setConfirmLoading(false);
    }
  };
  return (
    <Modal
      title="Delete page?"
      open={showModal}
      onCancel={() => setDeleteModal("")}
      onOk={deleteObject}
      confirmLoading={confirmLoading}
    >
      <Typography.Text>
        Are you sure you want to delete this page?
      </Typography.Text>
      <Typography.Text type="danger">
        {" "}
        This action is irreversible!
      </Typography.Text>
    </Modal>
  );
}

export default DeleteObject;
