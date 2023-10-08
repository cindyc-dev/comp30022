import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import PasswordInput from "~/components/common/passwordInput";
import TextInput from "~/components/common/textInput";
import { useToast } from "~/components/hooks/toastContext";
import AboutLayout from "~/components/layout/aboutLayout";
import { checkEmail } from "~/components/utils/checkEmail";
import { api } from "~/utils/api";

// Dynamic import to prevent SSR error
const PasswordChecklist = dynamic(() => import("react-password-checklist"), {
  ssr: false,
});

const Forgot = () => {
  const [email, setEmail] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");

  const { addToast } = useToast();

  const forgotPasswordMutation = api.user.forgetPassword.useMutation();
  const handleSendEmail = () => {
    setIsLoading(true);
    forgotPasswordMutation.mutate(
      { email: email },
      {
        onSuccess: () => {
          addToast({
            type: "success",
            message: "Email sent!",
          });
          setIsEmailValid(false);
          setStep(1);
          setIsLoading(false);
        },
        onError: (error) => {
          console.log(error);
          addToast({
            type: "error",
            message: `Error sending email: ${error}. Error: ${error.message}`,
          });
          setIsLoading(false);
        },
      }
    );
  };

  const renewPasswordMutation = api.user.renewPassword.useMutation();
  const handleRenewPassword = () => {
    setIsLoading(true);
    renewPasswordMutation.mutate(
      { email: email, token: code, password: password },
      {
        onSuccess: () => {
          addToast({
            type: "success",
            message: "Password renewed!",
          });
          setIsLoading(false);
          // Redirect to login page
          window.location.href = "/auth/signin";
        },
        onError: (error) => {
          console.log(error);
          setIsLoading(false);
          addToast({
            type: "error",
            message: `Error renewing password: ${error}. Error: ${error.message}`,
          });
        },
      }
    );
  };

  /* Check if email is valid when changed */
  useEffect(() => {
    if (checkEmail(email)) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(false);
    }
  }, [email]);

  return (
    <AboutLayout>
      <div className="mt-10 flex w-full flex-col gap-2">
        <h1>Forgot Password</h1>
        {step === 0 && (
          <div className="flex w-full flex-col gap-4">
            <p>A 6-digit code will be sent to your account's email.</p>
            <TextInput
              label="📧 Email"
              type="email"
              value={email}
              setValue={(v) => setEmail(v)}
              placeholder="eg. name@company.com"
              required={true}
            />
            <button
              className={`btn btn-primary ${
                (!isEmailValid || isLoading) && "btn-disabled"
              }`}
              onClick={() => handleSendEmail()}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="loading loading-spinner loading-md"></span>
                  Loading
                </div>
              ) : (
                "Send Email"
              )}
            </button>
          </div>
        )}
        {step === 1 && (
          <div className="flex w-full flex-col gap-4">
            <p>Check your inbox for a 6-digit token</p>
            <TextInput
              label="🔢 Token (6 digits)"
              type="text"
              value={code}
              setValue={(v) => setCode(v)}
              placeholder="eg. 123456"
              required={true}
            />
            <PasswordInput
              label="🔑 New Password"
              value={password}
              setValue={(v) => setPassword(v)}
              required={true}
              isShowHide={false}
            />
            <PasswordInput
              label="🔑 Confirm Password"
              value={passwordConfirm}
              setValue={(v) => setPasswordConfirm(v)}
              required={true}
              isShowHide={true}
            />
            <PasswordChecklist
              rules={["minLength", "specialChar", "number", "capital", "match"]}
              minLength={8}
              value={password}
              valueAgain={passwordConfirm}
              onChange={(isValid) => setIsPasswordValid(isValid)}
              className="text-xs"
            />
            <button
              className={`btn btn-primary ${
                (code.length !== 6 ||
                  !/^\d+$/.test(code) ||
                  !isPasswordValid ||
                  isLoading) &&
                "btn-disabled"
              }`}
              onClick={() => handleRenewPassword()}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="loading loading-spinner loading-md"></span>
                  Loading
                </div>
              ) : (
                "Reset Password"
              )}
            </button>
            <p className="link-primary link text-right text-sm underline">
              Try a different email
            </p>
          </div>
        )}
      </div>
    </AboutLayout>
  );
};

export default Forgot;
