import { capitalise } from "~/components/utils/capitalise";

const Tag = ({
  tag,
  tagColoursMap,
}: {
  tag: string;
  tagColoursMap: Record<string, string>;
}) => {
  return (
    <>
      <div
        className={`${
          tagColoursMap[tag] ?? "badge-accent"
        } badge py-3 text-sm font-normal text-base-100`}
      >
        {capitalise(tag)}
      </div>
    </>
  );
};

export default Tag;
