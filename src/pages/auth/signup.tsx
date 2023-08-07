import React, { useRef } from "react";

// TODO use React Hook Forms instead of this

export default function SignUp() {
  const username = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const confirmPassword = useRef<HTMLInputElement>(null);
  const [error, setError] = React.useState<string | null>(null);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.current?.value !== confirmPassword.current?.value) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    const user = {
      username: username.current?.value,
      password: password.current?.value,
    };
    console.log({ user: user });
  };
  return (
    <div>
      SignUp
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>
          Username
          <input
            name="username"
            type="text"
            placeholder="Username"
            required
            ref={username}
          />
        </label>
        <label>
          Email
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            ref={email}
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            placeholder="*******"
            autoComplete="new-password"
            required
            ref={password}
          />
        </label>
        <label>
          Confirm Password
          <input
            name="confirmPassword"
            type="password"
            placeholder="*******"
            autoComplete="new-password"
            required
            ref={confirmPassword}
          />
        </label>
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <a href="/auth/signin">Log In.</a>
      </p>
      {error && (
        <p>
          ERROR
          <br />
          {error}
        </p>
      )}
    </div>
  );
}
