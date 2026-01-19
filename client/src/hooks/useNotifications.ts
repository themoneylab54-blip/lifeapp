import { useState, useEffect, useCallback } from "react";
import {
  isNotificationSupported,
  isNotificationEnabled,
  requestNotificationPermission,
} from "@/lib/notifications";

export interface NotificationSettings {
  enabled: boolean;
  protocolReminders: boolean;
  projectDeadlines: boolean;
  reminderTime: string; // Format: "HH:mm"
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  protocolReminders: true,
  projectDeadlines: true,
  reminderTime: "20:00", // 8 PM par défaut
};

const STORAGE_KEY = "djalil-os-notification-settings";

export function useNotifications() {
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Charger les paramètres depuis localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading notification settings:", error);
      }
    }
  }, []);

  // Vérifier l'état des permissions
  useEffect(() => {
    setPermissionGranted(isNotificationEnabled());
  }, []);

  // Sauvegarder les paramètres
  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Demander la permission
  const requestPermission = useCallback(async () => {
    const granted = await requestNotificationPermission();
    setPermissionGranted(granted);
    return granted;
  }, []);

  // Vérifier les tâches Protocole non complétées
  const checkProtocolTasks = useCallback(() => {
    console.log("Check protocol tasks triggered");
  }, []);

  // Vérifier les échéances de projets
  const checkProjectDeadlines = useCallback(() => {
    console.log("Check project deadlines triggered");
  }, []);

  return {
    settings,
    updateSettings,
    permissionGranted,
    requestPermission,
    isSupported: isNotificationSupported(),
    checkProtocolTasks,
    checkProjectDeadlines,
  };
}
