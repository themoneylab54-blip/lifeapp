import { useState } from "react";
import { useLocation } from "wouter";
import { useFirebaseAuth } from "@/contexts/FirebaseAuthContext";
import { useGamefication } from "@/hooks/useGamefication";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, User, LogOut, ArrowLeft, Moon, Sun, Edit2, Check, X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";
import { updateProfile } from "firebase/auth";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { currentUser, logout } = useFirebaseAuth();
  const { profile, loading } = useGamefication();
  const { theme, toggleTheme } = useTheme();
  const [loggingOut, setLoggingOut] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [firstName, setFirstName] = useState(currentUser?.displayName?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(currentUser?.displayName?.split(" ").slice(1).join(" ") || "");
  const [saving, setSaving] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      toast.success("Déconnexion réussie");
      setLocation("/login");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    } finally {
      setLoggingOut(false);
    }
  };

  const handleSaveName = async () => {
    if (!currentUser || !firstName.trim()) {
      toast.error("Le prénom est requis");
      return;
    }

    try {
      setSaving(true);
      const newDisplayName = `${firstName.trim()} ${lastName.trim()}`.trim();
      await updateProfile(currentUser, {
        displayName: newDisplayName,
      });
      toast.success("Nom mis à jour avec succès");
      setEditingName(false);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du nom");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFirstName(currentUser?.displayName?.split(" ")[0] || "");
    setLastName(currentUser?.displayName?.split(" ").slice(1).join(" ") || "");
    setEditingName(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation("/")}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Profil</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-6 space-y-6 max-w-2xl mx-auto">
        {/* User Info Card */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              {!editingName ? (
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{currentUser?.displayName || "Utilisateur"}</h2>
                  <button
                    onClick={() => setEditingName(true)}
                    className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Prénom"
                      className="text-sm"
                      disabled={saving}
                    />
                    <Input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Nom"
                      className="text-sm"
                      disabled={saving}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSaveName}
                      disabled={saving}
                      className="gap-1"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Enregistrer
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className="gap-1"
                    >
                      <X className="w-4 h-4" />
                      Annuler
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">{profile.level}</div>
                <div className="text-xs text-muted-foreground mt-1">Niveau</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">{profile.xp}</div>
                <div className="text-xs text-muted-foreground mt-1">XP Total</div>
              </div>
              <div>
                <div className="text-lg font-bold text-primary">{profile.rank}</div>
                <div className="text-xs text-muted-foreground mt-1">Rang</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Settings Card */}
        <Card className="p-6 space-y-4">
          <h3 className="font-bold text-lg">Paramètres</h3>
          
          {/* Theme Toggle */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <div className="font-medium">Thème</div>
                <div className="text-sm text-muted-foreground">
                  {theme === "dark" ? "Mode sombre" : "Mode clair"}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="gap-2"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4" />
                  Clair
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" />
                  Sombre
                </>
              )}
            </Button>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium">Notifications</div>
              <div className="text-sm text-muted-foreground">
                Gérer les notifications push
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/settings")}
            >
              Configurer
            </Button>
          </div>
        </Card>

        {/* Account Info Card */}
        <Card className="p-6 space-y-3">
          <h3 className="font-bold text-lg">Informations du compte</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Méthode de connexion</span>
              <span className="font-medium">
                {currentUser?.providerData[0]?.providerId === "google.com" ? "Google" : "Email"}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Compte créé le</span>
              <span className="font-medium">
                {currentUser?.metadata.creationTime
                  ? new Date(currentUser.metadata.creationTime).toLocaleDateString("fr-FR")
                  : "N/A"}
              </span>
            </div>
          </div>
        </Card>

        {/* Logout Button */}
        <Button
          variant="destructive"
          className="w-full gap-2 py-6"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <LogOut className="w-5 h-5" />
              Se déconnecter
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
