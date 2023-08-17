import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="footer footer-center bg-primary py-2 text-primary-content">
      <div>
        <div className="flex gap-4">
          <p>Made with Awesomeness 🤟 for COMP30022</p>
          <Link href="https://github.com/chuahxinyu/comp30022">
            <FaGithub className="text-xl" />
          </Link>
        </div>
        <p>
          <a className="link underline" href="">
            Ashley Teoh
          </a>
          ,{" "}
          <a className="link underline" href="">
            Aurelia Iskandar
          </a>
          ,{" "}
          <a className="link underline" href="">
            Cindy Chuah Xin Yu
          </a>
          ,{" "}
          <a className="link underline" href="">
            Daniel Chin Weng Jae
          </a>
          ,{" "}
          <a className="link underline" href="">
            Gan Yu Pin
          </a>
        </p>
      </div>
    </footer>
  );
};
