import Link from "next/link";
import { FaGithub } from "react-icons/fa";

const GROUP_MEMBERS = [
  {
    name: "Ashley Teoh",
    github: "https://github.com/ashleyteoh",
  },
  {
    name: "Aurelia Iskandar",
    github: "https://github.com/aiskd",
  },
  {
    name: "Chuah Xin Yu (Cindy)",
    github: "https://github.com/chuahxinyu",
  },
  {
    name: "Daniel Chin Weng Jae",
    github: "https://github.com/Jaee-C",
  },
  {
    name: "Gan Yu Pin",
    github: "https://github.com/Gyp1127",
  },
];

export const Footer = () => {
  return (
    <footer className="footer footer-center mt-2 w-full bg-primary py-2 text-primary-content">
      <div>
        <div className="flex gap-4">
          <p>Made with Awesomeness 🤟 for COMP30022</p>
          <Link href="https://github.com/chuahxinyu/comp30022" target="_blank">
            <FaGithub className="text-xl" />
          </Link>
        </div>
        <p>
          {GROUP_MEMBERS.map((member) => (
            <span key={member.name}>
              <a
                className="link underline"
                href={member.github}
                target="_blank"
              >
                {member.name}
              </a>
              ,{" "}
            </span>
          ))}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
