import { Dispatch, SetStateAction, useState } from "react";
import {
  NEW_CONNECTION,
  sampleSearchResults,
} from "~/sample_data/sampleConnections";
import { ConnectionI } from "~/types/ConnectionI";
import { useModal } from "~/components/hooks/modalContext";
import UploadImageModalContent from "~/components/common/uploadImageModalContent";
import ConnectionDetailsInputs from "./_connectionDetailsInputs";
import ConnectionCard from "./_connectionCard";

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
        placeholder="🔎 Search Connection"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        autoFocus
      />

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        {searchResults.map((connection) => (
          <ConnectionCard connection={connection} />
        ))}
      </div>
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

  // Check if email is valid when connection.email changes after 2000ms of no change
  // const [validateEmail] = useDebounce((email: string) => {
  //   return validateEmail(email);
  // }, 2000);

  // useEffect(() => {
  //   if (connection.email) {
  //     const isValidEmail = validateEmail(connection.email);
  //     if (!isValidEmail) {
  //       setConnection({ ...connection, email: "" });
  //     }
  //   }
  // }, [connection.email]);

  return (
    <div className="flex flex-col content-center items-center justify-center md:w-4/5">
      <h1 className="my-0">Create a Connection</h1>
      <ConnectionDetailsInputs
        connection={connection}
        setConnection={setConnection}
        tagColoursMap={tagColoursMap}
        editPhoto={editPhoto}
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
