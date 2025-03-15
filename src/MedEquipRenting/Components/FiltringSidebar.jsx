import React, { useState } from 'react';

function FilteringSidebar() {
  const [priceRange, setPriceRange] = useState(500);
  
  return (
    <div className="p-6 rounded-lg shadow bg-[#93c3f2] mt-30 ml-5 w-80">
      <h4 className="text-lg font-medium mb-4 text-[#2c3e50]">Filtres</h4>
      
      <form>
        {/* Category Filter */}
        <div className="mb-4">
          <label htmlFor="category" className="block mb-2 text-sm text-[#7d8a96]">
            Catégorie
          </label>
          <select 
            id="category" 
            className="w-full border rounded p-2 focus:ring-2 bg-white border-[#e5e3e0] text-[#2c3e50] focus:outline-[#3498db]"
          >
            <option>Toutes les Catégories</option>
            <option>Aides à la Mobilité</option>
            <option>Équipement Respiratoire</option>
            <option>Lits d'Hôpital</option>
            <option>Sécurité Salle de Bain</option>
            <option>Lève-Personnes</option>
            <option>Aides à la Vie Quotidienne</option>
          </select>
        </div>
        
        {/* Price Range Filter */}
        <div className="mb-4">
          <label htmlFor="priceRange" className="block mb-2 text-sm text-[#7d8a96]">
            Fourchette de Prix
          </label>
          <input 
            type="range" 
            id="priceRange" 
            min="0" 
            max="500" 
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[#e5e3e0]"
          />
          <div className="flex justify-between text-xs mt-1 text-[#95a5a6]">
            <span>0 MAD</span>
            <span>{priceRange} MAD</span>
          </div>
        </div>
        
        {/* Rental Duration Filter */}
        <div className="mb-4">
          <label htmlFor="rentalDuration" className="block mb-2 text-sm text-[#7d8a96]">
            Durée de Location
          </label>
          <select 
            id="rentalDuration" 
            className="w-full border rounded p-2 focus:ring-2 bg-white border-[#e5e3e0] text-[#2c3e50] focus:outline-[#3498db]"
          >
            <option>Jour</option>
            <option>Semaine</option>
            <option>Mois</option>
            <option>Long Terme</option>
          </select>
        </div>
        
        {/* Condition Filter */}
        <div className="mb-4">
          <label htmlFor="condition" className="block mb-2 text-sm text-[#7d8a96]">
            État
          </label>
          <select 
            id="condition" 
            className="w-full border rounded p-2 focus:ring-2 bg-white border-[#e5e3e0] text-[#2c3e50] focus:outline-[#3498db]"
          >
            <option>Tous les États</option>
            <option>Neuf</option>
            <option>Comme Neuf</option>
            <option>Excellent</option>
            <option>Bon</option>
          </select>
        </div>
        
        {/* Sort By Filter */}
        <div className="mb-4">
          <label htmlFor="sortBy" className="block mb-2 text-sm text-[#7d8a96]">
            Trier Par
          </label>
          <select 
            id="sortBy" 
            className="w-full border rounded p-2 focus:ring-2 bg-white border-[#e5e3e0] text-[#2c3e50] focus:outline-[#3498db]"
          >
            <option>Prix: Croissant</option>
            <option>Prix: Décroissant</option>
            <option>A-Z</option>
            <option>Z-A</option>
          </select>
        </div>
        
        {/* Apply Button */}
        <button 
          type="submit" 
          className="w-full py-2 px-4 rounded transition duration-150 ease-in-out text-white bg-[#3498db] hover:bg-[#2980b9]"
        >
          Appliquer les Filtres
        </button>
      </form>
    </div>
  );
}

export default FilteringSidebar;