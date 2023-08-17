import { useState } from "react";
import { AvatarImage } from "../../components/common/avatarImage";
import { useToast } from "../../components/hooks/toastContext";
import { useModal } from "../../components/hooks/modalContext";

export const UploadImageModalContent = () => {
  const [image, setImage] = useState<File | null>(null);
  const { addToast } = useToast();
  const { closeModal } = useModal();

  const saveImage = () => {
    // TODO Save image to API

    // Show success toast
    addToast({
      type: "success",
      message: "Profile picture updated successfully!",
    });
    closeModal("upload-image-modal");
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

export default UploadImageModalContent;
