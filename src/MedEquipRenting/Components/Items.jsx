import React, { useState, useEffect, useRef } from 'react';
import EquipmentCard from './EquipmentCard';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const equipmentCategories = [
  "Tous", 
  "Mobilité",
  "Respiratoire",
  "Soins à domicile",
  "Surveillance", 
  "Vie quotidienne", 
  "Pédiatrique", 
];

const featuredEquipment = [
  {
    id: 1,
    name: "Fauteuil roulant - Premium pliable",
    image: "/wheelchair.png",
    price: 300,
    timeUnit: "semaine", 
    location: "Casablanca",
    category: "Mobilité", 
    rating: 4.9,
    reviewCount: 23,
    isNew: true,
  },
  {
    id: 2,
    name: "Concentrateur d'oxygène - 5L",
    image: "/wheelchair.png",
    price: 450,
    timeUnit: "semaine",  
    location: "Rabat",
    category: "Respiratoire", 
    rating: 4.7,
    reviewCount: 18,
    isFeatured: true,
  },
  {
    id: 3,
    name: "Lit d'hôpital - Électrique réglable", 
    image: "/wheelchair.png",
    price: 800,
    timeUnit: "mois", 
    location: "Marrakech",
    category: "Soins à domicile", 
    rating: 4.8,
    reviewCount: 15,
  },
  {
    id: 4,
    name: "Moniteur de pression artérielle - Numérique", 
    image: "/wheelchair.png",
    price: 120,
    timeUnit: "semaine", 
    location: "Tanger",
    category: "Surveillance", 
    rating: 4.5,
    reviewCount: 32,
  },
  {
    id: 5,
    name: "Kit Nébuliseur pédiatrique", 
    image: "/wheelchair.png",
    price: 200,
    timeUnit: "semaine", 
    location: "Agadir",
    category: "Pédiatrique", 
    rating: 4.6,
    reviewCount: 14,
    isNew: true,
  },
  {
    id: 6,
    name: "Déambulateur avec siège - Réglable", 
    image: "/wheelchair.png",
    price: 150,
    timeUnit: "semaine", 
    location: "Fès",
    category: "Mobilité", 
    rating: 4.7,
    reviewCount: 21,
  },
  {
    id: 7,
    name: "Chaise de douche - Antidérapante", 
    image: "/wheelchair.png",
    price: 100,
    timeUnit: "semaine", 
    location: "Casablanca",
    category: "Vie quotidienne", 
    rating: 4.4,
    reviewCount: 19,
  },
  {
    id: 8,
    name: "Machine CPAP avec humidificateur", 
    image: "/wheelchair.png",
    price: 500,
    timeUnit: "semaine", 
    location: "Rabat",
    category: "Respiratoire",
    rating: 4.9,
    reviewCount: 27,
    isFeatured: true,
  },
];

const Items = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [filteredItems, setFilteredItems] = useState(featuredEquipment);
  const [visibleItems, setVisibleItems] = useState(4);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (selectedCategory === "Tous") { 
      setFilteredItems(featuredEquipment);
    } else {
      setFilteredItems(
        featuredEquipment.filter((item) => item.category === selectedCategory)
      );
    }
  }, [selectedCategory]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleViewMore = () => {
    if (visibleItems === 4) {
      setVisibleItems(filteredItems.length);
    } else {
      setVisibleItems(4);
    }
  };

  const slideLeft = () => {
    const slider = document.getElementById('category-slider');
    if (slider) slider.scrollLeft = slider.scrollLeft - 200;
  };
  
  const slideRight = () => {
    const slider = document.getElementById('category-slider');
    if (slider) slider.scrollLeft = slider.scrollLeft + 200;
  };

  return (
    <section id="browse" ref={sectionRef} className="py-20">
      <div className="container-custom">
        <div className="text-center">
          <h2 className="section-heading">Explorer l'équipement disponible</h2> 
          <p className="section-subheading">
            Découvrez une large gamme d'équipements médicaux de haute qualité disponibles à la location 
            à travers le Maroc, tous soigneusement désinfectés et bien entretenus.
          </p>
        </div>

        {/* Category filter */}
        <div className="relative my-8">
          <button 
            onClick={slideLeft} 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 text-gray-700 md:-left-4"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div 
            id="category-slider" 
            className="flex overflow-x-auto scrollbar-none space-x-2 py-2 px-1 scroll-smooth relative"
          >
            {equipmentCategories.map((category) => (
              <button
                key={category}
                className={`flex-none px-4 py-2 rounded-full transition-all text-sm font-medium whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-[#108de4] text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          
          <button 
            onClick={slideRight} 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 text-gray-700 md:-right-4"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        {/* Filter and sort controls */}
        <div className="flex justify-between items-center mb-6 px-1">
          <p className="text-sm text-[#958a80]">
            Affichage de <span className="font-medium">{Math.min(visibleItems, filteredItems.length)}</span> sur <span className="font-medium">{filteredItems.length}</span> articles {/* Showing X of Y items */}
          </p>
          
          <button className="flex items-center text-sm font-medium text-gray-700 hover:text-[#0070cc]">
            <Filter size={16} className="mr-1" /> Filtrer & Trier 
          </button>
        </div>

        {/* Equipment grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.slice(0, visibleItems).map((item, index) => (
            <div 
              key={item.id}
              className={`transition-all duration-700 delay-${index * 100} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
            >
              <EquipmentCard {...item} />
            </div>
          ))}
        </div>
        
        {filteredItems.length > 0 ? (
          <div className="mt-10 text-center">
            <button 
              className="button-secondary"
              onClick={handleViewMore}
            >
              {visibleItems === 4 ? 'Voir plus' : 'Voir moins'} 
            </button>
          </div>
        ) : (
          <div className="mt-10 text-center">
            <p className="text-[#a39991]">Aucun article trouvé dans cette catégorie.</p> 
          </div>
        )}
      </div>
    </section>
  );
};

export default Items;
