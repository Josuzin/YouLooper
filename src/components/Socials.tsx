import React from "react";
import { FaGithub, FaCoffee } from "react-icons/fa";

export default function Socials() {
  return (
    <div className="flex items-center gap-4 justify-center py-4">
      <a
        href="https://github.com/Josuzin"
        target="_blank"
        rel="noopener noreferrer"
        className="social-link bg-gray-100 hover:bg-gray-200 transition-colors duration-300 ease-in-out p-2 rounded-full"
      >
        <FaGithub className="text-gray-600 hover:text-gray-800 transition-colors duration-300 ease-in-out" />
      </a>
      <a
        href="https://www.buymeacoffee.com/Josuzin"
        target="_blank"
        rel="noopener noreferrer"
        className="social-link bg-yellow-100 hover:bg-yellow-200 transition-colors duration-300 ease-in-out p-2 rounded-full"
      >
        <FaCoffee className="text-yellow-600 hover:text-yellow-800 transition-colors duration-300 ease-in-out" />
        {/* <span className="ml-2 text-yellow-600 hover:text-yellow-800 transition-colors duration-300 ease-in-out">Buy me a Coffee</span> */}
      </a>
    </div>
  );
}
