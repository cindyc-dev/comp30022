// Reference: https://cloudinary.com/documentation/react_image_and_video_upload
import { useEffect, useState } from "react";

interface Cloudinary {
  createUploadWidget: (
    options: {
      cloudName: string;
      uploadPreset: string;
    },
    callback: (error: any, result: { event: string; info: any }) => void
  ) => any;
}

declare global {
  interface Window {
    cloudinary: Cloudinary;
  }
}

interface Widget {
  open: () => void;
  close: () => void;
}

interface CloudinaryImageUploadProps {
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
}

const CloudinaryImageUpload = ({ setImageUrl }: CloudinaryImageUploadProps) => {
  const [cloudinary, setCloudinary] = useState<Cloudinary | null>(null);
  const [widget, setWidget] = useState<Widget | null>(null);

  useEffect(() => {
    setCloudinary(window.cloudinary);
  }, []);

  useEffect(() => {
    if (!cloudinary) return;
    setWidget(
      cloudinary.createUploadWidget(
        {
          cloudName: "dsmpualgm",
          uploadPreset: "nchzprn6",
        },
        (error: any, result: { event: string; info: any }) => {
          if (!error && result && result.event === "success") {
            console.log("Done! Here is the image info: ", result.info);
            setImageUrl(result.info.secure_url);
            widget?.close();
          }
        }
      )
    );
  }, [cloudinary]);

  return (
    <>
      <button
        onClick={() => {
          setCloudinary(window.cloudinary);
          console.log({ cloudinary: cloudinary });
          widget?.open();
        }}
        className="btn btn-secondary btn-wide"
      >
        Upload Image
      </button>
    </>
  );
};

export default CloudinaryImageUpload;
