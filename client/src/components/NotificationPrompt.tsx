import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationPrompt() {
  const { permissionGranted, requestPermission, isSupported } = useNotifications();
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà été sollicité
    const hasBeenPrompted = localStorage.getItem("notification-prompted");
    
    // Afficher le prompt après 3 secondes si les conditions sont remplies
    const timer = setTimeout(() => {
      if (isSupported && !permissionGranted && !hasBeenPrompted && !dismissed) {
        setVisible(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isSupported, permissionGranted, dismissed]);

  const handleEnable = async () => {
    const granted = await requestPermission();
    localStorage.setItem("notification-prompted", "true");
    if (granted) {
      setVisible(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem("notification-prompted", "true");
    setDismissed(true);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-in slide-in-from-top">
      <div className="bg-gradient-to-r from-[#FFD60A] to-[#FFA500] rounded-2xl p-4 shadow-2xl border-2 border-[#FFD60A]/50">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-black/20 rounded-full flex items-center justify-center">
            <Bell className="w-5 h-5 text-black" />
          </div>
          <div className="flex-1">
            <h3 className="text-black font-black text-sm mb-1">
              Activez les notifications
            </h3>
            <p className="text-black/80 text-xs leading-relaxed">
              Recevez des rappels pour vos tâches Protocole et les échéances de vos projets
            </p>
            <div className="flex gap-2 mt-3">
              <Button
                onClick={handleEnable}
                size="sm"
                className="bg-black text-[#FFD60A] hover:bg-black/90 font-bold text-xs"
              >
                ACTIVER
              </Button>
              <Button
                onClick={handleDismiss}
                size="sm"
                variant="ghost"
                className="text-black hover:bg-black/10 text-xs"
              >
                Plus tard
              </Button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-black/60 hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
