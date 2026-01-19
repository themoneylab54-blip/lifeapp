import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  addDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useFirebaseAuth } from "@/contexts/FirebaseAuthContext";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

export interface Stat {
  id: string;
  userId: string;
  amount: number; // in cents
  date: Date;
  type: "income" | "expense";
  createdAt: Date;
}

export type StatMode = "day" | "week" | "month";

export function useStats(mode: StatMode = "day") {
  const { currentUser } = useFirebaseAuth();
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const loadStats = async () => {
      try {
        const now = new Date();
        let start: Date;
        let end: Date;

        switch (mode) {
          case "day":
            start = startOfDay(now);
            end = endOfDay(now);
            break;
          case "week":
            start = startOfWeek(now, { weekStartsOn: 1 }); // Monday
            end = endOfWeek(now, { weekStartsOn: 1 });
            break;
          case "month":
            start = startOfMonth(now);
            end = endOfMonth(now);
            break;
        }

        const q = query(
          collection(db, "stats"),
          where("userId", "==", currentUser.uid),
          where("date", ">=", Timestamp.fromDate(start)),
          where("date", "<=", Timestamp.fromDate(end))
        );

        const snapshot = await getDocs(q);
        const statsData: Stat[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            userId: data.userId,
            amount: data.amount,
            date: data.date.toDate(),
            type: data.type,
            createdAt: data.createdAt.toDate(),
          };
        });

        setStats(statsData);
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [currentUser, mode]);

  const addStat = async (amount: number, type: "income" | "expense" = "income") => {
    if (!currentUser) return;

    try {
      await addDoc(collection(db, "stats"), {
        userId: currentUser.uid,
        amount: Math.round(amount * 100), // Convert to cents
        date: Timestamp.now(),
        type,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding stat:", error);
      throw error;
    }
  };

  const getTotalIncome = () => {
    return stats
      .filter((s) => s.type === "income")
      .reduce((sum, s) => sum + s.amount, 0) / 100; // Convert back to euros
  };

  const getTotalExpense = () => {
    return stats
      .filter((s) => s.type === "expense")
      .reduce((sum, s) => sum + s.amount, 0) / 100;
  };

  const getNetIncome = () => {
    return getTotalIncome() - getTotalExpense();
  };

  return {
    stats,
    loading,
    addStat,
    getTotalIncome,
    getTotalExpense,
    getNetIncome,
  };
}
