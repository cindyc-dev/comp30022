import { Layout } from "~/components/layout";
import Image from "next/image";
import { useState } from "react";

export default function Profile() {
  const [name, setName] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // TODO Fetch user data from API

  const savePersonalDetails = () => {
    if (!name || !contact || !email) {
      console.log("Missing personal details");
      return;
    }

    console.log("Saving personal details");
    console.log({ name, contact, email });
    // TODO Save user data to API
  };

  return (
    <Layout>
      <div className="flex flex-col gap-3">
        <h1 className="my-2">Profile Settings</h1>
        <hr className="mb-2 mt-0" />
        <div className="flex flex-col justify-between align-middle md:flex-row md:gap-5">
          <div>
            <h2 className="m-0">Personal details</h2>
            <p className="m-0 text-sm">
              Personal details will appear as public on your account page.
            </p>
          </div>
          <button
            className="btn btn-primary hidden md:block"
            onClick={() => savePersonalDetails()}
          >
            Save changes
          </button>
        </div>
        <div className="flex flex-col items-center gap-4 align-middle md:flex-row md:justify-between">
          <div className="flex">
            <label className="h avatar btn btn-circle btn-ghost h-40 w-40">
              <div className="rounded-full">
                <Image
                  src="https://wallpapers.com/images/hd/funny-profile-picture-ylwnnorvmvk2lna0.jpg"
                  alt="profile picture"
                  fill={true}
                  className="m-0 rounded-full"
                />
              </div>
            </label>
          </div>
          <div className="flex w-full flex-col items-center gap-2">
            <input
              type="text"
              placeholder="Name"
              className="input input-bordered w-full max-w-xs"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Contact"
              className="input input-bordered w-full max-w-xs"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full max-w-xs"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <button
          className="btn btn-primary btn-block md:hidden"
          onClick={() => savePersonalDetails()}
        >
          Save changes
        </button>
        <hr className="mb-2 mt-0" />
        <div>
          <h2>Change Password</h2>
          <p>Enter your current password and new password</p>
          <div>
            <p>Current password</p>
            <div className="flex">
              <p>New password</p>
              <button className="btn btn-primary">Done</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
