import AuthLayout from "./_authLayout";
import { SignUpForm } from "./_signUpForm";

export default function SignUp() {
  return <AuthLayout children={<SignUpForm />} />;
}
