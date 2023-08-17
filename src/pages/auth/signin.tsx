import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getServerSession } from "next-auth";
import { getCsrfToken, getProviders } from "next-auth/react";
import AuthLayout from "~/components/authLayout";
import { SignInForm } from "~/components/signInForm";
import { authOptions } from "~/server/auth";

export default function SignIn({
  providers,
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <AuthLayout children={<SignInForm />} />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: "/dashboard" } };
  }

  const providers = await getProviders();

  return {
    props: {
      providers: providers,
      csrfToken: (await getCsrfToken(context)) ?? [],
    },
  };
}
