import { motion, AnimatePresence } from "framer-motion";
import { XIcon } from "lucide-react";
import Link from "next/link";
import Searchbar from "@/components/navbar/searchbar";
import { Button } from "@/components/ui/button";

const itemsLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Store", href: "/store" },
];

const Drawer = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-0 right-0 bottom-0 w-[75%] max-w-[320px] bg-[#252525] text-[#EAE0D5] z-50 overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#3A2E2B]">
            <span className="text-xl font-author font-bold">Menu</span>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#3A2E2B] rounded-full transition duration-200"
            >
              <XIcon className="w-6 h-6 text-[#EAE0D5]" />
            </button>
          </div>
          {/* SearchBar */}
          <div>
            <Searchbar />
          </div>
          {/* Navigation Links */}
          <div className="px-6 py-4 space-y-4">
            {itemsLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={onClose}
                className="block text-lg font-author font-medium hover:text-[#D68C45] active:text-[#B36E30] transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link href={"/login"} className={"flex justify-center items-center"}>
            <Button
              className="rounded-full bg-[#D68C45] text-[#EAE0D5] font-[General Sans] font-bold px-4 py-2 text-sm hover:bg-[#B36E30] transition duration-200"
              aria-label="Connect to Your Account"
            >
              Connect
            </Button>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
