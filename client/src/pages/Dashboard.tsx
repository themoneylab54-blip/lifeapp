import { useState } from "react";
import { useLocation } from "wouter";
import { useFirebaseAuth } from "@/contexts/FirebaseAuthContext";
import { useGamefication } from "@/hooks/useGamefication";
import { useTasks } from "@/hooks/useTasks";
import { useGoals } from "@/hooks/useGoals";
import { Loader2, Target, Zap, UserCircle, Edit2 } from "lucide-react";
import TaskItem from "@/components/TaskItem";
import AddTaskModal from "@/components/AddTaskModal";
import GoalCard from "@/components/GoalCard";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { currentUser } = useFirebaseAuth();
  const { profile, loading: profileLoading, getXPForNextLevel, getXPProgress, addXP } = useGamefication();
  const { tasks, loading: tasksLoading, addTask, toggleTask, deleteTask, getProtocolTasks, getTacticalTasks, getProtocolScore } = useTasks();
  const { goals, loading: goalsLoading } = useGoals();
  const [protocolEditMode, setProtocolEditMode] = useState(false);
  const [tacticalEditMode, setTacticalEditMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate] = useState(new Date());

  if (profileLoading || tasksLoading || goalsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#FFD60A]" />
      </div>
    );
  }

  const xpForNextLevel = getXPForNextLevel();
  const xpProgress = getXPProgress();
  const protocolTasks = getProtocolTasks();
  const tacticalTasks = getTacticalTasks();
  const protocolScore = getProtocolScore();

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    await toggleTask(taskId, completed);
    if (completed) {
      await addXP(50); // Add 50 XP for completing a task
    } else {
      await addXP(-50); // Remove 50 XP when uncompleting a task
    }
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
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border px-5 py-5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black">
              {currentUser?.displayName?.split(" ")[0] || "Djalil"}
            </h1>
            <span className="text-xs border border-[#D4AF37] text-[#D4AF37] px-2 py-1 rounded uppercase font-bold">
              {profile.rank}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/profile")}
              className="w-10 h-10 rounded-full bg-secondary/50 hover:bg-secondary flex items-center justify-center transition-colors"
            >
              <UserCircle className="w-5 h-5 text-foreground" />
            </button>
            <div className="bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
              <span className="text-xs opacity-70">NIV</span>
              <span className="text-lg">{profile.level}</span>
            </div>
          </div>
        </div>
        
        {/* XP Bar */}
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#FFD60A] transition-all duration-500"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
        <div className="text-xs text-muted-foreground text-right mt-1">
          {profile.xp} / {xpForNextLevel} XP
        </div>
      </div>

      {/* Content */}
      <div className="pb-6">
        {/* Goals Section */}
        {goals.length > 0 && (
          <div className="mt-6">
            <div className="px-5 mb-3">
              <span className="text-xs font-black text-muted-foreground uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  <span>PROJETS</span>
                </div>
              </span>
            </div>
            <div className="flex gap-4 overflow-x-auto px-5 pb-4 scrollbar-hide">
              {goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </div>
        )}

        {/* Protocol Section */}
        <div className="mt-6">
          <div className="flex justify-between items-center px-5 mb-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-muted-foreground uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>PROTOCOLE</span>
                </div>
              </span>
              <button
                onClick={() => setProtocolEditMode(!protocolEditMode)}
                className="text-gray-600 hover:text-gray-400 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            <span className="text-sm font-bold text-[#32D74B]">{protocolScore}%</span>
          </div>
          <div>
            {protocolTasks.length === 0 ? (
              <div className="text-center text-muted-foreground py-8 text-sm">
                Aucune tâche protocole
              </div>
            ) : (
              protocolTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTask}
                  onDelete={deleteTask}
                  editMode={protocolEditMode}
                />
              ))
            )}
          </div>
        </div>

        {/* Tactical Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center px-5 mb-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-muted-foreground uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  <span>TACTIQUE</span>
                </div>
              </span>
              <button
                onClick={() => setTacticalEditMode(!tacticalEditMode)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            <span className="text-sm font-bold text-[#FFD60A]">{tacticalTasks.length}</span>
          </div>
          <div>
            {tacticalTasks.length === 0 ? (
              <div className="text-center text-muted-foreground py-8 text-sm">
                Aucune tâche tactique
              </div>
            ) : (
              tacticalTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTask}
                  onDelete={deleteTask}
                  editMode={tacticalEditMode}
                />
              ))
            )}
          </div>
        </div>

        {/* Add Task Button */}
        <div className="px-5 mt-6">
          <Button
            onClick={() => setModalOpen(true)}
            className="w-full bg-[#FFD60A] text-black hover:bg-[#FFD60A]/90 font-bold text-base h-12"
          >
            + Ajouter Ordre
          </Button>
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddTask}
        selectedDate={selectedDate}
      />
    </div>
  );
}
