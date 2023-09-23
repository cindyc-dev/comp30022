import { signIn } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

import PasswordInput from "~/components/common/passwordInput";
import { api } from "~/utils/api";
import { useToast } from "~/components/hooks/toastContext";
import TextInput from "~/components/common/textInput";

// Dynamic import to prevent SSR error
const PasswordChecklist = dynamic(() => import("react-password-checklist"), {
  ssr: false,
});
export const SignUpForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordValid, setPasswordValid] = useState<boolean>(false);

  const mutation = api.user.register.useMutation();

  const { addToast } = useToast();

  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if password is valid
    if (!passwordValid) {
      console.log("Password is not valid");
      return;
    }

    const user = {
      email: email,
      password: password,
    };
    console.log({ user: user });
    mutation.mutate(user, {
      onSuccess: async (data) => {
        console.log({ data: data });

        // Sign In and redirect to dashboard
        const res = await signIn("credentials", {
          email: email,
          password: password,
          redirect: true,
          callbackUrl: "/dashboard",
        });

        console.log({ res: res });
      },
      onError: (error) => {
        console.log({ error: error });

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
      <form onSubmit={(e) => createUser(e)}>
        <div className="form-control">
          <TextInput
            label="Name"
            placeholder="eg. Jane Green"
            value={email}
            setValue={setEmail}
            required={true}
          />
        </div>
        <PasswordInput
          setValue={setPassword}
          isShowHide={true}
          label="Password"
          value={password}
          required={true}
        />
        <PasswordInput
          setValue={setConfirmPassword}
          isShowHide={false}
          label="Confirm Password"
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

        <div className="form-control mt-6">
          <button
            className={`btn btn-primary ${!passwordValid && "btn-disabled"}`}
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
