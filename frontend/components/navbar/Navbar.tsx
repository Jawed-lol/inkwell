"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import Searchbar from "@/components/navbar/searchbar";
import { useState } from "react";
import Drawer from "@/components/navbar/Drawer";

const itemsLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Store", href: "/store" },
];

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
    <>
      <nav
        className="bg-[#1B1B1B] text-[#EAE0D5] w-full fixed top-0 left-0 right-0 z-50 border-b-[1px] border-b-[#3A2E2B] shadow-[0px_2px_10px_rgba(0,0,0,0.2)]"
        aria-label="Main Navigation"
      >
        <div className="container flex items-center  lg:gap-5 mx-auto justify-between py-4 px-6 lg:px-8">
          {/* Left Section: Logo & Navigation */}
          <div className="flex items-center gap-3 md:gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/weblogo.png"
                alt="Inkwell Logo"
                width={90}
                height={90}
                className="hover:scale-[1.05] transition duration-200 ease-in-out"
              />
            </Link>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-end gap-6 text-[16px] font-[Author Sans] font-medium">
              {itemsLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="hover:text-[#D68C45] active:text-[#B36E30] transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Center Section: Search Bar (Hidden on Mobile) */}
          <div className="hidden md:flex flex-1 justify-center ">
            <Searchbar />
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Connect Button */}
            <Link href={"/login"}>
              <Button
                className="hidden md:block rounded-full bg-[#D68C45] text-[#EAE0D5] font-[General Sans] font-bold px-4 py-2 text-sm hover:bg-[#B36E30] transition duration-200"
                aria-label="Connect to Your Account"
              >
                Connect
              </Button>
            </Link>
          </div>
          {/* Mobile Menu Icon */}
          <Button
            variant="link"
            className="p-0 [&_svg]:w-6 [&_svg]:h-6 md:hidden text-mutedSand hover:text-burntAmber active:text-deepCopper"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open Menu"
          >
            <MenuIcon />
          </Button>
        </div>
      </nav>
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};

export default Navbar;
