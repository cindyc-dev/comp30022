// Used in _addConnectionModal.tsx and _connectionDetailsModal.tsx

import React, { Dispatch, SetStateAction, useState } from "react";
import AvatarImage from "~/components/common/avatarImage";
import TextInput from "~/components/common/textInput";
import Tag from "./_tag";
import { ConnectionI } from "~/types/ConnectionI";
import TextAreaInput from "~/components/common/textAreaInput";

interface ConnectionDetailsInputsProps {
  connection: ConnectionI;
  setConnection: Dispatch<SetStateAction<ConnectionI>>;
  tagColoursMap: Record<string, string>;
  editPhoto: () => void;
  debounceEmail?: boolean;
}

function ConnectionDetailsInputs({
  connection,
  setConnection,
  tagColoursMap,
  editPhoto,
  debounceEmail = false,
}: ConnectionDetailsInputsProps) {
  const [tagInput, setTagInput] = useState<string>("");
  return (
    <>
      <div className="flex w-full flex-col items-center gap-4 align-middle md:flex-row md:justify-between">
        <div className="flex flex-col text-center">
          <label
            className="avatar btn btn-circle btn-ghost h-40 w-40"
            onClick={() => editPhoto()}
          >
            <AvatarImage src={connection.photoUrl} />
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
            required={true}
          />
          {debounceEmail ? (
            <></>
          ) : (
            <TextInput
              label="📧 Email"
              placeholder="eg. example@company.com"
              type="email"
              value={connection.email}
              setValue={(v) => setConnection({ ...connection, email: v })}
              required={true}
            />
          )}
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
              <Tag
                key={tag}
                tag={tag}
                tagColoursMap={tagColoursMap}
                isDeletable
                onDelete={() => {
                  setConnection({
                    ...connection,
                    tags: connection.tags?.filter((t) => t !== tag),
                  });
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <TextAreaInput
        label="✏️ Notes"
        value={connection.notes || ""}
        placeholder="eg. Met at a conference in 2019. We talked about the new React version..."
      />
    </>
  );
}

export default ConnectionDetailsInputs;
