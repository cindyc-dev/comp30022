import { useState } from "react";
import { ConnectionI } from "~/types/ConnectionI";
import ConnectionDetailsInputs from "./_connectionDetailsInputs";
import UploadImageModalContent from "~/components/common/uploadImageModalContent";
import { useModal } from "~/components/hooks/modalContext";
import { FaSave, FaTrash } from "react-icons/fa";
import { useToast } from "~/components/hooks/toastContext";
import { api } from "~/utils/api";

interface ConnectionDetailsModalProps {
  connection: ConnectionI;
  tagColoursMap: Record<string, string>;
  refresh: () => void;
}

function ConnectionDetailsModal({
  connection,
  tagColoursMap,
  refresh,
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

  const editCustomMutation = api.connection.editCustom.useMutation();
  const editExistingConnection = api.connection.editExisting.useMutation();
  const saveConnection = () => {
    // Validate that connection has name and email
    if (!editedConnection.name || !editedConnection.email) {
      // Show error toast
      addToast({
        type: "error",
        message: "Name and Email are required.",
      });
      return;
    }

    const newConnection = {
      ...editedConnection,
      phone: editedConnection.phone || "",
      photoUrl: editedConnection.photoUrl || "",
      notes: editedConnection.notes || "",
    };

    // Check if connection is custom or existing
    if (editedConnection.isExisting) {
      editExistingConnection.mutate(
        {
          connectionId: editedConnection.id,
          connection: newConnection,
        },
        {
          onSuccess: () => {
            addToast({
              type: "success",
              message: "Connection updated.",
            });
            refresh();
            closeModal("connection-details-modal");
          },
          onError: (error) => {
            addToast({
              type: "error",
              message: `Error updating connection. Error: ${error.message}`,
            });
          },
        }
      );
    } else {
      editCustomMutation.mutate(
        {
          email: editedConnection.email,
          connection: newConnection,
        },
        {
          onSuccess: () => {
            addToast({
              type: "success",
              message: "Connection updated.",
            });
            refresh();
            closeModal("connection-details-modal");
          },
          onError: (error) => {
            addToast({
              type: "error",
              message: `Error updating connection. Error: ${error.message}`,
            });
          },
        }
      );
    }
  };

  const deleteConnection = () => {
    // TODO: Delete connection from API
  };

  const hasEdit = () => {
    return JSON.stringify(editedConnection) !== JSON.stringify(connection);
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
            className={`btn btn-primary ${hasEdit() ? "" : "btn-disabled"}`}
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
