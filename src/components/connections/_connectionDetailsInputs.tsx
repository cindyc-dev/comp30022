// Used in _addConnectionModal.tsx and _connectionDetailsModal.tsx

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import AvatarImage from "~/components/common/avatarImage";
import TextInput from "~/components/common/textInput";
import Tag from "./_tag";
import { ConnectionI } from "~/types/ConnectionI";
import { FaInfoCircle } from "react-icons/fa";
import { AiFillCheckCircle } from "react-icons/ai";
import { api } from "~/utils/api";
import { UserI } from "~/types/UserI";

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

  // Check if email is valid when connection.email changes after 2000ms of no change
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [existingUser, setExistingUser] = useState<UserI | null>(null);

  const mutation = api.connection.checkExistingUser.useMutation();

  if (debounceEmail) {
    // Check if email is valid when connection.email changes after 3000ms of no change
    useEffect(() => {
      // Regex that checks if email is valid
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (connection.email.length > 0 && re.test(connection.email)) {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          mutation.mutate(
            { email: connection.email },
            {
              onSuccess: (data) => {
                if (data) {
                  setExistingUser(data as UserI);
                } else {
                  setExistingUser(null);
                }
              },
            }
          );
        }, 3000);
      } else {
        setExistingUser(null);
      }
    }, [connection.email]);
  }

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
            <div className="w-full">
              <TextInput
                label="📧 Email"
                placeholder="eg. example@company.com"
                type="email"
                value={connection.email}
                setValue={(v) => setConnection({ ...connection, email: v })}
                required={true}
              />
              {isLoading ? (
                <div className="mt-2 flex w-full items-center justify-end gap-2 text-right text-gray-500">
                  <p className="m-0 inline p-0 text-xs">Checking email</p>
                  <span className="loading loading-spinner loading-xs"></span>
                </div>
              ) : (
                existingUser && (
                  <div className="alert mt-2 w-full bg-secondary py-1 text-sm">
                    <FaInfoCircle />
                    <p className="m-0 flex items-center gap-2 p-0 text-sm">
                      A user with this email already exists. Would you like to
                      search for them?
                    </p>
                    <div>
                      <button
                        className="btn btn-sm"
                        onClick={() => setExistingUser(null)}
                      >
                        No
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {}}
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
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
      <div className="w-full">
        <label className="label">
          <span className="label-text">✏️ Notes</span>
        </label>
        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="eg. Met at a conference in 2019. We talked about the new React version..."
        ></textarea>
      </div>
    </>
  );
}

export default ConnectionDetailsInputs;
