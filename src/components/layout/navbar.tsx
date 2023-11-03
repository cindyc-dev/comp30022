import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { FaBars, FaCalendarAlt } from "react-icons/fa";
import { BsKanbanFill, BsFillPeopleFill } from "react-icons/bs";
import { AvatarImage } from "../common/avatarImage";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { useToast } from "../hooks/toastContext";
import { DEFAULT_PROFILE_PIC } from "~/sample_data/sampleConnections";
import Image from "next/image";
import { ThemeT, useTheme } from "../hooks/themeContext";

const PAGES = [
  {
    name: "Connections",
    path: "/connections",
    icon: <BsFillPeopleFill />,
  },
  {
    name: "Trello",
    path: "/trello",
    icon: <BsKanbanFill />,
  },
  {
    name: "Calendar",
    path: "/calendar",
    icon: <FaCalendarAlt />,
  },
];

export const Navbar = () => {
  // Check current page to highlight the navbar link
  const router = useRouter();
  const currentPage = router.pathname;
  const [profileImage, setProfileImage] = useState<string>(DEFAULT_PROFILE_PIC);

  const { data: profileDetails } = api.details.profile.useQuery();

  const { addToast } = useToast();

  // Get profile image from API and set it
  useEffect(() => {
    if (profileDetails) {
      if (!profileDetails?.email) {
        addToast({
          message: "Please add your email to your profile",
          type: "error",
        });
      }
      if (profileDetails?.image) {
        setProfileImage(profileDetails.image);
      } else {
        setProfileImage(DEFAULT_PROFILE_PIC);
      }
    }
  }, [profileDetails]);

  const { theme, changeTheme } = useTheme();

  return (
    <div className="navbar sticky top-0 z-50 bg-primary text-primary-content shadow">
      <div className="navbar-start">
        {/* Hamburger Dropdown for Smaller Phones */}
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <FaBars />
          </label>
          <ul
            tabIndex={0}
            className="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-52 bg-primary p-2 shadow"
          >
            {PAGES.map(({ icon, path, name }) => (
              <li key={name}>
                <Link
                  href={path}
                  className={
                    currentPage === path
                      ? "bg-primary-focus !text-primary-content"
                      : "!text-primary-content"
                  }
                >
                  {icon}
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Logo */}
        <Link
          className="flex gap-2 px-2 text-xl font-bold normal-case"
          href="/dashboard"
        >
          <Image
            src="/svg/Logo-white.svg"
            alt="Potato Logo"
            width={20}
            height={0}
            className="m-0 p-0"
          />
          PotatoCRM
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-2 px-1">
          {PAGES.map(({ icon, path, name }) => (
            <li key={name}>
              <Link
                href={path}
                className={
                  currentPage === path
                    ? "bg-primary-focus !text-primary-content"
                    : "!text-primary-content"
                }
              >
                {icon}
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="avatar btn btn-circle btn-ghost">
            <div className="w-10">
              {profileImage && <AvatarImage src={profileImage} />}
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-52 bg-primary p-2 shadow"
          >
            <li>
              <Link
                href="/profile"
                className={
                  currentPage === "/profile"
                    ? "bg-primary-focus !text-primary-content"
                    : "!text-primary-content"
                }
              >
                Profile
              </Link>
            </li>
            <li>
              <a onClick={() => signOut()} className="!text-primary-content">
                Logout
              </a>
            </li>
            <li>
              <select
                value={theme}
                onChange={(e) => {
                  changeTheme(e.target.value as ThemeT);
                }}
                className="select select-sm w-full bg-primary !text-primary-content"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="valentine">Valentine</option>
                <option value="cyberpunk">Cyberpunk</option>
                <option value="aqua">Aqua</option>
                <option value="pastel">Pastel</option>
                <option value="wireframe">Wireframe</option>
                <option value="bumblebee">Bumblebee</option>
                <option value="coffee">Coffee</option>
              </select>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
