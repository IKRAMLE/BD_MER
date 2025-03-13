
import React from "react";
import { FaTwitter, FaFacebook, FaWhatsapp, FaInstagram } from "react-icons/fa";
import logo from "/logo2.png"; 

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="flex flex-col items-center md:items-start">
            <div className="mb-2 -mt-24 -ml-3">
              <img src={logo} alt="LifeDrops Logo" className="h-10" />
            </div>
            <p className="text-center md:text-left text-lg">
              Connecter les gens qui ont besoin avec ceux qui peuvent faire un don de sang pour sauver des vies.
            </p>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mt-8 md:mt-0">
            <div>
              <h3 className="text-xl font-semibold mb-4">Donner du Sang</h3>
              <ul>
                <li><a href="/how-to-donate" className="text-gray-400 hover:text-red-600">Comment Donner</a></li>
                <li><a href="/donor-registration" className="text-gray-400 hover:text-red-600">Inscription des Donneurs</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">À Propos</h3>
              <ul>
                <li><a href="/about-us" className="text-gray-400 hover:text-red-600">À Propos de Nous</a></li>
                <li><a href="/our-mission" className="text-gray-400 hover:text-red-600">Notre Mission</a></li>
                <li><a href="/contact-us" className="text-gray-400 hover:text-red-600">Contactez-Nous</a></li>
                <li><a href="/donor-stories" className="text-gray-400 hover:text-red-600">Histoires des Donneurs</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Ressources</h3>
              <ul>
                <li><a href="/faq" className="text-gray-400 hover:text-red-600">FAQ</a></li>
                <li><a href="/blood-types" className="text-gray-400 hover:text-red-600">Comprendre les Groupes Sanguins</a></li>
                <li><a href="/news" className="text-gray-400 hover:text-red-600">Actualités et Mises à Jour</a></li>
                <li><a href="/health-tips" className="text-gray-400 hover:text-red-600">Conseils de Santé pour les Donneurs</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Légal</h3>
              <ul>
                <li><a href="/terms-of-service" className="text-gray-400 hover:text-red-600">Conditions d'Utilisation</a></li>
                <li><a href="/privacy-policy" className="text-gray-400 hover:text-red-600">Politique de Confidentialité</a></li>
                <li><a href="/cookie-policy" className="text-gray-400 hover:text-red-600">Politique de Cookies</a></li>
                <li><a href="/licenses" className="text-gray-400 hover:text-red-600">Licences</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-700 pt-6 mt-6">
          <p className="text-gray-400 text-sm text-center md:text-left">© 2025 LifeDrops. Tous droits réservés.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="https://twitter.com/lifedrops" className="text-gray-400 hover:text-red-600" aria-label="LifeDrops Twitter">
              <FaTwitter className="h-6 w-6" />
            </a>
            <a href="https://facebook.com/lifedrops" className="text-gray-400 hover:text-red-600" aria-label="LifeDrops Facebook">
              <FaFacebook className="h-6 w-6" />
            </a>
            <a href="https://instagram.com/lifedrops" className="text-gray-400 hover:text-red-600" aria-label="LifeDrops Instagram">
              <FaInstagram className="h-6 w-6" />
            </a>
            <a href="https://wa.me/lifedrops" className="text-gray-400 hover:text-red-600" aria-label="LifeDrops WhatsApp">
              <FaWhatsapp className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
