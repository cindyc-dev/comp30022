import { Layout } from "~/components/layout";

export default function Profile() {
  return (
    <Layout>
      <div>
        <h1>Profile Settings</h1>
        <hr />
        <div className="flex justify-between">
          <div>
            <h2>Personal details</h2>
            <p>Update your personal details.</p>
          </div>
          <button className="btn btn-primary">Save changes</button>
        </div>
        <div className="flex">
          <div>Photo</div>
          <div>
            <input
              type="text"
              placeholder="Name"
              className="input input-bordered w-full max-w-xs"
            />
            <input
              type="text"
              placeholder="Contact"
              className="input input-bordered w-full max-w-xs"
            />
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full max-w-xs"
            />
          </div>
        </div>
        <hr />
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
