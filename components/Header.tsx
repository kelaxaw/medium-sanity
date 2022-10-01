import Link from "next/link";
import React from "react";
import logo from "../public/medium-logo.svg";
import Image from "next/image";

export const Header = () => {
  return (
    <header className="flex justify-between items-center py-5 px-5 lg:px-[141px] bg-yellow border-b border-black w-full sticky top-0 left-0 z-50">
      <div className="flex items-center space-x-5">
        <Link href={"/"}>
          <Image src={logo} width={161} height={24} />
        </Link>
      </div>

      <div className="flex items-center space-x-5 text-black">
        <div className="hidden lg:inline-flex space-x-5">
          <h3>Our story</h3>
          <h3>Membership</h3>
          <h3>Write</h3>
        </div>

        <h3>Sign in</h3>
        <button className="bg-black text-white rounded-full px-4 py-1">
          Get started
        </button>
      </div>
    </header>
  );
};
