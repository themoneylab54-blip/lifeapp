import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (
    title: string,
    type: "protocol" | "tactical",
    date: Date,
    frequency: "once" | "daily" | "custom",
    customDays?: number[]
  ) => Promise<void>;
  selectedDate: Date;
}

const DAYS = ["D", "L", "M", "M", "J", "V", "S"]; // Dimanche à Samedi

export default function AddTaskModal({
  open,
  onClose,
  onAdd,
  selectedDate,
}: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState<"once" | "daily" | "custom">("once");
  const [customDays, setCustomDays] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const type = frequency === "once" ? "tactical" : "protocol";
      await onAdd(title, type, selectedDate, frequency, customDays);
      setTitle("");
      setFrequency("once");
      setCustomDays([]);
      onClose();
    } catch (error) {
      console.error("Error adding task:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day: number) => {
    setCustomDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1c1c1e] border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Programmer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-[#FFD60A] text-sm">
            {selectedDate.toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la tâche..."
              className="bg-black border-gray-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Fréquence</Label>
            <Select
              value={frequency}
              onValueChange={(value: "once" | "daily" | "custom") => {
                setFrequency(value);
                if (value !== "custom") setCustomDays([]);
              }}
            >
              <SelectTrigger className="bg-black border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1c1c1e] border-gray-700 text-white">
                <SelectItem value="once">🎯 Une fois</SelectItem>
                <SelectItem value="daily">🔄 Quotidien</SelectItem>
                <SelectItem value="custom">📆 Jours Spécifiques</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {frequency === "custom" && (
            <div className="space-y-2">
              <Label>Jours de la semaine</Label>
              <div className="flex justify-between gap-2">
                {DAYS.map((day, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => toggleDay(index)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                      customDays.includes(index)
                        ? "bg-[#FFD60A] text-black"
                        : "bg-gray-800 text-gray-500 hover:bg-gray-700"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={loading || !title.trim()}
              className="flex-1 bg-[#FFD60A] text-black hover:bg-[#FFD60A]/90 font-bold"
            >
              {loading ? "Ajout..." : "CONFIRMER"}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-transparent border-gray-700 text-gray-400 hover:bg-gray-900"
            >
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
