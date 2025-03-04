import React from "react";
import Header from "../Components/Header";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  BellRing,
  MapPin,
  DropletIcon,
} from "lucide-react";
import InfoCards from "../Components/InfoCards";
import Footer from "../Components/Footer";

function BloodDonation() {
  const donationSteps = [
    {
      number: 1,
      title: "Inscription",
      description:
        "Connectez-vous, présentez une pièce d'identité et remplissez un questionnaire de santé confidentiel.",
    },
    {
      number: 2,
      title: "Mini-Examen Médical",
      description:
        "Vérification rapide de la température, de la tension artérielle, du pouls et des niveaux d'hémoglobine.",
    },
    {
      number: 3,
      title: "Don de Sang",
      description:
        "Le don proprement dit prend environ 10 minutes. Vous serez confortablement installé pendant le prélèvement d'une pinte de sang.",
    },
    {
      number: 4,
      title: "Collation",
      description:
        "Profitez de collations et de boissons dans l'espace de repos. Reposez-vous 10-15 minutes avant de partir.",
    },
  ];
  const leftColumnItems = [
    "Inspirer les gens à donner du sang",
    "Donneurs de sang spécialisés et supervision clinique",
    "Produire un approvisionnement en sang sûr et prêt",
  ];

  const rightColumnItems = [
    "Augmenter la communication avec nos membres",
    "Évaluation, diagnostic et traitement de haute qualité",
    "Offrir des services spécialisés aux patients",
  ];

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
              Pourquoi donner du sang ?
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

      {/* Donation Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Le Processus de Don
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Ce à quoi vous pouvez vous attendre lors d'un don de sang
            </p>
          </div>

          <div className="relative">
            {donationSteps.map((step, index) => (
              <div
                key={step.number}
                className="flex items-center mb-6 relative"
              >
                {index < donationSteps.length - 1 && (
                  <div className="absolute left-[30px] top-[30px] bottom-0 w-1 bg-red-500 z-0"></div>
                )}

                <div className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-2xl z-10 relative">
                  {step.number}
                </div>

                <div className="ml-6 pl-4 z-10">
                  <h3 className="text-xl font-semibold text-red-500">
                    {step.title}
                  </h3>
                  <p className="text-gray-700">{step.description}</p>
                </div>
              </div>
            ))}
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

      {/* Who We Are Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Qui Sommes-Nous ?
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Une plateforme qui connecte les donneurs de sang avec ceux qui en
              ont besoin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Image Section */}
            <div className="relative">
              <img
                src="/about.jpg"
                alt="Blood Donation Platform"
                className="rounded-lg shadow-lg w-full h-110 object-cover"
              />
              <div className="absolute inset-0 opacity-20 rounded-lg"></div>
            </div>

            {/* Description Section */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Notre Service de Demandes de Don de Sang
              </h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <BellRing className="h-8 w-8 text-red-500 mr-4 mt-1" />
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                      Notifications en Temps Réel
                    </h4>
                    <p className="text-gray-600">
                      Lorsqu'un besoin urgent de sang est signalé, tous les
                      utilisateurs potentiellement compatibles reçoivent
                      immédiatement une notification.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-8 w-8 text-red-500 mr-4 mt-1" />
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                      Localisation Précise
                    </h4>
                    <p className="text-gray-600">
                      Notre plateforme permet de localiser rapidement les
                      donneurs de sang ayant le bon groupe sanguin et se
                      trouvant à proximité du lieu de besoin.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="h-8 w-8 text-red-500 mr-4 mt-1" />
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                      Processus Simple
                    </h4>
                    <p className="text-gray-600">
                      Publiez une demande, et notre système identifie et
                      contacte les donneurs potentiels correspondant aux
                      critères recherchés.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button className="px-6 py-3 ml-5 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300">
                  Découvrir Notre Service
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ways to help Section */}

      <section className="bg-blue-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 gap-4 ">
          <div className="text-left mb-12">
            <h2 className="text-4xl font-bold mb-4">Moyens d'Aider</h2>
            <p className="text-xl">Rejoignez-nous pour sauver des vies !</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 grid-1fr">
            <div className="space-y-6">
              {leftColumnItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <DropletIcon className="h-6 w-6 text-white" />
                  <span className="text-lg">{item}</span>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              {rightColumnItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <DropletIcon className="h-6 w-6 text-white" />
                  <span className="text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
<section className="py-16 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-gray-900">Questions fréquemment posées</h2>
      <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
        Questions courantes sur le don de sang
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-red-600 mb-2">À quelle fréquence puis-je donner mon sang ?</h3>
        <p className="text-gray-700">
          Vous pouvez donner du sang entier tous les 56 jours (8 semaines). Si vous donnez des plaquettes, vous pouvez donner tous les 7 jours, jusqu'à 24 fois par an.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-red-600 mb-2">Est-ce que ça fait mal de donner son sang ?</h3>
        <p className="text-gray-700">
          La plupart des gens ressentent juste une légère piqûre lorsque l'aiguille est insérée. Le processus de don lui-même est relativement indolore.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-red-600 mb-2">Combien de temps dure le processus de don ?</h3>
        <p className="text-gray-700">
          Le processus complet prend environ 30 à 45 minutes, avec le prélèvement de sang qui dure environ 10 minutes.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-red-600 mb-2">Que dois-je faire avant de donner mon sang ?</h3>
        <p className="text-gray-700">
          Mangez un repas équilibré, buvez beaucoup de liquides et dormez suffisamment avant de donner votre sang. Évitez les aliments gras avant le don.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-red-600 mb-2">Que devient mon sang après le don ?</h3>
        <p className="text-gray-700">
          Votre sang est testé, traité et séparé en composants (globules rouges, plasma, plaquettes) qui peuvent aider plusieurs patients.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-red-600 mb-2">Puis-je donner mon sang si je prends des médicaments ?</h3>
        <p className="text-gray-700">
          De nombreux médicaments sont acceptables. Apportez une liste de vos médicaments au centre de don, et le personnel déterminera votre éligibilité.
        </p>
      </div>
    </div>
  </div>
</section>
<Footer />
    </>
  );
}

export default BloodDonation;
