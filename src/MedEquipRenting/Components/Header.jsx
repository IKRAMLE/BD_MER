import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { User, ShoppingCart, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const dropdownTimeout = useRef(null);

  // Handle scrolling effect on navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle dropdown hover behavior
  const handleMouseEnter = () => {
    clearTimeout(dropdownTimeout.current);
    setIsAboutDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setIsAboutDropdownOpen(false);
    }, 200);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <span className={`font-medium text-xl ${isScrolled ? "text-gray-900" : "text-gray-800"}`}>
              Medi<span className="text-blue-500">Share</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 ml-[130px]">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Accueil
            </Link>

            {/* About Dropdown */}
            <div className="relative group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <button className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center">
                À propos
              </button>
              {isAboutDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white text-gray-800 shadow-lg rounded-md py-2 border border-gray-100">
                  <a href="#browse" className="block px-4 py-2 hover:bg-gray-100 transition-colors">
                    Parcourir l'équipement
                  </a>
                  <a href="#how-it-works" className="block px-4 py-2 hover:bg-gray-100 transition-colors">
                    Comment ça marche
                  </a>
                  <a href="#testimonials" className="block px-4 py-2 hover:bg-gray-100 transition-colors">
                    Témoignages
                  </a>
                  <a href="#vision" className="block px-4 py-2 hover:bg-gray-100 transition-colors">
                    Notre vision pour l'avenir
                  </a>
                  <a href="#benefits" className="block px-4 py-2 hover:bg-gray-100 transition-colors">
                    Avantages de notre plateforme
                  </a>
                </div>
              )}
            </div>

            <Link to="/rent-equipment" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Louer un équipement
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <Link to="/login2" className="rounded-full p-2 text-gray-700 hover:bg-gray-50 transition-colors">
              <User size={20} />
            </Link>

            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative rounded-full p-2 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button className="lg:hidden rounded-md p-2 text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsMenuOpen(false)}></div>
          <div className="fixed top-0 right-0 w-64 h-full bg-blue-600 text-white p-6">
            <div className="flex justify-end">
              <button className="p-2 hover:bg-blue-400 rounded-full transition-colors" onClick={() => setIsMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="mt-6 flex flex-col space-y-4">
              <Link to="/" className="py-2 hover:text-blue-100 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Accueil
              </Link>
              <Link to="/rent-equipment" className="py-2 hover:text-blue-100 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Louer un équipement
              </Link>
              <Link to="/contact" className="py-2 hover:text-blue-100 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
          <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg w-96 max-w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Panier</h2>
            <p>Votre panier est actuellement vide.</p>
            <button onClick={() => setIsCartOpen(false)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
              Fermer
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
