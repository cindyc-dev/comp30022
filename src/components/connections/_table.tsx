import { HTMLProps, useEffect, useMemo, useRef, useState } from "react";
import { ConnectionI } from "~/types/ConnectionI";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  FilterFn,
  SortingState,
  useReactTable,
  getFilteredRowModel,
  RowSelectionState,
  OnChangeFn,
} from "@tanstack/react-table";
import AvatarImage from "~/components/common/avatarImage";
import { FaCaretDown, FaCaretUp, FaSort } from "react-icons/fa";
import { fuzzyFilter } from "~/components/utils/fuzzyFilter";
import { fuzzySort } from "~/components/utils/fuzzySort";

import { RankingInfo } from "@tanstack/match-sorter-utils";
import Link from "next/link";

import { BiMailSend } from "react-icons/bi";
import Tag from "./_tag";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

interface TableProps {
  data: ConnectionI[];
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  tagColoursMap: Record<string, string>;
  rowSelection: RowSelectionState;
  setRowSelection: OnChangeFn<RowSelectionState>;
  editConnection: (c: ConnectionI) => void;
}

function Table({
  data,
  globalFilter,
  setGlobalFilter,
  tagColoursMap,
  rowSelection,
  setRowSelection,
  editConnection,
}: TableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

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
            <div className="avatar">
              <div className="h-12 w-12 rounded-full">
                <AvatarImage src={row.original.photoUrl} />
              </div>
            </div>
            <div className="ml-2">
              <div
                className="link cursor-pointer text-primary"
                onClick={() => editConnection(row.original)}
              >
                {row.original.name}
              </div>
            </div>
          </div>
        ),
        filterFn: "fuzzy",
        sortFn: fuzzySort,
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
              <Tag
                key={tag}
                tag={tag}
                tagColoursMap={tagColoursMap}
                isDeletable={false}
              />
            ))}
          </div>
        ),
      },
      {
        header: "SEND EMAIL",
        cell: ({ row }) => (
          <Link
            className="btn btn-secondary btn-sm h-fit py-1"
            href={`mailto: ${row.original.email}`}
          >
            <BiMailSend />
            Send Email
          </Link>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="mt-0 w-full overflow-x-auto">
      <table className="table mt-0">
        {/* Header */}
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="text-lg text-primary">
                  {header.isPlaceholder ? null : (
                    <div className="flex w-full flex-col items-center">
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none flex items-center justify-between w-full"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <FaCaretUp />,
                          desc: <FaCaretDown />,
                        }[header.column.getIsSorted() as string] ??
                          (header.column.getCanSort() ? <FaSort /> : null)}
                      </div>
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {/* Body */}
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
      </table>
    </div>
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

export default Table;
