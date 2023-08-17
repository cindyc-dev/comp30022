import { Layout } from "~/components/layout/layout";
import Image from "next/image";
import { useState } from "react";
import PasswordInput from "~/components/common/passwordInput";
import { TextInput } from "~/components/common/textInput";
import dynamic from "next/dynamic";
import { ModalProvider, useModal } from "~/components/hooks/modalcontext";
import { UploadImageModal } from "~/components/uploadImageModal";
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

  // TODO Fetch user data from API

  const savePersonalDetails = () => {
    if (!name || !contact || !email) {
      console.log("Missing personal details");
      return;
    }

    console.log("Saving personal details");
    console.log({ name, contact, email });
    // TODO Save user data to API
  };

  const changePassword = () => {
    if (!currentPassword || !passwordValid) {
      console.log("Missing password details");
      return;
    }

    console.log("Changing password");
    console.log({ currentPassword, newPassword, confirmNewPassword });
    // TODO Change password in API
  };

  const editPhoto = () => {
    console.log("Editing photo");
    openModal();
    // TODO Edit photo in API
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
            <label className="h avatar btn btn-circle btn-ghost h-40 w-40">
              <div className="rounded-full">
                <Image
                  src="https://wallpapers.com/images/hd/funny-profile-picture-ylwnnorvmvk2lna0.jpg"
                  alt="profile picture"
                  fill={true}
                  className="m-0 rounded-full"
                />
              </div>
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
      <UploadImageModal />
    </Layout>
  );
}
