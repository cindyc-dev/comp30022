import { useState } from "react";
import { AvatarImage } from "./common/avatarImage";

export const UploadImageModalContent = () => {
  const [image, setImage] = useState<File | null>(null);

  const saveImage = () => {
    console.log("Saving image");
    console.log({ image: image });
  };

  return (
    <div className="relative flex flex-col items-center gap-4">
      <h1 className="mt-0">Change Profile Picture</h1>
      <input
        type="file"
        accept="image/*"
        className="file-input file-input-bordered w-full max-w-xs"
        onChange={(e) => setImage(e.target.files![0])}
      />
      {/* Image Preview */}
      {image && (
        <label className="avatar h-40 w-40 rounded-full shadow-md">
          <AvatarImage src={URL.createObjectURL(image)} />
        </label>
      )}
      {image && (
        <button
          className="btn btn-primary btn-wide"
          onClick={() => saveImage()}
        >
          Save
        </button>
      )}
    </div>
  );
};
