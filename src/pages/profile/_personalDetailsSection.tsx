import { useEffect, useState } from "react";
import { AvatarImage } from "~/components/common/avatarImage";
import { TextInput } from "~/components/common/textInput";
import { useModal } from "~/components/hooks/modalContext";
import { UploadImageModal } from "../../components/common/uploadImageModal";
import { useToast } from "~/components/hooks/toastContext";

export const PersonalDetailsSection = () => {
  const [name, setName] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const { openModal } = useModal();
  const { addToast } = useToast();

  useEffect(() => {
    // TODO Fetch user data from API
  }, []);

  const savePersonalDetails = () => {
    if (!name || !contact || !email) {
      // Show error toast
      addToast({
        type: "error",
        message: "All fields (Name, Contact and Email) are required.",
      });
      return;
    }

    // TODO Save user data to API
  };

  const editPhoto = () => {
    openModal({
      content: <UploadImageModal />,
      id: "upload-image-modal",
    });
  };

  return (
    <>
      <h1 className="my-2">Profile Settings</h1>
      <hr className="mb-2 mt-0" />
      <div className="flex flex-col justify-between align-middle md:flex-row md:gap-5">
        <div>
          <h2 className="m-0">Personal details</h2>
          <p className="m-0 text-sm">
            Personal details will appear as public on your account page.
          </p>
        </div>
        <button
          className="btn btn-primary hidden md:block"
          onClick={() => savePersonalDetails()}
        >
          Save changes
        </button>
      </div>
      <div className="flex flex-col items-center gap-4 align-middle md:flex-row md:justify-between">
        <div className="flex flex-col text-center">
          <label
            className="avatar btn btn-circle btn-ghost h-40 w-40"
            onClick={() => editPhoto()}
          >
            <AvatarImage src="https://wallpapers.com/images/hd/funny-profile-picture-ylwnnorvmvk2lna0.jpg" />
          </label>
          <p
            className="link cursor-pointer text-xs"
            onClick={() => editPhoto()}
          >
            Edit Photo
          </p>
        </div>
        <div className="flex w-full flex-col items-center gap-2">
          <TextInput
            label="Name"
            value={name}
            setValue={setName}
            placeholder="John Green"
          />
          <TextInput
            label="Contact"
            value={contact}
            setValue={setContact}
            placeholder="012-3456789"
          />
          <TextInput
            label="Email"
            value={email}
            setValue={setEmail}
            placeholder="example@gmail.com"
            type="email"
          />
        </div>
      </div>
      <button
        className="btn btn-primary btn-block md:hidden"
        onClick={() => savePersonalDetails()}
      >
        Save changes
      </button>
    </>
  );
};

export default PersonalDetailsSection;
