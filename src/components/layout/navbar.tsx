import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { FaBars, FaCalendarAlt } from "react-icons/fa";
import { BsKanbanFill, BsFillPeopleFill } from "react-icons/bs";
import { AvatarImage } from "../common/avatarImage";

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

  return (
    <div className="navbar sticky top-0 z-50 bg-neutral text-neutral-content shadow">
      <div className="navbar-start">
        {/* Hamburger Dropdown for Smaller Phones */}
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <FaBars />
          </label>
          <ul
            tabIndex={0}
            className="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-52 bg-neutral p-2 shadow"
          >
            {PAGES.map(({ icon, path, name }) => (
              <li key={name}>
                <Link
                  href={path}
                  className={
                    currentPage === path
                      ? "bg-neutral-focus !text-neutral-content"
                      : "!text-neutral-content"
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
        <Link className="px-2 text-xl font-bold normal-case" href="/dashboard">
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
                    ? "bg-neutral-focus !text-neutral-content"
                    : "!text-neutral-content"
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
              <AvatarImage src="https://wallpapers.com/images/hd/funny-profile-picture-ylwnnorvmvk2lna0.jpg" />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-52 bg-neutral p-2 shadow"
          >
            <li>
              <Link
                href="/profile"
                className={
                  currentPage === "/profile"
                    ? "bg-neutral-focus !text-neutral-content"
                    : "!text-neutral-content"
                }
              >
                Profile
              </Link>
            </li>
            <li>
              <Link href="/auth/logout" className="!text-neutral-content">
                Log Out
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
