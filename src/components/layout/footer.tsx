import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="footer footer-center mt-2 w-full bg-primary py-2 text-xs text-primary-content">
      <div>
        
        <div className="flex gap-4">
          <p>Made by Team 58 🤟 for COMP30022</p>
          <Link href="https://github.com/chuahxinyu/comp30022" target="_blank">
            <FaGithub className="text-xl" />
          </Link>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
