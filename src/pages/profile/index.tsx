import { Layout } from "~/components/layout/layout";
import { PersonalDetailsSection } from "./_personalDetailsSection";
import { ChangePasswordSection } from "./_changePasswordSection";

export default function Profile() {
  return (
    <Layout>
      <div className="my-3 flex w-full flex-col gap-3 md:my-5">
        <PersonalDetailsSection />
        <hr className="mb-2 mt-0" />
        <ChangePasswordSection />
      </div>
    </Layout>
  );
}
