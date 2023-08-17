import Link from "next/link";
import { useRouter } from "next/router";
import { FaCalendarAlt } from "react-icons/fa";
import { BsKanbanFill, BsFillPeopleFill } from "react-icons/bs";

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
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <Link
          className="px-2 text-xl font-bold normal-case text-primary"
          href="/dashboard"
        >
          PotatoCRM
        </Link>
      </div>
      <div className="navbar-center">
        <ul className="menu menu-horizontal px-1">
          {PAGES.map(({ icon, path, name }) => (
            <li>
              <Link href={path} className={currentPage === path ? "focus" : ""}>
                {icon}
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end">
        <div className="dropdown-end dropdown">
          <label tabIndex={0} className="avatar btn btn-circle btn-ghost">
            <div className="w-10 rounded-full">
              <picture>
                <img src="https://nextluxury.com/wp-content/uploads/funny-profile-pictures-2.jpg" />
              </picture>
            </div>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box menu-sm z-[1] mt-3 w-52 bg-base-100 p-2 shadow"
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
