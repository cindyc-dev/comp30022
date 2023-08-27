import { useState } from "react";
import { FaPaperPlane, FaPlus } from "react-icons/fa";
import AvatarImage from "~/components/common/avatarImage";
import TextInput from "~/components/common/textInput";
import { mockSearchResults } from "~/mockData/mockConnections";
import { ConnectionI } from "~/types/ConnectionI";

const AddConnectionModal = ({
  handleCreateConnection,
}: {
  handleCreateConnection: (connection: ConnectionI) => void;
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
      <div>
        {isSearch ? (
          <SearchTab />
        ) : (
          <CreateTab handleCreateConnection={handleCreateConnection} />
        )}
      </div>
    </div>
  );
};

const SearchTab = () => {
  const [searchResults, setSearchResults] =
    useState<ConnectionI[]>(mockSearchResults);
  // TODO send query to API and set searchResults

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="my-0">Search for Connections</h1>
      <input
        type="text"
        className="input input-primary w-full"
        placeholder="🔎 Search Connection"
        autoFocus
      />

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        {searchResults.map((connection) => (
          <div
            key={connection.email}
            className="flex w-full min-w-fit flex-col items-center justify-around gap-4 rounded-md border-2 border-solid p-3 sm:flex-row"
          >
            <div className="flex flex-row gap-4">
              {connection.photoUrl && (
                <div className="avatar h-12 w-12 rounded-full">
                  <AvatarImage src={connection.photoUrl} />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-semibold">{connection.name}</span>
                <span className="text-sm">{connection.email}</span>
              </div>
            </div>
            <button className="btn btn-primary btn-sm text-base-100">
              <FaPaperPlane /> Request
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const CreateTab = ({
  handleCreateConnection,
}: {
  handleCreateConnection: (connection: ConnectionI) => void;
}) => {
  const [connection, setConnection] = useState<ConnectionI>({} as ConnectionI);
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="my-0">Create a Connection</h1>
      <TextInput
        label="👋 Name"
        placeholder="eg. Jane Green"
        value={connection.name}
        setValue={(v) => setConnection({ ...connection, name: v })}
      />
      <TextInput
        label="📧 Email"
        placeholder="eg. example@company.com"
        value={connection.email}
        setValue={(v) => setConnection({ ...connection, email: v })}
      />
      <TextInput
        label="📞 Phone"
        placeholder="eg. 123-456-7890"
        value={connection.phone || ""}
        setValue={(v) => setConnection({ ...connection, phone: v })}
      />
      <button
        className="btn btn-primary"
        onClick={() => handleCreateConnection(connection)}
      >
        Create
      </button>
    </div>
  );
};

export default AddConnectionModal;
