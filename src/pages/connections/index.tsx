import { useState } from "react";
import { Layout } from "~/components/layout/layout";
import { ConnectionI } from "~/types/ConnectionI";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { connectionsMockData } from "~/mockData/connectionsMockData";

const columnHelper = createColumnHelper<ConnectionI>();

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("phone", {
    header: "Phone",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("tags", {
    header: "Tags",
    cell: (info) => info.getValue(),
  }),
];

export default function Connections() {
  const [data, setData] = useState<ConnectionI[]>(connectionsMockData);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Layout>
      <h1>Connections</h1>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
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
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.footer,
                      header.getContext()
                    )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </Layout>
  );
}
