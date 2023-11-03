import Link from "next/link";
import React from "react";

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

function InfoSection() {
  return (
    <div className="prose">
      <h3>Privacy Policy and Terms and Conditions</h3>
      <p>
        <Link href="/about/privacy" className="link cursor-pointer underline">
          🔏 Privacy Policy
        </Link>{" "}
        |{" "}
        <Link href="/about/terms" className="link cursor-pointer underline">
          📜 Terms and Conditions
        </Link>
      </p>
      <h3>Group Members</h3>
      <p>
        {GROUP_MEMBERS.map((member) => (
          <span key={member.name}>
            <a className="link underline" href={member.github} target="_blank">
              {member.name}
            </a>
            ,{" "}
          </span>
        ))}
      </p>
    </div>
  );
}

export default InfoSection;
