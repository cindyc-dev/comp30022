import { useState } from "react";
import PasswordInput from "./common/passwordInput";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { FaDiscord } from "react-icons/fa";

export const SignInForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });
    console.log({ res: res });
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
        {/* <input name="csrfToken" type="hidden" defaultValue={csrfToken} /> */}
        <label className="label">
          <span className="label-text mt-6">Email</span>
        </label>
        <input
          type="email"
          placeholder="example@email.com"
          className="input input-bordered w-full max-w-xs"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <PasswordInput
          setValue={setPassword}
          isShowHide={true}
          label="password"
        />
        <button type="submit" className="btn btn-primary mt-6 w-full max-w-xs">
          Sign In
        </button>
      </form>
      <hr />
      <div>
        <button
          className="btn rounded-btn w-full"
          onClick={() => signIn("discord")}
        >
          <FaDiscord />
          Sign in with Discord
        </button>
      </div>
    </div>
  );
};

export default SignInForm;

// export const getServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   return {
//     props: {
//       csrfToken: await getCsrfToken(context),
//     },
//   };
// };
