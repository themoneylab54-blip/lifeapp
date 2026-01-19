import { useState, useEffect } from "react";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useFirebaseAuth } from "@/contexts/FirebaseAuthContext";

interface CalendarGridProps {
  onDateSelect: (date: Date) => void;
}

export default function CalendarGrid({ onDateSelect }: CalendarGridProps) {
  const { currentUser } = useFirebaseAuth();
  const [currentDate] = useState(new Date());
  const [daysWithTasks, setDaysWithTasks] = useState<Set<number>>(new Set());

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date().getDate();
  const isCurrentMonth =
    new Date().getMonth() === month && new Date().getFullYear() === year;

  useEffect(() => {
    if (!currentUser) return;

    const loadTaskDays = async () => {
      try {
        const startOfMonth = new Date(year, month, 1);
        startOfMonth.setHours(0, 0, 0, 0);
        const endOfMonth = new Date(year, month + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);

        const q = query(
          collection(db, "tasks"),
          where("userId", "==", currentUser.uid),
          where("date", ">=", Timestamp.fromDate(startOfMonth)),
          where("date", "<=", Timestamp.fromDate(endOfMonth))
        );

        const snapshot = await getDocs(q);
        const days = new Set<number>();
        snapshot.forEach((doc) => {
          const date = doc.data().date.toDate();
          days.add(date.getDate());
        });
        setDaysWithTasks(days);
      } catch (error) {
        console.error("Error loading task days:", error);
      }
    };

    loadTaskDays();
  }, [currentUser, year, month]);

  const handleDayClick = (day: number) => {
    const selectedDate = new Date(year, month, day);
    selectedDate.setHours(12, 0, 0, 0);
    onDateSelect(selectedDate);
  };

  return (
    <div className="bg-[#121212] rounded-2xl p-5 mx-5 border border-gray-900">
      <div className="mb-4 font-bold text-gray-400 text-sm uppercase">
        {monthNames[month]} {year}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const isToday = isCurrentMonth && day === today;
          const hasTask = daysWithTasks.has(day);

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-medium transition-all relative ${
                isToday
                  ? "bg-[#FFD60A]/10 border-2 border-[#FFD60A] text-[#FFD60A]"
                  : "bg-[#1a1a1a] border border-[#2a2a2a] text-white hover:bg-[#2a2a2a]"
              }`}
            >
              {day}
              {hasTask && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[#0A84FF]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
