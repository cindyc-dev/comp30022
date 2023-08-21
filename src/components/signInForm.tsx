"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import Link from "next/link";

export const SignInForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      setLoading(true);
      setFormValues({ username: "", password: "" });

      const res = await signIn("credentials", {
        redirect: false,
        username: formValues.username,
        password: formValues.password,
        callbackUrl: "/dashboard/index.js",
      });

      setLoading(false);

      console.log({ username: formValues.username, password: formValues.password });

      if (!res?.error) {
        router.push(callbackUrl);
      } else {
        setError("Invalid username or password");
      }
    } catch (error: any){
      setLoading(false);
      setError(error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
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
          value={formValues.username} 
          onChange={handleChange} />
        <label className = "label">
          <span className = "label-text">Password</span>
        </label>
        <input
          type="password"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs"
          name="password"
          value={formValues.password}
          onChange={handleChange}
        />
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
