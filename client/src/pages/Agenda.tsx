import { useState } from "react";
import CalendarGrid from "@/components/CalendarGrid";
import AddTaskModal from "@/components/AddTaskModal";
import { useTasks } from "@/hooks/useTasks";

export default function Agenda() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { addTask } = useTasks();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setModalOpen(true);
  };

  const handleAddTask = async (
    title: string,
    type: "protocol" | "tactical",
    date: Date,
    frequency: "once" | "daily" | "custom",
    customDays?: number[]
  ) => {
    await addTask(title, type, date, frequency, customDays);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      <div className="py-6">
        <h1 className="text-2xl font-black mb-6 px-5">
          Agenda <span className="text-[#0A84FF]">Tactique</span>
        </h1>
        <CalendarGrid onDateSelect={handleDateSelect} />
      </div>

      {selectedDate && (
        <AddTaskModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedDate(null);
          }}
          onAdd={handleAddTask}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
}
