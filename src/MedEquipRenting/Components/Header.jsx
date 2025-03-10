import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  let dropdownTimeout;

  const handleMouseEnter = () => {
    clearTimeout(dropdownTimeout);
    setIsAboutDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeout = setTimeout(() => {
      setIsAboutDropdownOpen(false);
    }, 200); 
  };

  return (
    <div className="relative">
      <nav className="fixed w-full bg-blue-600 text-white py-4 px-6 shadow-lg z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">MediShare</Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-6 ml-140">
            <Link to="/" className="hover:text-gray-200">Accueil</Link>

            {/* About with Dropdown */}
            <div
              className="relative group"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="hover:text-gray-200 flex items-center">
                À propos
              </button>
              {isAboutDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white text-black shadow-lg rounded-md py-2">
                  <a href="#browse" className="block px-4 py-2 hover:bg-gray-200">Parcourir l'équipement</a>
                  <a href="#how-it-works" className="block px-4 py-2 hover:bg-gray-200">Comment ça marche</a>
                  <a href="#testimonials" className="block px-4 py-2 hover:bg-gray-200">Témoignages</a>
                  <a href="#vision" className="block px-4 py-2 hover:bg-gray-200">Notre vision pour l'avenir</a>
                  <a href="#benefits" className="block px-4 py-2 hover:bg-gray-200">Avantages de notre plateforme</a>
                </div>
              )}
            </div>

            <Link to="/rent-equipment" className="hover:text-gray-200">Louer un équipement</Link>
            <Link to="/contact" className="hover:text-gray-200">Contact</Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/profile" className="hover:text-gray-200">
              <FaUser className="text-xl" />
            </Link>
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative hover:text-gray-200"
            >
              <FaShoppingCart className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className="lg:hidden text-2xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsMenuOpen(false)}></div>
          <div className="fixed top-0 right-0 w-64 h-full bg-[#2b80ff] text-white p-6 transform transition-transform duration-300 ease-in-out">
            <div className="flex justify-end">
              <button className="text-2xl" onClick={() => setIsMenuOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="mt-6 flex flex-col space-y-4">
              <Link to="/" className="hover:text-gray-200" onClick={() => setIsMenuOpen(false)}>Accueil</Link>
              
              {/* About Dropdown for Mobile */}
              <div className="relative">
                <button
                  className="hover:text-gray-200 w-full text-left"
                  onClick={() => setIsAboutDropdownOpen(!isAboutDropdownOpen)}
                >
                  À propos
                </button>
                {isAboutDropdownOpen && (
                  <div className="mt-2 bg-white text-black shadow-lg rounded-md">
                    <a href="#browse" className="block px-4 py-2 hover:bg-gray-200">Parcourir l'équipement</a>
                    <a href="#how-it-works" className="block px-4 py-2 hover:bg-gray-200">Comment ça marche</a>
                    <a href="#testimonials" className="block px-4 py-2 hover:bg-gray-200">Témoignages</a>
                    <a href="#vision" className="block px-4 py-2 hover:bg-gray-200">Notre vision pour l'avenir</a>
                    <a href="#benefits" className="block px-4 py-2 hover:bg-gray-200">Avantages de notre plateforme</a>
                  </div>
                )}
              </div>

              <Link to="/rent-equipment" className="hover:text-gray-200" onClick={() => setIsMenuOpen(false)}>Louer un équipement</Link>
              <Link to="/contact" className="hover:text-gray-200" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">Panier</h2>
            <p>Votre panier est actuellement vide.</p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="mt-4 bg-[#2b80ff] text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
