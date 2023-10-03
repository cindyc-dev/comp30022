import AuthLayout from "./_authLayout";
import { SignInForm } from "./_signInForm";

export default function SignIn() {
  return <AuthLayout children={<SignInForm />} />;
}
