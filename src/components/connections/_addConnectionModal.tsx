import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  NEW_CONNECTION,
  sampleSearchResults,
} from "~/sample_data/sampleConnections";
import { ConnectionI } from "~/types/ConnectionI";
import { useModal } from "~/components/hooks/modalContext";
import UploadImageModalContent from "~/components/common/uploadImageModalContent";
import ConnectionDetailsInputs from "./_connectionDetailsInputs";
import ConnectionCard from "./_connectionCard";
import Image from "next/image";

export interface handleAddConnectionProps {
  newConnection: ConnectionI;
  setConnection: Dispatch<SetStateAction<ConnectionI>>;
}

const AddConnectionModal = ({
  tagColoursMap,
  handleCreateConnection,
}: {
  tagColoursMap: Record<string, string>;
  handleCreateConnection: ({
    newConnection,
    setConnection,
  }: handleAddConnectionProps) => void;
}) => {
  const [isSearch, setIsSearch] = useState<boolean>(true);
  return (
    <div>
      <div className="tabs">
        <span
          className={`tab tab-lifted ${isSearch && "tab-active"}`}
          onClick={() => setIsSearch(true)}
        >
          Search
        </span>
        <span
          className={`tab tab-lifted ${!isSearch && "tab-active"}`}
          onClick={() => setIsSearch(false)}
        >
          Create
        </span>
      </div>
      <div className="flex justify-center">
        {isSearch ? (
          <SearchTab />
        ) : (
          <CustomTab
            handleCreateConnection={handleCreateConnection}
            tagColoursMap={tagColoursMap}
          />
        )}
      </div>
    </div>
  );
};

const SearchTab = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults] = useState<ConnectionI[]>(sampleSearchResults);

  // TODO send query to API and set searchResults

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="my-0">Search for Connections</h1>
      <input
        type="text"
        className="input input-primary w-full"
        placeholder="🔎 Search Connection Email"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        autoFocus
      />

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        {searchResults.map((connection) => (
          <ConnectionCard key={connection.email} connection={connection} />
        ))}
      </div>
      {/* Show Illustration when 0 Search Results */}
      {searchResults.length === 0 && (
        <div className="flex w-full flex-col items-center justify-center text-center">
          <Image
            src="/svg/Search-rafiki.svg"
            alt={"No Search Results Illustration"}
            width={300}
            height={300}
            className="m-0 p-0"
          />
          <p>
            {searchQuery.length < 5
              ? "Enter at least 5 characters to search."
              : "No results found. Try searching for a different email."}
          </p>
        </div>
      )}
    </div>
  );
};

const CustomTab = ({
  tagColoursMap,
  handleCreateConnection,
}: {
  tagColoursMap: Record<string, string>;
  handleCreateConnection: ({
    newConnection,
    setConnection,
  }: handleAddConnectionProps) => void;
}) => {
  const [connection, setConnection] = useState<ConnectionI>(NEW_CONNECTION);
  const { openModal } = useModal();
  const editPhoto = () => {
    openModal({
      content: (
        <UploadImageModalContent
          onSaveImage={(imageUrl) => {
            setConnection({ ...connection, photoUrl: imageUrl });
          }}
        />
      ),
      id: "upload-image-modal",
    });
  };

  return (
    <div className="flex flex-col content-center items-center justify-center md:w-4/5">
      <h1 className="my-0">Create a Connection</h1>
      <ConnectionDetailsInputs
        connection={connection}
        setConnection={setConnection}
        tagColoursMap={tagColoursMap}
        editPhoto={editPhoto}
        debounceEmail={true}
      />
      <button
        className={`btn btn-primary btn-wide ${
          (!connection.name || !connection.email) && "btn-disabled"
        }`}
        onClick={() =>
          handleCreateConnection({
            newConnection: connection,
            setConnection: setConnection,
          })
        }
      >
        Create
      </button>
    </div>
  );
};

export default AddConnectionModal;
