import AuthLayout from "~/components/authLayout";
import { SignInForm } from "~/components/signInForm";
import { authOptions } from "~/server/auth";


export default function SignIn(){
  return <AuthLayout children={<SignInForm/>} />;
}
