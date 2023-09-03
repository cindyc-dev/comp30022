import {
  HTMLProps,
  InputHTMLAttributes,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Layout } from "~/components/layout/layout";
import { ConnectionI } from "~/types/ConnectionI";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  FilterFn,
  SortingFn,
  SortingState,
  useReactTable,
  sortingFns,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { mockConnections, mockTags } from "~/sample_data/mockConnections";
import AvatarImage from "~/components/common/avatarImage";
import { capitalise } from "~/components/utils/capitalise";
import {
  FaCaretDown,
  FaCaretUp,
  FaFilter,
  FaPlus,
  FaSort,
} from "react-icons/fa";
import { useModal } from "~/components/hooks/modalContext";
import AddConnectionModal from "./_addConnectionModal";

import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank,
      rowB.columnFiltersMeta[columnId]?.itemRank
    );
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

export default function Connections() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<ConnectionI[]>(mockConnections);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const tagColoursMap: Record<string, string> = mockTags;

  // TODO fetch data and tagColoursMap from API

  const { openModal } = useModal();

  const addConnection = () => {
    openModal({
      content: (
        <AddConnectionModal
          handleCreateConnection={handleAddConnection}
          tagColoursMap={tagColoursMap}
        />
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
    },
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
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            placeholder="🔎 Search Connection"
            className="input input-sm"
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

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

Connections.auth = true;
