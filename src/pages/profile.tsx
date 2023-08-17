import { Layout } from "~/components/layout/layout";
import { useState } from "react";
import PasswordInput from "~/components/common/passwordInput";
import { TextInput } from "~/components/common/textInput";
import dynamic from "next/dynamic";
import { useModal } from "~/components/hooks/modalContext";
import { UploadImageModalContent } from "~/components/uploadImageModalContent";
import { AvatarImage } from "~/components/common/avatarImage";
import { useToast } from "~/components/hooks/toastContext";
// Dynamic import to prevent SSR error
const PasswordChecklist = dynamic(() => import("react-password-checklist"), {
  ssr: false,
});

export default function Profile() {
  const [name, setName] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [passwordValid, setPasswordValid] = useState<boolean>(false);

  const { openModal } = useModal();
  const { addToast } = useToast();

  // TODO Fetch user data from API

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

  const changePassword = () => {
    if (!currentPassword || !passwordValid) {
      // Show error toast
      addToast({
        type: "error",
        message:
          "Both current and new passwords are required and must satisfy the password requirements.",
      });
      return;
    }

    // TODO Change password in API
  };

  const editPhoto = () => {
    openModal({
      content: <UploadImageModalContent />,
      id: "upload-image-modal",
    });
  };

  return (
    <Layout>
      <div className="my-3 flex w-full flex-col gap-3 md:my-5">
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

        <hr className="mb-2 mt-0" />

        <div className="flex flex-col justify-between align-middle md:flex-row md:gap-5">
          <div>
            <h2 className="m-0">Change Password</h2>
            <p className="m-0 text-sm">
              Enter your current password and new password
            </p>
          </div>
          <button
            className="btn btn-primary hidden md:block"
            onClick={() => changePassword()}
          >
            Change Password
          </button>
        </div>
        <div>
          <div className="flex w-full flex-col items-center gap-2 md:flex-row md:gap-4">
            <div className="flex w-full flex-col">
              <PasswordInput
                setValue={setCurrentPassword}
                isShowHide={true}
                label="Current Password"
              />
              <PasswordInput
                setValue={setNewPassword}
                isShowHide={true}
                label="New Password"
              />
              <PasswordInput
                setValue={setConfirmNewPassword}
                isShowHide={false}
                label="Confirm New Password"
              />
            </div>
            <div className="mt-2 hidden w-1/2 md:block">
              <PasswordChecklist
                rules={[
                  "minLength",
                  "specialChar",
                  "number",
                  "capital",
                  "match",
                ]}
                minLength={8}
                value={newPassword}
                valueAgain={confirmNewPassword}
                onChange={(isValid) => setPasswordValid(isValid)}
                className="text-xs"
              />
            </div>
            {newPassword && (
              <div className="mt-2 md:hidden">
                <PasswordChecklist
                  rules={[
                    "minLength",
                    "specialChar",
                    "number",
                    "capital",
                    "match",
                  ]}
                  minLength={8}
                  value={newPassword}
                  valueAgain={confirmNewPassword}
                  onChange={(isValid) => setPasswordValid(isValid)}
                  className="text-xs"
                />
              </div>
            )}
          </div>
        </div>
        <button
          className="btn btn-primary btn-block md:hidden"
          onClick={() => changePassword()}
        >
          Change Password
        </button>
      </div>
    </Layout>
  );
}
