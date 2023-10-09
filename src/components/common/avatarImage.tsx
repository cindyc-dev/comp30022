import Image from "next/image";
import { DEFAULT_PROFILE_PIC } from "~/sample_data/sampleConnections";

export const AvatarImage = ({
  src = DEFAULT_PROFILE_PIC,
  props,
}: {
  src?: string;
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

export default AvatarImage;
