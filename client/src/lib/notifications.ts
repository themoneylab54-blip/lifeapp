/**
 * Service de notifications push pour Djalil OS Pro
 * Gère les permissions et l'envoi de notifications navigateur
 */

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
}

/**
 * Vérifie si les notifications sont supportées par le navigateur
 */
export function isNotificationSupported(): boolean {
  return "Notification" in window;
}

/**
 * Vérifie si les notifications sont activées
 */
export function isNotificationEnabled(): boolean {
  return isNotificationSupported() && Notification.permission === "granted";
}

/**
 * Demande la permission d'envoyer des notifications
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) {
    console.warn("Notifications not supported in this browser");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission === "denied") {
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
}

/**
 * Envoie une notification
 */
export async function sendNotification(options: NotificationOptions): Promise<void> {
  if (!isNotificationEnabled()) {
    console.warn("Notifications not enabled");
    return;
  }

  try {
    const notification = new Notification(options.title, {
      body: options.body,
      icon: options.icon || "/icon-192.png",
      badge: options.badge || "/icon-192.png",
      tag: options.tag,
      requireInteraction: options.requireInteraction || false,
    });

    // Auto-close after 10 seconds if not requiring interaction
    if (!options.requireInteraction) {
      setTimeout(() => notification.close(), 10000);
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}

/**
 * Envoie une notification de rappel de tâche
 */
export async function sendTaskReminder(taskTitle: string, taskType: "protocol" | "tactical"): Promise<void> {
  const typeLabel = taskType === "protocol" ? "Protocole" : "Tactique";
  await sendNotification({
    title: `⏰ Rappel ${typeLabel}`,
    body: `N'oubliez pas : ${taskTitle}`,
    tag: `task-${taskType}`,
  });
}

/**
 * Envoie une notification d'échéance de projet
 */
export async function sendProjectDeadlineAlert(
  projectTitle: string,
  daysLeft: number
): Promise<void> {
  const urgency = daysLeft <= 1 ? "🚨" : daysLeft <= 3 ? "⚠️" : "📅";
  const message =
    daysLeft === 0
      ? "Échéance aujourd'hui !"
      : daysLeft === 1
      ? "Échéance demain !"
      : `Échéance dans ${daysLeft} jours`;

  await sendNotification({
    title: `${urgency} Projet : ${projectTitle}`,
    body: message,
    tag: `project-${projectTitle}`,
    requireInteraction: daysLeft <= 1,
  });
}

/**
 * Envoie une notification de félicitations
 */
export async function sendCongratulationsNotification(message: string): Promise<void> {
  await sendNotification({
    title: "🎉 Félicitations !",
    body: message,
    tag: "congratulations",
  });
}
