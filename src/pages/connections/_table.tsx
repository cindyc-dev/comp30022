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
import { capitalise } from "~/components/utils/capitalise";
import { FaCaretDown, FaCaretUp, FaSort } from "react-icons/fa";
import { fuzzyFilter } from "./_fuzzyFilter";
import { fuzzySort } from "./_fuzzySort";

import { RankingInfo } from "@tanstack/match-sorter-utils";

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
}

function Table({
  data,
  globalFilter,
  setGlobalFilter,
  tagColoursMap,
  rowSelection,
  setRowSelection
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
              <div>{row.original.name}</div>
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
    state: {
      sorting,
      globalFilter,
      rowSelection
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
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? "cursor-pointer select-none flex items-center justify-between"
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
