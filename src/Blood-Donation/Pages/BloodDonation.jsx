import React from "react";
import Header from "../Components/Header";
import { Clock, CheckCircle, AlertCircle, HelpCircle } from "lucide-react";
import InfoCards from "../Components/InfoCards";

function BloodDonation() {
  return (
    <>
      <Header />
      {/* Hero Section */}
      <section className="relative mt-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="mt-7">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Votre sang a le <br />
                pouvoir de peindre un sourire <br />
                sur le visage de quelqu'un d'autre
              </h1>

              <p className="text-gray-600 mb-8 max-w-lg">
                Le don de sang est une contribution importante que les individus
                peuvent apporter pour sauver la vie des autres. C'est un service
                désintéressé qui aide les personnes qui ont besoin de
                transfusions sanguines en raison d'une maladie, d'une
                intervention chirurgicale, d'un traitement contre le cancer ou
                de blessures traumatiques.
              </p>

              <div className="flex space-x-4 mb-8">
                <button className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300">
                  Faire un don maintenant
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition duration-300">
                  En savoir plus
                </button>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="donating blood"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Donate Section */}
      <section className="py-16 bg-white -mt-15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Pourquoi donner du sang ?
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Votre don fait une réelle différence dans la vie des gens
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-red-50 p-6 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sauver des vies</h3>
              <p className="text-gray-600 text-justify">
                Un don peut sauver jusqu'à trois vies. Le sang est essentiel
                pour les opérations chirurgicales, les traitements contre le
                cancer, les maladies chroniques et les blessures traumatiques.
              </p>
            </div>

            <div className="bg-red-50 p-6 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <Clock className="h-12 w-12 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Processus rapide</h3>
              <p className="text-gray-600 text-justify">
                Le processus de don ne prend qu'environ 30 à 45 minutes du début
                à la fin, la prise de sang proprement dite prenant environ 10
                minutes.
              </p>
            </div>

            <div className="bg-red-50 p-6 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <HelpCircle className="h-12 w-12 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Bienfaits pour la santé
              </h3>
              <p className="text-gray-600 text-justify">
                Un don de sang régulier peut réduire le risque de crise
                cardiaque et de cancer. Il aide également à réduire les niveaux
                de fer dans le corps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Conditions d'éligibilité
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Vérifiez si vous êtes éligible pour donner votre sang
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8">
                <h3 className="text-2xl font-semibold mb-6 text-red-600">
                  Exigences de base
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>
                      Avoir au moins 17 ans (16 ans avec consentement parental
                      dans certains États)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Peser au moins 50 kg</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Être en bonne santé générale et se sentir bien</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>
                      Ne pas avoir donné de sang total au cours des 56 derniers
                      jours
                    </span>
                  </li>
                </ul>
              </div>
              <div className="p-8 bg-red-50">
                <h3 className="text-2xl font-semibold mb-6 text-red-600">
                  Délais d'attente temporaires
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <AlertCircle className="h-6 w-6 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>
                      Rhume, grippe ou fièvre : Attendez la disparition des
                      symptômes
                    </span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-6 w-6 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>
                      Grossesse : Attendez 6 semaines après l'accouchement
                    </span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-6 w-6 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>
                      Tatouages : Attendez entre 3 et 12 mois selon la
                      réglementation de votre pays
                    </span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-6 w-6 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>
                      Voyage dans une zone à risque de paludisme : Attendez 3
                      mois après votre retour
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="bg-gray-50 py-12 text-center -mt-12">
        <h5 className="text-blue-600 font-semibold uppercase text-sm">
          Impliquez-vous
        </h5>
        <h2 className="text-4xl font-bold text-gray-900 mt-2">
          Votre soutien est inestimable
        </h2>
        <div className="w-12 h-1 bg-red-500 mx-auto my-3"></div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Il existe de nombreuses façons de contribuer à notre mission de sauver
          des vies grâce au don de sang.
        </p>
      </section>

      <InfoCards />
    </>
  );
}

export default BloodDonation;
