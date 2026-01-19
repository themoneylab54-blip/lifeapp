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

export interface Goal {
  id: string;
  userId: string;
  title: string;
  target: number;
  current: number;
  deadline: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export function useGoals() {
  const { currentUser } = useFirebaseAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "goals"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const goalsData: Goal[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          title: data.title,
          target: data.target,
          current: data.current,
          deadline: data.deadline ? data.deadline.toDate() : null,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        };
      });
      setGoals(goalsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addGoal = async (title: string, target: number, deadline?: Date) => {
    if (!currentUser) return;

    try {
      await addDoc(collection(db, "goals"), {
        userId: currentUser.uid,
        title,
        target,
        current: 0,
        deadline: deadline ? Timestamp.fromDate(deadline) : null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding goal:", error);
      throw error;
    }
  };

  const updateGoalProgress = async (goalId: string, current: number) => {
    try {
      const goalRef = doc(db, "goals", goalId);
      await updateDoc(goalRef, {
        current,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating goal:", error);
      throw error;
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      const goalRef = doc(db, "goals", goalId);
      await deleteDoc(goalRef);
    } catch (error) {
      console.error("Error deleting goal:", error);
      throw error;
    }
  };

  return {
    goals,
    loading,
    addGoal,
    updateGoalProgress,
    deleteGoal,
  };
}
