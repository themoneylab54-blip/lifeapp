import { useState } from "react";
import { useLocation } from "wouter";
import { useFirebaseAuth } from "@/contexts/FirebaseAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type AuthMode = "login" | "signup" | "reset";

export default function Login() {
  const [, setLocation] = useLocation();
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } = useFirebaseAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      setLocation("/");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la connexion avec Google");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmail(email, password);
      setLocation("/");
    } catch (error: any) {
      const errorCode = error.code;
      if (errorCode === "auth/user-not-found" || errorCode === "auth/wrong-password") {
        toast.error("Email ou mot de passe incorrect");
      } else if (errorCode === "auth/invalid-email") {
        toast.error("Format d'email invalide");
      } else {
        toast.error("Erreur lors de la connexion");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    try {
      setLoading(true);
      const displayName = `${firstName} ${lastName}`;
      await signUpWithEmail(email, password, displayName);
      toast.success("Compte créé avec succès !");
      setLocation("/");
    } catch (error: any) {
      const errorCode = error.code;
      if (errorCode === "auth/email-already-in-use") {
        toast.error("Cet email est déjà utilisé");
      } else if (errorCode === "auth/invalid-email") {
        toast.error("Format d'email invalide");
      } else if (errorCode === "auth/weak-password") {
        toast.error("Mot de passe trop faible");
      } else {
        toast.error("Erreur lors de l'inscription");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Veuillez entrer votre email");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      toast.success("Email de réinitialisation envoyé ! Vérifiez votre boîte de réception.");
      setMode("login");
      setEmail("");
    } catch (error: any) {
      const errorCode = error.code;
      if (errorCode === "auth/user-not-found") {
        toast.error("Aucun compte associé à cet email");
      } else if (errorCode === "auth/invalid-email") {
        toast.error("Format d'email invalide");
      } else {
        toast.error("Erreur lors de l'envoi de l'email");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-5">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black mb-2">
            Djalil OS <span className="text-[#FFD60A]">Pro</span>
          </h1>
          <p className="text-gray-500 text-sm">Votre système de productivité ultime</p>
        </div>

        {/* Mode Selector */}
        {mode !== "reset" && (
          <div className="flex gap-2 mb-6 bg-[#1a1a1a] p-1 rounded-xl">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                mode === "login"
                  ? "bg-[#FFD60A] text-black"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              CONNEXION
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                mode === "signup"
                  ? "bg-[#FFD60A] text-black"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              INSCRIPTION
            </button>
          </div>
        )}

        {/* Reset Password Mode */}
        {mode === "reset" && (
          <button
            onClick={() => {
              setMode("login");
              setEmail("");
            }}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Retour à la connexion</span>
          </button>
        )}

        {/* Google Sign In */}
        <Button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-[#FFD60A] text-black hover:bg-[#FFD60A]/90 font-bold py-6 mb-6"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <span className="text-xl mr-2">G</span>
              Connexion avec Google
            </>
          )}
        </Button>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black px-2 text-gray-500">Ou</span>
          </div>
        </div>

        {/* Email/Password Forms */}
        {mode === "login" && (
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="bg-[#1a1a1a] border-gray-800 text-white pl-11 py-6"
                disabled={loading}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                className="bg-[#1a1a1a] border-gray-800 text-white pl-11 py-6"
                disabled={loading}
              />
            </div>
            <button
              type="button"
              onClick={() => setMode("reset")}
              className="text-sm text-gray-500 hover:text-[#FFD60A] transition-colors"
            >
              Mot de passe oublié ?
            </button>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black hover:bg-gray-200 font-bold py-6"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "SE CONNECTER"}
            </Button>
          </form>
        )}

        {mode === "signup" && (
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Prénom"
                  className="bg-[#1a1a1a] border-gray-800 text-white pl-11 py-6"
                  disabled={loading}
                />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Nom"
                  className="bg-[#1a1a1a] border-gray-800 text-white pl-11 py-6"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="bg-[#1a1a1a] border-gray-800 text-white pl-11 py-6"
                disabled={loading}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe (min. 6 caractères)"
                className="bg-[#1a1a1a] border-gray-800 text-white pl-11 py-6"
                disabled={loading}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmer le mot de passe"
                className="bg-[#1a1a1a] border-gray-800 text-white pl-11 py-6"
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black hover:bg-gray-200 font-bold py-6"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "CRÉER UN COMPTE"}
            </Button>
          </form>
        )}

        {mode === "reset" && (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <p className="text-sm text-gray-400 mb-4">
              Entrez votre email pour recevoir un lien de réinitialisation de mot de passe.
            </p>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="bg-[#1a1a1a] border-gray-800 text-white pl-11 py-6"
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black hover:bg-gray-200 font-bold py-6"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "ENVOYER LE LIEN"}
            </Button>
          </form>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-8">
          Connectez-vous pour accéder à votre espace personnel
        </p>
      </div>
    </div>
  );
}
