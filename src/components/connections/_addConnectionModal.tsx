import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { NEW_CONNECTION } from "~/sample_data/sampleConnections";
import { ConnectionI } from "~/types/ConnectionI";
import { useModal } from "~/components/hooks/modalContext";
import UploadImageModalContent from "~/components/common/uploadImageModalContent";
import ConnectionDetailsInputs from "./_connectionDetailsInputs";
import ConnectionCard from "./_connectionCard";
import Image from "next/image";
import { checkEmail } from "../utils/checkEmail";
import { api } from "~/utils/api";
import TextInput from "../common/textInput";

export interface handleAddConnectionProps {
  newConnection: ConnectionI;
  setConnection: Dispatch<SetStateAction<ConnectionI>>;
}

interface AddConnectionModalProps {
  tagColoursMap: Record<string, string>;
  handleCreateCustom: ({
    newConnection,
    setConnection,
  }: handleAddConnectionProps) => void;
  handleAddExisting: (
    id: string,
    name: string,
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  ) => void;
  data: ConnectionI[];
}

const AddConnectionModal = ({
  tagColoursMap,
  handleCreateCustom,
  handleAddExisting,
  data,
}: AddConnectionModalProps) => {
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
          <SearchTab handleAddExisting={handleAddExisting} connections={data} />
        ) : (
          <CustomTab
            handleCreateCustom={handleCreateCustom}
            tagColoursMap={tagColoursMap}
            handleAddExisting={handleAddExisting}
          />
        )}
      </div>
    </div>
  );
};

const SearchTab = ({
  connections,
  handleAddExisting,
}: {
  connections: ConnectionI[];
  handleAddExisting: (
    id: string,
    name: string,
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  ) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<ConnectionI[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alreadyConnected, setAlreadyConnected] = useState<ConnectionI[]>([]);

  const mutation = api.connection.searchAllUsers.useMutation();

  // API call to search for connections when searchQuery changes
  useEffect(() => {
    // Clear search results if searchQuery is empty
    if (searchQuery === "") {
      setSearchResults([]);
      return;
    }

    // Check if searchQuery is a valid email
    if (!checkEmail(searchQuery)) return;

    console.log("Searching for connections with query: ", searchQuery);
    setIsLoading(true);

    mutation.mutate(
      { emailString: searchQuery, topX: 5 },
      {
        onSuccess: (data) => {
          // Separate existing connections from search results
          const newAlreadyConnected = data.filter((connection) =>
            connections.find((c) => c.email === connection.email)
          );
          setAlreadyConnected(newAlreadyConnected);
          setSearchResults(data);
          setIsLoading(false);
        },
        onError: (error) => {
          console.error(error);
          setIsLoading(false);
        },
      }
    );
  }, [searchQuery]);

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="my-0">Search for Connections</h1>
      <div className="w-full">
        <TextInput
          value={searchQuery}
          setValue={(v) => setSearchQuery(v)}
          label=""
          placeholder="🔎 Search Connection Email"
        />
      </div>

      {isLoading && (
        <div className="flex w-full flex-grow items-center justify-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      )}

      {!isLoading && (
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          {searchResults.map((connection) => (
            <ConnectionCard
              key={connection.email}
              connection={connection}
              isAlreadyConnected={alreadyConnected.includes(connection)}
              handleAdd={handleAddExisting}
              setSearchQuery={setSearchQuery}
            />
          ))}
        </div>
      )}

      {/* Show Illustration when 0 Search Results */}
      {searchResults.length === 0 && !isLoading && (
        <div className="flex w-full flex-col items-center justify-center text-center">
          <Image
            src="/svg/Search-rafiki.svg"
            alt={"No Search Results Illustration"}
            width={300}
            height={300}
            className="m-0 p-0"
          />
          <p className="m-0 p-0 text-sm text-gray-400">
            {!checkEmail(searchQuery)
              ? "You must enter a valid email (eg. name@company.com) to search for connections."
              : `No connections with email ${searchQuery} found. Try creating a custom connection.`}
          </p>
        </div>
      )}
    </div>
  );
};

const CustomTab = ({
  tagColoursMap,
  handleCreateCustom,
  handleAddExisting,
}: {
  tagColoursMap: Record<string, string>;
  handleCreateCustom: ({
    newConnection,
    setConnection,
  }: handleAddConnectionProps) => void;
  handleAddExisting: (
    id: string,
    name: string,
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  ) => void;
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
        handleAddExisting={handleAddExisting}
      />
      <button
        className={`btn btn-primary btn-wide ${
          (!connection.name || !checkEmail(connection.email)) && "btn-disabled"
        }`}
        onClick={() =>
          handleCreateCustom({
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
