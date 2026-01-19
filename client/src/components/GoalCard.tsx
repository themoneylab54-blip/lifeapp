import { Goal } from "@/hooks/useGoals";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface GoalCardProps {
  goal: Goal;
}

export default function GoalCard({ goal }: GoalCardProps) {
  const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
  const isCompleted = goal.current >= goal.target;

  return (
    <div className="min-w-[85%] bg-gradient-to-br from-[#1a1a1a] to-[#222] rounded-2xl p-5 border border-gray-800 flex-shrink-0">
      <div className="mb-3">
        <h3 className="text-lg font-bold mb-1">{goal.title}</h3>
        {goal.deadline && (
          <div className="text-xs text-gray-500">
            Échéance: {format(goal.deadline, "d MMMM yyyy", { locale: fr })}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Progression</span>
          <span className="font-bold text-[#FFD60A]">
            {goal.current} / {goal.target}
          </span>
        </div>

        <div className="h-2 bg-black rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isCompleted ? "bg-[#32D74B]" : "bg-[#D4AF37]"
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <div className="text-right text-xs text-gray-500">
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
}
