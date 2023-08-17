import dynamic from "next/dynamic";
import { useState } from "react";
import PasswordInput from "~/components/common/passwordInput";
import { useToast } from "~/components/hooks/toastContext";

// Dynamic import to prevent SSR error
const PasswordChecklist = dynamic(() => import("react-password-checklist"), {
  ssr: false,
});

export const ChangePasswordSection = () => {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [passwordValid, setPasswordValid] = useState<boolean>(false);

  const { addToast } = useToast();

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

  return (
    <>
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
              rules={["minLength", "specialChar", "number", "capital", "match"]}
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
    </>
  );
};
