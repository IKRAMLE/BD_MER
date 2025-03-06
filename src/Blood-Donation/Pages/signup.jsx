import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import logo from "/logo2.png";
import signupImg from "/login.jpg";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="flex flex-col md:flex-row rounded-xl overflow-hidden shadow-lg max-w-4xl w-full bg-white">
        {/* Sign Up Image (Left Side) */}
        <div className="md:w-1/2 w-full relative hidden md:block">
          <img
            src={signupImg}
            alt="Rejoignez la communauté des donneurs"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Sign Up Form (Right Side) */}
        <div className="md:w-1/2 w-full p-8">
          {/* Logo */}
          <div className="flex items-center mb-6 -ml-3">
            <Link to="/">
              <img src={logo} alt="Logo LifeDrops" className="h-10" />
            </Link>
          </div>

          <h1 className="text-2xl font-semibold mb-2 text-gray-800">Créez un compte</h1>
          <p className="text-sm text-gray-600 mb-6">Rejoignez-nous en quelques étapes :</p>

          <input
            type="text"
            placeholder="Nom complet"
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="E-mail"
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={togglePassword}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </span>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmer le mot de passe"
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={toggleConfirmPassword}
            >
              {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </span>
          </div>

          <button className="w-full bg-red-600 text-white py-3 rounded-md mt-4 hover:bg-red-700 transition">
            S'inscrire
          </button>

          <div className="flex justify-center text-xs text-gray-500 mt-4">
            <span>Vous avez déjà un compte ?</span>
            <Link to="/login" className="text-blue-600 ml-1 hover:underline">
              Connectez-vous
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
