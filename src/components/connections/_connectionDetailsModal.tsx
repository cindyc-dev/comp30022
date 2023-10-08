import { useState } from "react";
import { ConnectionI } from "~/types/ConnectionI";
import ConnectionDetailsInputs from "./_connectionDetailsInputs";
import UploadImageModalContent from "~/components/common/uploadImageModalContent";
import { useModal } from "~/components/hooks/modalContext";
import { FaSave, FaTrash } from "react-icons/fa";
import { useToast } from "~/components/hooks/toastContext";
import { isObjectsEqual } from "../utils/isObjectEqual";

interface ConnectionDetailsModalProps {
  connection: ConnectionI;
  tagColoursMap: Record<string, string>;
}

function ConnectionDetailsModal({
  connection,
  tagColoursMap,
}: ConnectionDetailsModalProps) {
  const [editedConnection, setEditedConnection] =
    useState<ConnectionI>(connection);

  const { openModal, closeModal } = useModal();

  const { addToast } = useToast();

  const editPhoto = () => {
    openModal({
      content: (
        <UploadImageModalContent
          onSaveImage={(imageUrl) => {
            setEditedConnection({ ...editedConnection, photoUrl: imageUrl });
          }}
        />
      ),
      id: "upload-image-modal",
    });
  };

  const saveConnection = () => {
    // TODO: Save connection to API

    // Validate that connection has name and email
    if (!editedConnection.name || !editedConnection.email) {
      // Show error toast
      addToast({
        type: "error",
        message: "Name and Email are required.",
      });
      return;
    }

    // Show success toast
    addToast({
      type: "success",
      message: "Connection saved successfully.",
    });

    closeModal("connection-details-modal");
  };

  const deleteConnection = () => {
    // TODO: Delete connection from API
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col content-center items-center justify-center  md:w-4/5">
        <h1 className="my-0">Edit a Connection</h1>
        <ConnectionDetailsInputs
          connection={editedConnection}
          setConnection={setEditedConnection}
          tagColoursMap={tagColoursMap}
          editPhoto={editPhoto}
        />
        <div className="flex w-full justify-end gap-5">
          <button className="btn btn-error" onClick={deleteConnection}>
            <FaTrash />
            Delete
          </button>
          <button
            className={`btn btn-primary ${
              isObjectsEqual(connection, editedConnection) && "btn-disabled"
            }`}
            onClick={saveConnection}
          >
            <FaSave />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConnectionDetailsModal;
