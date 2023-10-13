import { signIn } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

import PasswordInput from "~/components/common/passwordInput";
import { api } from "~/utils/api";
import { useToast } from "~/components/hooks/toastContext";
import TextInput from "~/components/common/textInput";
import RequiredStar from "~/components/common/requiredStar";

// Dynamic import to prevent SSR error
const PasswordChecklist = dynamic(() => import("react-password-checklist"), {
  ssr: false,
});
export const SignUpForm = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordValid, setPasswordValid] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);

  const mutation = api.user.register.useMutation();

  const { addToast } = useToast();

  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if password is valid
    if (!name || !passwordValid || !checked) {
      // Show error toast
      addToast({
        type: "error",
        message: "Name, Password and Terms and Conditions are required.",
      });
      return;
    }

    const user = {
      name: name,
      email: email,
      password: password,
    };

    mutation.mutate(user, {
      onSuccess: async (data) => {
        console.log({ data: data });

        // Sign In and redirect to dashboard
        await signIn("credentials", {
          email: email,
          password: password,
          redirect: true,
          callbackUrl: "/dashboard",
        });
      },
      onError: (error) => {
        // Show error toast
        addToast({
          type: "error",
          message: `${error}. Please try again.`,
        });
      },
    });
  };

  return (
    <div className="card-body">
      <h2 className="card-title m-auto">Sign Up!</h2>
      <p className="text-sm">
        Already have an account?{" "}
        <Link href="/auth/signin" className="link-primary link">
          Log In.
        </Link>
      </p>
      <form onSubmit={(e) => createUser(e)} className="flex flex-col gap-2">
        <TextInput
          label="👤 Name"
          placeholder="eg. Jane Green"
          value={name}
          setValue={setName}
          required={true}
        />
        <TextInput
          label="📧 Email"
          placeholder="eg. name@company.com"
          value={email}
          setValue={setEmail}
          required={true}
        />
        <PasswordInput
          setValue={setPassword}
          isShowHide={true}
          label="🔒 Password"
          value={password}
          required={true}
        />
        <PasswordInput
          setValue={setConfirmPassword}
          isShowHide={false}
          label="🔒 Confirm Password"
          value={confirmPassword}
          required={true}
        />
        <div className="mt-2">
          <PasswordChecklist
            rules={["minLength", "specialChar", "number", "capital", "match"]}
            minLength={8}
            value={password}
            valueAgain={confirmPassword}
            onChange={(isValid) => setPasswordValid(isValid)}
            className="text-xs"
          />
        </div>

        {/* Privacy Policy and Terms and Conditions */}
        <div className="flex gap-2">
          <input
            type="checkbox"
            checked={checked}
            className="checkbox-primary checkbox checkbox-sm mt-3"
            onChange={(e) => {
              setChecked(e.target.checked);
            }}
          />
          <p className="text-sm">
            I agree with the{" "}
            <Link
              href="/about/privacy"
              className="link cursor-pointer underline"
            >
              Privacy Policy
            </Link>
            <RequiredStar /> and{" "}
            <Link href="/about/terms" className="link cursor-pointer underline">
              Terms and Conditions
            </Link>
            <RequiredStar />
          </p>
        </div>

        <div className="form-control mt-3">
          <button
            className={`btn btn-primary ${
              (!name || !passwordValid || !checked) && "btn-disabled"
            }`}
            type="submit"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
