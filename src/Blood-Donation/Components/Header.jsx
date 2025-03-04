import React, { useState, useEffect, useRef } from "react";
import {
  FaExclamationTriangle,
  FaSearch,
  FaUser,
  FaMoon,
  FaSun,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import logo from "/logo2.png";
import { Link } from "react-router-dom";

const Header = () => {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [urgentDropdownOpen, setUrgentDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // UseRef to handle dropdown timeout properly
  const dropdownTimeoutRef = useRef(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between shadow-xl px-6 py-4 bg-white dark:bg-gray-900 shadow-md transition-all duration-300">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/">
          <img src={logo} alt="Logo LifeDrops" className="h-10" />
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-600 dark:text-gray-300 text-xl">
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Navigation Links */}
      <ul
        className={`absolute md:static top-16 left-0 w-full md:w-auto bg-white dark:bg-gray-900 md:flex space-x-6 text-gray-800 dark:text-gray-200 font-medium transition-all duration-300 ${menuOpen ? "block" : "hidden"} md:flex-row md:items-center md:space-x-6 -mr-30 md:ml-10 px-6 md:px-0`}
      >
        <li>
          <Link to="/home" className="block py-2 md:py-0 hover:text-red-500">Accueil</Link>
        </li>
        <li
          className="relative"
          onMouseEnter={() => {
            if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
            setDropdownOpen(true);
          }}
          onMouseLeave={() => {
            dropdownTimeoutRef.current = setTimeout(() => setDropdownOpen(false), 300);
          }}
        >
          <Link to="/donate-blood" className="block py-2 md:py-0 hover:text-red-500">À propos</Link>
          {dropdownOpen && (
            <ul className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 border dark:border-gray-600 shadow-lg rounded-md overflow-hidden">
              {["Éligibilité", "Trouver un centre de don", "Processus de don", "FAQ", "Trouver une banque de sang", "Pourquoi donner ?"].map((text, index) => (
                <li key={index}>
                  <Link to={`/donate-blood/${text.toLowerCase().replace(/ /g, '-')}`} className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
        <li>
          <Link to="/request" className="block py-2 md:py-0 hover:text-red-500">Requests</Link>
        </li>
        <li>
          <Link to="/contact" className="block py-2 md:py-0 hover:text-red-500">Contact</Link>
        </li>
      </ul>

      {/* Right Section */}
      <div className="hidden md:flex items-center space-x-4">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center border border-gray-300 dark:border-gray-600 rounded-full px-3 py-1 shadow-sm">
          <input type="text" className="bg-transparent outline-none px-2 py-1 text-gray-800 dark:text-gray-200" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <button type="submit" className="text-gray-600 dark:text-gray-300">
            <FaSearch />
          </button>
        </form>

        {/* Urgent Requests Button */}
        <div className="relative" onMouseEnter={() => setUrgentDropdownOpen(true)} onMouseLeave={() => setUrgentDropdownOpen(false)}>
          <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-full hover:bg-red-600 shadow-md">
            <FaExclamationTriangle className="mr-2" /> Demandes urgentes
          </button>
          {urgentDropdownOpen && (
            <div className="absolute mt-2 w-50 bg-white dark:bg-gray-800 border dark:border-gray-600 shadow-lg rounded-md p-4 text-center text-gray-600 dark:text-gray-300">
              Aucune demande urgente
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button onClick={() => setDarkMode(!darkMode)} className="focus:outline-none">
          {darkMode ? <FaSun className="text-yellow-400 text-lg" /> : <FaMoon className="text-gray-600 dark:text-gray-300 text-lg" />}
        </button>

        {/* Login Link */}
        <Link to="/login">
          <FaUser className="text-gray-600 dark:text-gray-300 cursor-pointer text-lg" />
        </Link>
      </div>
    </nav>
  );
};

export default Header;
