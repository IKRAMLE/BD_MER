import React, { useState } from "react";

function FilteringSidebar({ onFilterChange }) {
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState(500);
  const [rentalDuration, setRentalDuration] = useState("");
  const [condition, setCondition] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Function to handle filter changes
  const handleFilterChange = () => {
    onFilterChange({
      category,
      priceRange,
      rentalDuration,
      condition,
      sortBy,
    });
  };

  return (
    <div className="p-6 rounded-lg shadow bg-[#6eb1f4] mt-30 ml-5 w-80 h-145">
      <h4 className="text-lg font-medium mb-4 text-[#2c3e50]">Filtres</h4>

      <form onSubmit={(e) => e.preventDefault()}>
        {/* Category Filter */}
        <div className="mb-4">
          <label htmlFor="category" className="block mb-2 text-sm text-[#7d8a96]">
            Catégorie
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded p-2 focus:ring-2 bg-white border-[#e5e3e0] text-[#2c3e50] focus:outline-[#3498db]"
          >
            <option value="">Toutes les Catégories</option>
            <option value="Aides à la Mobilité">Aides à la Mobilité</option>
            <option value="Équipement Respiratoire">Équipement Respiratoire</option>
            <option value="Lits d'Hôpital">Lits d'Hôpital</option>
            <option value="Sécurité Salle de Bain">Sécurité Salle de Bain</option>
            <option value="Lève-Personnes">Lève-Personnes</option>
            <option value="Aides à la Vie Quotidienne">Aides à la Vie Quotidienne</option>
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
            value={rentalDuration}
            onChange={(e) => setRentalDuration(e.target.value)}
            className="w-full border rounded p-2 focus:ring-2 bg-white border-[#e5e3e0] text-[#2c3e50] focus:outline-[#3498db]"
          >
            <option value="">Toutes</option>
            <option value="Jour">Jour</option>
            <option value="Semaine">Semaine</option>
            <option value="Mois">Mois</option>
            <option value="Long Terme">Long Terme</option>
          </select>
        </div>

        {/* Condition Filter */}
        <div className="mb-4">
          <label htmlFor="condition" className="block mb-2 text-sm text-[#7d8a96]">
            État
          </label>
          <select
            id="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full border rounded p-2 focus:ring-2 bg-white border-[#e5e3e0] text-[#2c3e50] focus:outline-[#3498db]"
          >
            <option value="">Tous les États</option>
            <option value="Neuf">Neuf</option>
            <option value="Comme Neuf">Comme Neuf</option>
            <option value="Excellent">Excellent</option>
            <option value="Bon">Bon</option>
          </select>
        </div>

        {/* Sort By Filter */}
        <div className="mb-4">
          <label htmlFor="sortBy" className="block mb-2 text-sm text-[#7d8a96]">
            Trier Par
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full border rounded p-2 focus:ring-2 bg-white border-[#e5e3e0] text-[#2c3e50] focus:outline-[#3498db]"
          >
            <option value="asc">Prix: Croissant</option>
            <option value="desc">Prix: Décroissant</option>
            <option value="az">A-Z</option>
            <option value="za">Z-A</option>
          </select>
        </div>

        {/* Apply Button */}
        <button
          type="button"
          onClick={handleFilterChange}
          className="w-full py-2 px-4 rounded transition duration-150 ease-in-out text-white bg-[#3498db] hover:bg-[#2980b9]"
        >
          Appliquer les Filtres
        </button>
      </form>
    </div>
  );
}

export default FilteringSidebar;
