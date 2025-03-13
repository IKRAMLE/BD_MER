import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import logo from '/logo2.png';
import loginImg from '/login.jpg';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePassword = () => setShowPassword(!showPassword);
  
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="flex flex-col md:flex-row rounded-xl overflow-hidden shadow-lg w-full max-w-4xl bg-white">
        {/* Login Form */}
        <div className="w-full md:w-1/2 p-6 md:p-10">
          {/* Logo */}
          <div className="flex items-center mb-6 -ml-3">
            <Link to="/">
              <img src={logo} alt="Logo LifeDrops" className="h-10" />
            </Link>
          </div>
          
          <h1 className="text-2xl font-semibold mb-2 text-gray-800">Connectez-vous à votre compte</h1>
          <p className="text-sm text-gray-600 mb-6">Bienvenue ! Sélectionnez une méthode pour vous connecter :</p>
          
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button className="flex-1 bg-white border border-gray-300 rounded-md py-2 px-4 flex items-center justify-center gap-2 hover:bg-gray-100">
              <img src="https://netcotech.com/wp-content/uploads/2023/07/gsuite_overhaul_400.jpg" alt="Google" className="w-5" />
              Google
            </button>
            <button className="flex-1 bg-white border border-gray-300 rounded-md py-2 px-4 flex items-center justify-center gap-2 hover:bg-gray-100">
              <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yG/r/pENh3y_2Pnw.png" alt="Facebook" className="w-5" />
              Facebook
            </button>
          </div>
          
          <div className="flex items-center justify-between my-4 text-xs text-gray-500">
            <span>ou continuez avec votre e-mail</span>
          </div>
          
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
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={togglePassword}
            >
              {showPassword ? (
                <FaEyeSlash size={18} />
              ) : (
                <FaEye size={18} />
              )}
            </span>
          </div>
          
          <button className="w-full bg-red-600 text-white py-3 rounded-md mt-4 hover:bg-red-700">
            Se connecter
          </button>
          
          <div className="flex justify-center text-xs text-gray-500 mt-4">
            <span>Vous n'avez pas de compte ?</span>
            <Link to="/signup" className="text-blue-600 ml-1">Créez-en un</Link>
          </div>
        </div>
        
        {/* Login Image */}
        <div className="hidden md:block w-1/2 relative object-center">
          <img 
            src={loginImg} 
            alt="Vous êtes un donneur, vous êtes un héros" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
