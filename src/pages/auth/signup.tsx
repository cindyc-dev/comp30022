import { signIn } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import PasswordInput from "~/components/passwordInput";
import Toast from "~/components/toastSection";
// Dynamic import to prevent SSR error
const PasswordChecklist = dynamic(() => import("react-password-checklist"), {
  ssr: false,
});
import { api } from "~/utils/api";

export default function SignUp() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const mutation = api.user.register.useMutation();

  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

  return (
    <div className="hero min-h-screen bg-base-200">
      {mutation.error && (
        <Toast toasts={[{ type: "error", message: mutation.error.message }]} />
      )}
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="p-10 text-center lg:text-left">
          <h1 className="text-5xl font-bold">PotatoCRM</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
        </div>
        <div className="card w-full max-w-sm flex-shrink-0 bg-base-100 shadow-2xl">
          <div className="card-body">
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
                <PasswordInput setValue={setPassword} />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <input
                  className="input input-bordered"
                  name="confirmPassword"
                  type="password"
                  placeholder="*******"
                  autoComplete="new-password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mt-2">
                <PasswordChecklist
                  rules={[
                    "minLength",
                    "specialChar",
                    "number",
                    "capital",
                    "match",
                  ]}
                  minLength={8}
                  value={password}
                  valueAgain={confirmPassword}
                  onChange={(isValid) => console.log({ isValid })}
                  className="text-xs"
                />
              </div>

              <div className="form-control mt-6">
                <button className="btn btn-primary" type="submit">
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
          </div>
        </div>
      </div>
    </div>
  );
}
