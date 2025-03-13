import React from "react";

const Card = ({ image, title, description }) => {
  return (
    <div className="bg-white shadow-2xl rounded-lg p-6 text-center">
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-600 my-2">{description}</p>
      <button className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition">
        SAVOIR PLUS
      </button>
    </div>
  );
};

const InfoCards = () => {
  const cards = [
    {
      image: "/Blood Donation.png",
      title: "Donner du Sang",
      description:
        "Le moyen le plus direct de faire une différence est de donner du sang. Chaque don a le potentiel de sauver plusieurs vies.",
    },
    {
      image: "/Volunteer.png",
      title: "Équipe de Bénévoles",
      description:
        "Rejoignez notre équipe de bénévoles pour aider lors des événements, des actions de sensibilisation et des tâches administratives. Votre temps et vos compétences peuvent avoir un grand impact sur notre mission.",
    },
    {
      image: "/sensibiliser.png",
      title: "Sensibiliser",
      description:
        "Partagez des informations sur l'importance du don de sang avec vos amis et votre famille. Utilisez les réseaux sociaux pour sensibiliser et encourager les autres à donner.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-10">
      {cards.map((card, index) => (
        <Card key={index} {...card} />
      ))}
    </div>
  );
};

export default InfoCards;
