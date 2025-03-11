import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Simulate API call (replace with actual API logic)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Example: Successful login simulation
      navigate("/dashboard"); // Redirect to the dashboard or another page
    } catch (err) {
      setError("La connexion a échoué. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#f0f7ff]">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-xl rounded-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#084b88]">
                Bienvenue
              </h1>
              <p className="mt-2 text-[#0070cc]">
                Connectez-vous à votre compte MediShare Maroc
              </p>
            </div>
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#0058a6] mb-1"
                >
                  Adresse e-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#37aaf8]" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-[#bae0fd] rounded-lg focus:ring-2 focus:ring-[#108de4] focus:border-[#108de4] transition-colors text-[#084b88]"
                    placeholder="Votre adresse e-mail"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#0058a6] mb-1"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#37aaf8]" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-[#bae0fd] rounded-lg focus:ring-2 focus:ring-[#108de4] focus:border-[#108de4] transition-colors text-[#084b88]"
                    placeholder="Votre mot de passe"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-[#37aaf8]" />
                    ) : (
                      <Eye className="h-5 w-5 text-[#37aaf8]" />
                    )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#0070cc] hover:bg-[#0058a6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#108de4]"
              >
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-[#0070cc]">
                Vous n'avez pas de compte ?{" "}
                <Link
                  to="/Signup2"
                  className="font-medium text-[#0070cc] hover:text-[#108de4]"
                >
                  Créez-en un maintenant
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
