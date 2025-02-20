import { Search } from "lucide-react";

const Searchbar = () => {
  return (
    <div className="relative w-full max-w-[400px] p-2 md:p-3 lg:p-0">
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-3 flex items-center pl-3 pointer-events-none text-mutedSand lg:left-0">
        <Search className="w-5 h-5" />
      </div>
      {/* Input Field */}
      <input
        type="text"
        placeholder="Search books..."
        className="w-full pl-10 pr-4 py-2 rounded-[8px] bg-[#2E2E2E] border border-[#3A2E2B] text-[#EAE0D5] placeholder:[#BFB6A8] focus:border-[#D68C45] focus:outline-none focus:ring-1 focus:ring-[#D68C45] transition duration-200"
      />
    </div>
  );
};

export default Searchbar;
