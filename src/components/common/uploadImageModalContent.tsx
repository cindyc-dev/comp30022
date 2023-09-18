import { useState } from "react";
import { AvatarImage } from "../../components/common/avatarImage";
import { useToast } from "../../components/hooks/toastContext";
import { useModal } from "../../components/hooks/modalContext";
import CloudinaryImageUpload from "~/components/common/cloudinaryImageUpload";

export const UploadImageModalContent = ({
  onSaveImage,
}: {
  onSaveImage: (imageUrl: string) => void;
}) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const { addToast } = useToast();
  const { closeModal } = useModal();

  const saveImage = () => {
    if (!imageUrl) {
      // Show error toast
      addToast({
        type: "error",
        message: "Please upload an image.",
      });
      return;
    }

    onSaveImage(imageUrl);
    closeModal("upload-image-modal");
  };

  return (
    <>
      <div className="relative flex flex-col items-center gap-4">
        <h1 className="mt-0">Change Profile Picture</h1>
        <CloudinaryImageUpload setImageUrl={setImageUrl} />
        {/* Image Preview */}
        {imageUrl && (
          <label className="avatar h-40 w-40 rounded-full shadow-md">
            <AvatarImage src={imageUrl} />
          </label>
        )}
        {imageUrl && (
          <button
            className="btn btn-primary btn-wide"
            onClick={() => saveImage()}
          >
            Save
          </button>
        )}
      </div>
    </>
  );
};

export default UploadImageModalContent;
