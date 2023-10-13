import { capitalise } from "~/components/utils/capitalise";
import { HiXMark } from "react-icons/hi2";

interface TagProps {
  tag: string;
  tagColoursMap?: Record<string, string>;
  isDeletable?: boolean;
  onDelete?: () => void;
  xs?: boolean;
}

const Tag = ({
  tag,
  tagColoursMap,
  isDeletable,
  onDelete,
  xs = false,
}: TagProps) => {
  return (
    <>
      <div
        className={`${
          tagColoursMap && tagColoursMap[tag]
            ? tagColoursMap[tag]
            : "badge-accent"
        } badge py-3 ${
          xs ? "border-[1px] border-solid border-base-100 text-xs" : "text-sm"
        } font-normal text-base-100`}
      >
        {capitalise(tag)}
        {isDeletable && (
          <HiXMark className="ml-1 cursor-pointer" onClick={onDelete} />
        )}
      </div>
    </>
  );
};

export default Tag;
