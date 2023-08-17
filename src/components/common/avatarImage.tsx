import Image from "next/image";

export const AvatarImage = ({
  src,
  props,
}: {
  src: string;
  props?: object;
}) => {
  return (
    <div className="rounded-full">
      <Image
        src={src}
        alt="profile picture"
        fill={true}
        className="m-0 rounded-full"
        sizes="100%"
        {...props}
      />
    </div>
  );
};
