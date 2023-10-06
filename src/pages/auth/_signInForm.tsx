import { useEffect, useState } from "react";
import PasswordInput from "../../components/common/passwordInput";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { FaDiscord, FaGithub, FaGoogle } from "react-icons/fa";
import { useRouter } from "next/router";
import { useToast } from "../../components/hooks/toastContext";
import TextInput from "~/components/common/textInput";

export const SignInForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [valid, setValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
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
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (email && password) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [email, password]);

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
        <TextInput
          label="Email"
          placeholder="eg. example@company.com"
          value={email}
          setValue={setEmail}
          required={true}
        />
        <PasswordInput
          setValue={setPassword}
          isShowHide={true}
          label="Password"
          value={password}
          required={true}
        />
        <button
          type="submit"
          className={`btn btn-primary ${
            (!valid || isLoading) && "btn-disabled"
          } btn-block my-2`}
        >
          {isLoading ? (
            <span className="loading loading-spinner text-primary"></span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
      <hr />
      <div className="flex flex-col gap-2">
        <button
          className="btn rounded-btn w-full"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          <FaGoogle />
          Sign in with Google
        </button>
        <button
          className="btn rounded-btn w-full"
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
        >
          <FaGithub />
          Sign in with GitHub
        </button>
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
