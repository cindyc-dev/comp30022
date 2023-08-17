import Link from "next/link";
import { useRouter } from "next/router";
import { FaCalendarAlt } from "react-icons/fa";
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
    <div className="navbar sticky top-0 z-50 bg-base-100 shadow">
      <div className="navbar-start">
        {/* Hamburger Dropdown for Smaller Phones */}
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-52 bg-base-100 p-2 shadow"
          >
            {PAGES.map(({ icon, path, name }) => (
              <li key={name}>
                <Link
                  href={path}
                  className={currentPage === path ? "focus" : ""}
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
          className="px-2 text-xl font-bold normal-case text-primary"
          href="/dashboard"
        >
          PotatoCRM
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {PAGES.map(({ icon, path, name }) => (
            <li key={name}>
              <Link href={path} className={currentPage === path ? "focus" : ""}>
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
            className="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-52 bg-base-100 p-2 shadow"
          >
            <li>
              <Link href="/profile">Profile</Link>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
