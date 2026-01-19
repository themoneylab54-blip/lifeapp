import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useFirebaseAuth } from "@/contexts/FirebaseAuthContext";

const RANKS = [
  "Recrue",
  "Éclaireur",
  "Soldat",
  "Caporal",
  "Sergent",
  "Lieutenant",
  "Capitaine",
  "Commandant",
  "Colonel",
  "Général",
  "Warlord",
  "Empereur",
] as const;

export type Rank = typeof RANKS[number];

interface UserProfile {
  xp: number;
  level: number;
  rank: Rank;
}

export function useGamefication() {
  const { currentUser } = useFirebaseAuth();
  const [profile, setProfile] = useState<UserProfile>({
    xp: 0,
    level: 1,
    rank: "Recrue",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const profileRef = doc(db, "user_profiles", currentUser.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          const data = profileSnap.data();
          setProfile({
            xp: data.xp || 0,
            level: data.level || 1,
            rank: data.rank || "Recrue",
          });
        } else {
          // Create initial profile
          const initialProfile: UserProfile = {
            xp: 0,
            level: 1,
            rank: "Recrue",
          };
          await setDoc(profileRef, {
            ...initialProfile,
            userId: currentUser.uid,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          setProfile(initialProfile);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [currentUser]);

  const addXP = async (amount: number) => {
    if (!currentUser) return;

    try {
      const newXP = profile.xp + amount;
      const newLevel = Math.floor(newXP / 1000) + 1;
      const cappedLevel = Math.min(newLevel, 12);
      const newRank = RANKS[cappedLevel - 1];

      const profileRef = doc(db, "user_profiles", currentUser.uid);
      await updateDoc(profileRef, {
        xp: newXP,
        level: cappedLevel,
        rank: newRank,
        updatedAt: new Date(),
      });

      setProfile({
        xp: newXP,
        level: cappedLevel,
        rank: newRank,
      });

      return { levelUp: cappedLevel > profile.level };
    } catch (error) {
      console.error("Error adding XP:", error);
      return { levelUp: false };
    }
  };

  const getXPForNextLevel = () => {
    return profile.level * 1000;
  };

  const getXPProgress = () => {
    const xpInCurrentLevel = profile.xp % 1000;
    return (xpInCurrentLevel / 1000) * 100;
  };

  return {
    profile,
    loading,
    addXP,
    getXPForNextLevel,
    getXPProgress,
    RANKS,
  };
}
