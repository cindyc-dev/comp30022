import { useState } from "react";
import { Layout } from "~/components/layout/layout";
import { ConnectionI } from "~/types/ConnectionI";
import {
  NEW_CONNECTION,
  sampleConnections,
  sampleTags,
} from "~/sample_data/sampleConnections";
import { FaFilter, FaPlus, FaTrash } from "react-icons/fa";
import { useModal } from "~/components/hooks/modalContext";
import AddConnectionModal, {
  handleAddConnectionProps,
} from "./_addConnectionModal";
import Table from "./_table";
import { useToast } from "~/components/hooks/toastContext";
import DebouncedInput from "./_debouncedInput";
import { RowSelectionState } from "@tanstack/react-table";
import Link from "next/link";
import { BiMailSend } from "react-icons/bi";

export default function Connections() {
  const [data, setData] = useState<ConnectionI[]>(sampleConnections);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const tagColoursMap: Record<string, string> = sampleTags;

  // TODO fetch data and tagColoursMap from API

  const { openModal, closeModal } = useModal();
  const { addToast } = useToast();

  const addConnection = () => {
    openModal({
      content: (
        <AddConnectionModal
          handleCreateConnection={handleAddConnection}
          tagColoursMap={tagColoursMap}
        />
      ),
      id: "add-connection-modal",
    });
  };

  const handleAddConnection = ({
    newConnection,
    setConnection,
  }: handleAddConnectionProps) => {
    // Validate that connection has name and email
    if (!newConnection.name || !newConnection.email) {
      // Show error toast
      addToast({
        type: "error",
        message: "Name and Email are required.",
      });
      return;
    }

    // Validate that connection has a unique email
    if (data.some((connection) => connection.email === newConnection.email)) {
      // Show error toast
      addToast({
        type: "error",
        message: "Email already exists.",
      });
      return;
    }

    // TODO send newConnection to API and get back newConnection with id
    setData((prev) => [...prev, newConnection]); // To remove

    // Show success toast
    addToast({
      type: "success",
      message: "Connection added successfully.",
    });

    // Reset connection and close modal
    setConnection(NEW_CONNECTION);
    closeModal("add-connection-modal");
  };

  const handleDeleteMultipleConnections = () => {
    // TODO send rowSelection to API and get back success or error
    // TODO remove deleted connections from data
    const deletedConnections = Object.keys(rowSelection).map(
      (id) => data[Number(id)]
    );
    setData((prev) =>
      prev.filter((connection) => !deletedConnections.includes(connection))
    );

    // Show success toast
    addToast({
      type: "success",
      message: "Connections deleted successfully.",
    });

    // Reset rowSelection
    setRowSelection({});
  };

  const getSelectedEmails = () => {
    return Object.keys(rowSelection)
      .map((id) => data[Number(id)].email)
      .join(",");
  };

  return (
    <Layout>
      <div className="flex w-full flex-col items-start font-semibold">
        <div className="my-5 flex w-full flex-row items-center justify-between">
          <h1 className="mb-0 mt-4">{data.length} Contacts</h1>
          <button
            className="btn btn-primary text-base-100"
            onClick={() => addConnection()}
          >
            <FaPlus /> New Connection
          </button>
        </div>
        <div className="flex w-full flex-row justify-between rounded bg-[#EAECF6] p-3">
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            placeholder="🔎 Search Connection"
            className="input input-sm"
          />
          <button className="btn btn-primary btn-sm text-base-100">
            <FaFilter /> Filter
          </button>
        </div>
        <Table
          data={data}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          tagColoursMap={tagColoursMap}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      </div>
      {Object.keys(rowSelection).length > 0 && (
        <div className="navbar fixed bottom-2 flex w-9/12 justify-between gap-2 rounded bg-primary px-10 shadow-md">
          <div className="text-l text-base-300">
            {Object.keys(rowSelection).length}/{data.length} Rows Selected
          </div>
          <div className="flex gap-2">
            <Link
              className="btn btn-secondary"
              href={`mailto:${getSelectedEmails()}`}
            >
              <BiMailSend />
              Connect Now
            </Link>
            <button
              className="btn btn-error"
              onClick={handleDeleteMultipleConnections}
            >
              <FaTrash /> Delete
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

Connections.auth = true;
