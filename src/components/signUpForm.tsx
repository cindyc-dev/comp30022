
import { signIn } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

import PasswordInput from "~/components/passwordInput";

// Dynamic import to prevent SSR error
const PasswordChecklist = dynamic(() => import("react-password-checklist"), {
  ssr: false,
});
import { api } from "~/utils/api";


export const SignUpForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordValid, setPasswordValid] = useState<boolean>(false);

  const mutation = api.user.register.useMutation();

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
      onSuccess: (data) => {
        console.log({ data: data });
        // Sign In and redirect to dashboard
        signIn("credentials", {
          email: email,
          password: password,
          redirect: true,
          callbackUrl: "/dashboard",
        });
      },
    });
  };

  return <div className="card-body">
    <h2 className="card-title m-auto">Sign Up!</h2>
    <form onSubmit={(e) => createUser(e)}>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="text"
          placeholder="example@example.com"
          className="input input-bordered"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Password</span>
        </label>
        <PasswordInput setValue={setPassword} isShowHide={true} />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Confirm Password</span>
        </label>
        <PasswordInput setValue={setConfirmPassword} isShowHide={false} />
      </div>
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
    <p className="text-sm">
    Already have an account?{" "}
      <Link href="/auth/signin" className="link-primary link">
      Log In.
      </Link>
    </p>
  </div>;

};