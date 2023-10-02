import { capitalise } from "~/components/utils/capitalise";
import { HiXMark } from "react-icons/hi2";

interface TagProps {
  tag: string;
  tagColoursMap: Record<string, string>;
  isDeletable?: boolean;
  onDelete?: () => void;
}

const Tag = ({ tag, tagColoursMap, isDeletable, onDelete }: TagProps) => {
  return (
    <>
      <div
        className={`${
          tagColoursMap[tag] ?? "badge-accent"
        } badge py-3 text-sm font-normal text-base-100`}
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
