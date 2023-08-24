"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import PasswordInput from "~/components/passwordInput";
import Link from "next/link";

export const SignInForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      username: username,
      password: password,
      callbackUrl: "/dashboard/index.js",
    });

    setLoading(false);

    console.log({ username: username, password: password });

    

  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  return (
    <div className="card-body">
      <h2  className="card-title m-auto">Welcome Back!</h2>
      <p className = "text-center">New to PotatoCRM? <Link href="/auth/signup" className="link link-primary"> Create an account.</Link></p>
      <form onSubmit={onSubmit}>
        <label className = "label">
          <span className = "label-text mt-6">Username</span>
        </label>
        <input 
          type= "text" 
          placeholder = "Type here" 
          className="input input-bordered w-full max-w-xs" 
          name="username" 
          onChange={handleChange} />
        <div className =  "form-control">
          <label className = "label">
            <span className = "label-text">Password</span>
          </label>
          < PasswordInput setValue={setPassword} isShowHide={true} />
        </div>
        
        <button 
          type = "submit"
          className = "btn btn-primary w-full max-w-xs mt-6"
          disabled={loading}
        >
            {loading ? "Loading..." : "Sign In"}
        </button>
      </form>
    </div>

  );

};
