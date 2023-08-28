import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import AvatarImage from "~/components/common/avatarImage";
import TextInput from "~/components/common/textInput";
import { mockSearchResults } from "~/sample_data/mockConnections";
import { ConnectionI } from "~/types/ConnectionI";
import UploadImageModal from "../../components/common/uploadImageModal";
import { useModal } from "~/components/hooks/modalContext";
import Tag from "./_tag";

const AddConnectionModal = ({
  tagColoursMap,
  handleCreateConnection,
}: {
  tagColoursMap: Record<string, string>;
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
      <div className="flex justify-center">
        {isSearch ? (
          <SearchTab />
        ) : (
          <CreateTab
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
  const [searchResults] = useState<ConnectionI[]>(mockSearchResults);

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
  tagColoursMap,
  handleCreateConnection,
}: {
  tagColoursMap: Record<string, string>;
  handleCreateConnection: (connection: ConnectionI) => void;
}) => {
  const [connection, setConnection] = useState<ConnectionI>({} as ConnectionI);
  const [tagInput, setTagInput] = useState<string>("");
  const { openModal } = useModal();
  const editPhoto = () => {
    openModal({
      content: <UploadImageModal />,
      id: "upload-image-modal",
    });
  };
  return (
    <div className="flex flex-col content-center items-center justify-center gap-4 md:w-4/5">
      <h1 className="my-0">Create a Connection</h1>
      <div className="flex w-full flex-col items-center gap-4 align-middle md:flex-row md:justify-between">
        <div className="flex flex-col text-center">
          <label
            className="avatar btn btn-circle btn-ghost h-40 w-40"
            onClick={() => editPhoto()}
          >
            <AvatarImage src="https://wallpapers.com/images/hd/funny-profile-picture-ylwnnorvmvk2lna0.jpg" />
          </label>
          <p
            className="link cursor-pointer text-xs"
            onClick={() => editPhoto()}
          >
            Edit Photo
          </p>
        </div>
        <div className="flex w-full flex-col items-center gap-2">
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
          <TextInput
            label="🏷️ Tags (press Enter to add)"
            placeholder="eg. friend, colleague"
            value={tagInput}
            setValue={(v) => setTagInput(v)}
            props={{
              onKeyDown: (e: { key: string }) => {
                if (e.key === "Enter") {
                  setConnection({
                    ...connection,
                    tags: [...(connection.tags || []), tagInput.toLowerCase()],
                  });
                  setTagInput("");
                }
              },
            }}
          />
          <div className="flex w-full flex-row flex-wrap gap-2">
            {connection.tags?.map((tag) => (
              <Tag key={tag} tag={tag} tagColoursMap={tagColoursMap} />
            ))}
          </div>
          <button
            className="btn btn-primary btn-wide"
            onClick={() => handleCreateConnection(connection)}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddConnectionModal;
