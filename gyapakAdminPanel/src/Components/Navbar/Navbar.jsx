// components/admin/AdminHeader.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 left-0 right-0 py-4  bg-white shadow-md z-20">
      <div className="container mx-auto px-3 py-1">
        <div className="items-center">
          <div className="flex items-center justify-between">
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <img
                src="gyapak-logo.png"
                alt="Gyapak Logo"
                className="w-36 h-10"
              />
            </div>
            <div>
              <div className="flex space-x-6 ml-4">
                <div className="flex px-3 py-2 rounded-2xl bg-purple-700 gap-3">
                  <div className="w-6 h-6  bg-green-400 rounded-full border-[3px] border-green-600 animate-pulse"></div>
                  <button onClick={() => navigate("/magic-created" )} className=" text-xl cursor-pointer text-white ">
                    Magic
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
