import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Bell, BellOff, Clock, Target, CheckSquare } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const {
    settings,
    updateSettings,
    permissionGranted,
    requestPermission,
    isSupported,
    checkProtocolTasks,
    checkProjectDeadlines,
  } = useNotifications();

  const handleEnableNotifications = async () => {
    if (!permissionGranted) {
      const granted = await requestPermission();
      if (granted) {
        toast.success("Notifications activées !");
        updateSettings({ enabled: true });
      } else {
        toast.error("Permission refusée. Activez les notifications dans les paramètres du navigateur.");
      }
    } else {
      updateSettings({ enabled: !settings.enabled });
      toast.success(settings.enabled ? "Notifications désactivées" : "Notifications activées");
    }
  };

  const handleTestProtocolReminder = () => {
    checkProtocolTasks();
    toast.success("Notification de test envoyée !");
  };

  const handleTestProjectDeadline = () => {
    checkProjectDeadlines();
    toast.success("Vérification des échéances effectuée !");
  };

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-black text-white pb-32">
        <div className="py-6 px-5">
          <h1 className="text-2xl font-black mb-6">Paramètres</h1>
          <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800 text-center">
            <BellOff className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">
              Les notifications ne sont pas supportées par votre navigateur
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <div className="py-6">
        <h1 className="text-2xl font-black mb-6 px-5">Paramètres</h1>

        {/* Status Card */}
        <div className="bg-[#121212] rounded-2xl p-5 mx-5 mb-5 border border-gray-900">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  permissionGranted && settings.enabled
                    ? "bg-[#32D74B]/20"
                    : "bg-gray-800"
                }`}
              >
                {permissionGranted && settings.enabled ? (
                  <Bell className="w-5 h-5 text-[#32D74B]" />
                ) : (
                  <BellOff className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <div>
                <div className="font-bold">Notifications</div>
                <div className="text-xs text-gray-500">
                  {permissionGranted && settings.enabled
                    ? "Activées"
                    : permissionGranted
                    ? "Désactivées"
                    : "Non autorisées"}
                </div>
              </div>
            </div>
            <Switch
              checked={permissionGranted && settings.enabled}
              onCheckedChange={handleEnableNotifications}
            />
          </div>

          {!permissionGranted && (
            <Button
              onClick={requestPermission}
              className="w-full bg-[#FFD60A] text-black hover:bg-[#FFD60A]/90 font-bold"
            >
              AUTORISER LES NOTIFICATIONS
            </Button>
          )}
        </div>

        {/* Settings */}
        {permissionGranted && settings.enabled && (
          <>
            {/* Protocol Reminders */}
            <div className="bg-[#121212] rounded-2xl p-5 mx-5 mb-5 border border-gray-900">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <CheckSquare className="w-5 h-5 text-[#0A84FF]" />
                  <div>
                    <div className="font-bold text-sm">Rappels Protocole</div>
                    <div className="text-xs text-gray-500">
                      Tâches quotidiennes non complétées
                    </div>
                  </div>
                </div>
                <Switch
                  checked={settings.protocolReminders}
                  onCheckedChange={(checked) =>
                    updateSettings({ protocolReminders: checked })
                  }
                />
              </div>
              {settings.protocolReminders && (
                <Button
                  onClick={handleTestProtocolReminder}
                  size="sm"
                  variant="outline"
                  className="w-full text-xs"
                >
                  Tester maintenant
                </Button>
              )}
            </div>

            {/* Project Deadlines */}
            <div className="bg-[#121212] rounded-2xl p-5 mx-5 mb-5 border border-gray-900">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-[#FF453A]" />
                  <div>
                    <div className="font-bold text-sm">Échéances Projets</div>
                    <div className="text-xs text-gray-500">
                      Alertes à 7, 3 et 1 jour avant
                    </div>
                  </div>
                </div>
                <Switch
                  checked={settings.projectDeadlines}
                  onCheckedChange={(checked) =>
                    updateSettings({ projectDeadlines: checked })
                  }
                />
              </div>
              {settings.projectDeadlines && (
                <Button
                  onClick={handleTestProjectDeadline}
                  size="sm"
                  variant="outline"
                  className="w-full text-xs"
                >
                  Vérifier maintenant
                </Button>
              )}
            </div>

            {/* Reminder Time */}
            <div className="bg-[#121212] rounded-2xl p-5 mx-5 mb-5 border border-gray-900">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-[#FFD60A]" />
                <div>
                  <div className="font-bold text-sm">Heure du rappel</div>
                  <div className="text-xs text-gray-500">
                    Notification quotidienne des tâches
                  </div>
                </div>
              </div>
              <Input
                type="time"
                value={settings.reminderTime}
                onChange={(e) => updateSettings({ reminderTime: e.target.value })}
                className="bg-black border-gray-700 text-white"
              />
            </div>
          </>
        )}

        {/* Info */}
        <div className="px-5 mt-8">
          <div className="text-xs text-gray-600 leading-relaxed">
            <p className="mb-2">
              💡 <span className="font-bold">Astuce :</span> Les notifications vous
              aident à rester productif en vous rappelant vos tâches importantes.
            </p>
            <p>
              Les rappels sont vérifiés automatiquement toutes les heures. Vous
              pouvez les tester manuellement ci-dessus.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
