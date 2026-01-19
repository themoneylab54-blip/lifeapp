import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useFirebaseAuth } from "@/contexts/FirebaseAuthContext";

export interface Task {
  id: string;
  userId: string;
  title: string;
  type: "protocol" | "tactical";
  completed: boolean;
  date: Date;
  frequency: "once" | "daily" | "custom";
  customDays?: number[]; // 0-6 (Sunday-Saturday)
  createdAt: Date;
  updatedAt: Date;
}

export function useTasks(date?: Date) {
  const { currentUser } = useFirebaseAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    let q;
    if (date) {
      // Query tasks for specific date
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      q = query(
        collection(db, "tasks"),
        where("userId", "==", currentUser.uid),
        where("date", ">=", Timestamp.fromDate(startOfDay)),
        where("date", "<=", Timestamp.fromDate(endOfDay)),
        orderBy("date", "asc")
      );
    } else {
      // Query all tasks for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      q = query(
        collection(db, "tasks"),
        where("userId", "==", currentUser.uid),
        where("date", ">=", Timestamp.fromDate(today)),
        where("date", "<", Timestamp.fromDate(tomorrow)),
        orderBy("date", "asc")
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData: Task[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          title: data.title,
          type: data.type,
          completed: data.completed === 1,
          date: data.date.toDate(),
          frequency: data.frequency,
          customDays: data.customDays ? JSON.parse(data.customDays) : undefined,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        };
      });
      setTasks(tasksData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, date]);

  const addTask = async (
    title: string,
    type: "protocol" | "tactical",
    taskDate: Date,
    frequency: "once" | "daily" | "custom" = "once",
    customDays?: number[]
  ) => {
    if (!currentUser) return;

    try {
      await addDoc(collection(db, "tasks"), {
        userId: currentUser.uid,
        title,
        type,
        completed: 0,
        date: Timestamp.fromDate(taskDate),
        frequency,
        customDays: customDays ? JSON.stringify(customDays) : null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding task:", error);
      throw error;
    }
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        completed: completed ? 1 : 0,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error toggling task:", error);
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  };

  const getProtocolTasks = () => tasks.filter((t) => t.type === "protocol");
  const getTacticalTasks = () => tasks.filter((t) => t.type === "tactical");
  
  const getProtocolScore = () => {
    const protocolTasks = getProtocolTasks();
    if (protocolTasks.length === 0) return 0;
    const completed = protocolTasks.filter((t) => t.completed).length;
    return Math.round((completed / protocolTasks.length) * 100);
  };

  return {
    tasks,
    loading,
    addTask,
    toggleTask,
    deleteTask,
    getProtocolTasks,
    getTacticalTasks,
    getProtocolScore,
  };
}
