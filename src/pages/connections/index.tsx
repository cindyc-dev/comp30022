import { useState } from "react";
import { Layout } from "~/components/layout/layout";
import { ConnectionI } from "~/types/ConnectionI";
import {
  NEW_CONNECTION,
  sampleConnections,
  sampleTags,
} from "~/sample_data/sampleConnections";
import { FaFilter, FaPlus } from "react-icons/fa";
import { useModal } from "~/components/hooks/modalContext";
import AddConnectionModal, {
  handleAddConnectionProps,
} from "./_addConnectionModal";
import Table from "./_table";
import { useToast } from "~/components/hooks/toastContext";
import DebouncedInput from "./_debouncedInput";

export default function Connections() {
  const [data, setData] = useState<ConnectionI[]>(sampleConnections);
  const [globalFilter, setGlobalFilter] = useState<string>("");
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
        />
      </div>
    </Layout>
  );
}

Connections.auth = true;
