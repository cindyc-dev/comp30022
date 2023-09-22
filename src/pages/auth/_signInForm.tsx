import { useState } from "react";
import PasswordInput from "../../components/common/passwordInput";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { FaDiscord, FaGithub, FaGoogle } from "react-icons/fa";
import { useRouter } from "next/router";
import { useToast } from "../../components/hooks/toastContext";

export const SignInForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });
    console.log(res);
    // Show error toast if login failed
    if (res?.error && !res?.ok) {
      console.log(res.error);

      // Show error toast
      addToast({
        type: "error",
        message: `${res.error}. Incorrect Email and/or Password. Please try again.`,
      });
    }

    // Show success toast and redirect to dashboard if login successful
    if (res?.ok) {
      // Show success toast
      addToast({
        type: "success",
        message: "Login successful!",
      });

      // redirect to dashboard
      router.push("/dashboard");
    }
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
      <form onSubmit={handleSubmit}>
        <label className="label">
          <span className="label-text mt-6">Email</span>
        </label>
        <input
          type="email"
          placeholder="eg. example@company.com"
          className="input input-bordered w-full max-w-xs"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <PasswordInput
          setValue={setPassword}
          isShowHide={true}
          label="Password"
          value={password}
        />
        <button type="submit" className="btn btn-primary mt-6 w-full max-w-xs">
          Sign In
        </button>
      </form>
      <hr />
      <div className="flex flex-col gap-2">
        <button
          className="btn rounded-btn w-full"
          onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
        >
          <FaDiscord />
          Sign in with Discord
        </button>
      </div>
    </div>
  );
};

export default SignInForm;
