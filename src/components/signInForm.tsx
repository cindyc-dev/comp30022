import { ChangeEvent, useState } from "react";
import PasswordInput from "./common/passwordInput";
import Link from "next/link";

export const SignInForm = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setLoading(false);

    console.log({ username: username, password: password });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  return (
    <div className="card-body">
      <h2 className="card-title m-auto">Welcome Back!</h2>
      <p className="text-center">
        New to PotatoCRM?{" "}
        <Link href="/auth/signup" className="link-primary link">
          {" "}
          Create an account.
        </Link>
      </p>
      <form onSubmit={onSubmit}>
        <label className="label">
          <span className="label-text mt-6">Username</span>
        </label>
        <input
          type="text"
          placeholder="Jane Green"
          className="input input-bordered w-full max-w-xs"
          name="username"
          onChange={handleChange}
        />
        <PasswordInput
          setValue={setPassword}
          isShowHide={true}
          label="Password"
        />

        <button
          type="submit"
          className="btn btn-primary mt-6 w-full max-w-xs"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};
