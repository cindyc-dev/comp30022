import { useEffect, useState } from "react";
import { Layout } from "~/components/layout/layout";
import { ConnectionI } from "~/types/ConnectionI";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { mockConnections } from "~/mockData/mockConnections";
import AvatarImage from "~/components/common/avatarImage";
import { capitalise } from "~/components/utils/capitalise";

export default function Connections() {
  const [data, setData] = useState<ConnectionI[]>(mockConnections);
  const [tagColoursMap, setTagColoursMap] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    // Check all tags, add to a list and assign colours alternating between [info, success, warning, error]
    const tags = data.reduce((acc, curr) => {
      curr.tags.forEach((tag) => {
        if (!acc.includes(tag)) {
          acc.push(tag);
        }
      });
      return acc;
    }, [] as string[]);
    const tagColours = ["info", "success", "warning", "error"];
    const tagColoursLength = tagColours.length;
    const newTagColoursMap = tags.reduce((acc, curr, index) => {
      acc[curr] = tagColours[index % tagColoursLength];
      return acc;
    }, {} as Record<string, string>);
    setTagColoursMap(newTagColoursMap);
  }, []);

  const columnHelper = createColumnHelper<ConnectionI>();

  const columns = [
    columnHelper.accessor("name", {
      header: "NAME",
      cell: (info) => (
        <div className="flex items-center">
          {info.row.original.photoUrl && (
            <div className="avatar">
              <div className="h-12 w-12 rounded-full">
                <AvatarImage src={info.row.original.photoUrl} />
              </div>
            </div>
          )}
          <div className="ml-2">
            <div>{info.getValue()}</div>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("email", {
      header: "EMAIL",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("phone", {
      header: "PHONE",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("tags", {
      header: "TAGS",
      cell: (info) => (
        <div className="flex flex-row flex-wrap gap-2">
          {info.getValue().map((tag) => (
            <div
              key={tag}
              className={`badge badge-${tagColoursMap[tag]} py-3 text-sm font-normal text-base-100`}
            >
              {capitalise(tag)}
            </div>
          ))}
        </div>
      ),
    }),
    columnHelper.display({
      header: "CONNECT",
      cell: () => (
        <button className="btn btn-secondary btn-sm">Connect Now</button>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Layout>
      <div className="flex w-full flex-col items-start font-semibold">
        <h2 className="mb-0 mt-4">{data.length} Contacts</h2>

        <div className="w-full overflow-x-auto">
          <table className="table">
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
