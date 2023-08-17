import AuthLayout from "~/components/authLayout";
import { SignUpForm } from "~/components/signUpForm";

export default function SignUp() {
  return <AuthLayout children={<SignUpForm />} />;
}
