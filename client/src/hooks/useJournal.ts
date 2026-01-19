import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useFirebaseAuth } from "@/contexts/FirebaseAuthContext";

export interface JournalEntry {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export function useJournal() {
  const { currentUser } = useFirebaseAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "journal"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entriesData: JournalEntry[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          content: data.content,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        };
      });
      setEntries(entriesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addEntry = async (content: string) => {
    if (!currentUser) return;

    try {
      await addDoc(collection(db, "journal"), {
        userId: currentUser.uid,
        content,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding journal entry:", error);
      throw error;
    }
  };

  const deleteEntry = async (entryId: string) => {
    try {
      const entryRef = doc(db, "journal", entryId);
      await deleteDoc(entryRef);
    } catch (error) {
      console.error("Error deleting journal entry:", error);
      throw error;
    }
  };

  return {
    entries,
    loading,
    addEntry,
    deleteEntry,
  };
}
