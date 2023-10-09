import { FaPaperPlane } from "react-icons/fa";
import AvatarImage from "~/components/common/avatarImage";
import { ConnectionI } from "~/types/ConnectionI";

function ConnectionCard({
  connection,
  isAlreadyConnected,
  handleAdd,
}: {
  connection: ConnectionI;
  isAlreadyConnected: boolean;
  handleAdd: (id: string, name: string) => void;
}) {
  return (
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
      <button
        className={`btn btn-primary btn-sm text-base-100 ${
          isAlreadyConnected && "btn-disabled"
        }`}
        onClick={() => handleAdd(connection.id, connection.name)}
      >
        <FaPaperPlane />
        {isAlreadyConnected ? "Already Connected" : "Connect"}
      </button>
    </div>
  );
}

export default ConnectionCard;
