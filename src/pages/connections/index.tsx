import { HTMLProps, useEffect, useMemo, useRef, useState } from "react";
import { Layout } from "~/components/layout/layout";
import { ConnectionI } from "~/types/ConnectionI";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { mockConnections, mockTags } from "~/sample_data/mockConnections";
import AvatarImage from "~/components/common/avatarImage";
import { capitalise } from "~/components/utils/capitalise";
import { FaFilter, FaPlus } from "react-icons/fa";
import { useModal } from "~/components/hooks/modalContext";
import AddConnectionModal from "./_addConnectionModal";

export default function Connections() {
  const [data, setData] = useState<ConnectionI[]>(mockConnections);
  const tagColoursMap: Record<string, string> = mockTags;

  // TODO fetch data and tagColoursMap from API

  const { openModal } = useModal();

  const addConnection = () => {
    openModal({
      content: (
        <AddConnectionModal handleCreateConnection={handleAddConnection} />
      ),
      id: "add-connection-modal",
    });
  };
  const handleAddConnection = (newConnection: ConnectionI) => {
    setData((prev) => [...prev, newConnection]);
  };

  const columns = useMemo<ColumnDef<ConnectionI>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      {
        header: "NAME",
        accessorKey: "name",
        cell: ({ row }) => (
          <div className="flex items-center">
            {row.original.photoUrl && (
              <div className="avatar">
                <div className="h-12 w-12 rounded-full">
                  <AvatarImage src={row.original.photoUrl} />
                </div>
              </div>
            )}
            <div className="ml-2">
              <div>{row.original.name}</div>
            </div>
          </div>
        ),
      },
      {
        header: "EMAIL",
        accessorKey: "email",
      },
      {
        header: "PHONE",
        accessorKey: "phone",
      },
      {
        header: "TAGS",
        accessorKey: "tags",
        cell: ({ row }) => (
          <div className="flex flex-row flex-wrap gap-2">
            {row.original.tags.map((tag) => (
              <div
                key={tag}
                className={`${tagColoursMap[tag]} badge py-3 text-sm font-normal text-base-100`}
              >
                {capitalise(tag)}
              </div>
            ))}
          </div>
        ),
      },
      {
        header: "CONNECT",
        cell: () => (
          <button className="btn btn-secondary btn-sm">Connect Now</button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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
          <input
            type="text"
            className="input input-sm"
            placeholder="🔎 Search Connection"
          />
          <button className="btn btn-primary btn-sm text-base-100">
            <FaFilter /> Filter
          </button>
        </div>
        {/* Table */}
        <div className="mt-0 w-full overflow-x-auto">
          <table className="table mt-0">
            {/* Header */}
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="text-lg text-primary">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            {/* Body */}
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

function IndeterminateCheckbox({
  indeterminate,
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className="checkbox-primary checkbox"
      {...rest}
    />
  );
}
