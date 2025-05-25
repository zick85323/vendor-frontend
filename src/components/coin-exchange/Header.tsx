import React from "react";
import { Menu } from "lucide-react";
import logo from "../../../assets/icon.png"; // <-- Update path if necessary

interface HeaderProps {
  userName: string;
  role: string;
}

const Header: React.FC<HeaderProps> = ({ userName, role }) => {
  return (
    <header className="bg-amber-500 border-b border-zinc-200 px-4 py-2 flex justify-between items-center text-white">
      <div className="flex items-end gap-3">
        <div className="w-8 h-8">
          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        </div>
        <div className="text-xl font-bold">BIBUAIN</div>
      </div>
      <div className="flex items-center">
        <Menu className="w-6 h-6" />
      </div>
    </header>
  );
};

export default Header;
