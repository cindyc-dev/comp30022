import AuthLayout from "~/components/authLayout";
import { SignInForm } from "~/components/signInForm";



export default function SignIn(){
  return <AuthLayout children={<SignInForm/>} />;
}
