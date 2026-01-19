import { Task } from "@/hooks/useTasks";
import { Trash2 } from "lucide-react";

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
  editMode?: boolean;
}

export default function TaskItem({ task, onToggle, onDelete, editMode }: TaskItemProps) {
  const isProtocol = task.type === "protocol";
  const checkboxClass = isProtocol ? "rounded-full" : "rounded-md";
  const completedClass = task.completed
    ? isProtocol
      ? "opacity-50 line-through text-gray-600"
      : "opacity-50 line-through text-gray-600"
    : "";

  return (
    <div
      className={`bg-[#0f0f0f] px-5 py-3 mx-5 mb-2 rounded-xl flex items-center justify-between border border-gray-900 ${completedClass}`}
    >
      <div className="flex items-center gap-4 flex-1">
        {!editMode && (
          <button
            onClick={() => onToggle(task.id, !task.completed)}
            className={`w-6 h-6 ${checkboxClass} border-2 flex items-center justify-center flex-shrink-0 transition-all ${
              task.completed
                ? isProtocol
                  ? "bg-[#FFD60A] border-[#FFD60A]"
                  : "bg-[#32D74B] border-[#32D74B]"
                : "border-gray-700 hover:border-gray-500"
            }`}
          >
            {task.completed && (
              <svg
                className="w-4 h-4 text-black"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        )}
        <span className="text-base">{task.title}</span>
      </div>

      {editMode && (
        <button
          onClick={() => onDelete(task.id)}
          className="text-[#FF453A] p-2 hover:bg-gray-900 rounded-lg transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
