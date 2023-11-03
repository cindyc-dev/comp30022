import { Layout } from "~/components/layout/layout";
import { PersonalDetailsSection } from "../../components/profile/personalDetailsSection";
import { ChangePasswordSection } from "../../components/profile/changePasswordSection";
import InfoSection from "~/components/profile/infoSection";

export default function Profile() {
  return (
    <Layout>
      <div className="my-3 flex w-full flex-col gap-3 md:my-5">
        <h1 className="my-2">Profile Settings</h1>
        <hr className="mb-2 mt-0" />
        <PersonalDetailsSection />
        <hr className="mb-2 mt-0" />
        <ChangePasswordSection />
        <hr className="mb-2 mt-0" />
        <InfoSection />
      </div>
    </Layout>
  );
}

Profile.auth = true;
