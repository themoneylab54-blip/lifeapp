import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useStats, StatMode } from "@/hooks/useStats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Activity, Target, TrendingUp, PieChart } from "lucide-react";
import XPChart from "@/components/charts/XPChart";
import ProtocolChart from "@/components/charts/ProtocolChart";
import CashflowChart from "@/components/charts/CashflowChart";
import TacticalChart from "@/components/charts/TacticalChart";

export default function Vision() {
  const [statMode, setStatMode] = useState<StatMode>("day");
  const [bizMode, setBizMode] = useState<"week" | "month">("week");
  const [graphPeriod, setGraphPeriod] = useState<"week" | "month">("week");
  const [cashflowInput, setCashflowInput] = useState("");
  const [showRaw, setShowRaw] = useState(false);
  
  const { loading: tasksLoading, getProtocolScore, getProtocolTasks, getTacticalTasks } = useTasks();
  const { stats, loading: statsLoading, addStat, getNetIncome } = useStats(bizMode);

  if (tasksLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#FFD60A]" />
      </div>
    );
  }

  const protocolScore = getProtocolScore();
  const protocolTasks = getProtocolTasks();
  const tacticalTasks = getTacticalTasks();
  const completedTactical = tacticalTasks.filter(t => t.completed).length;
  const tacticalScore = tacticalTasks.length > 0 
    ? Math.round((completedTactical / tacticalTasks.length) * 100)
    : 0;
  const netIncome = getNetIncome();

  const handleSaveCashflow = async () => {
    const amount = parseFloat(cashflowInput);
    if (!isNaN(amount) && amount > 0) {
      await addStat(amount, "income");
      setCashflowInput("");
    }
  };

  const getStatModeLabel = () => {
    switch (statMode) {
      case "day": return "Aujourd'hui";
      case "week": return "Cette semaine";
      case "month": return "Ce mois";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      <div className="py-6">
        <h1 className="text-2xl font-black mb-6 px-5">
          Vision <span className="text-[#FF453A]">Auditeur</span>
        </h1>

        {/* Stats Mode Selector */}
        <div className="flex justify-center gap-4 mb-6 mx-5 bg-[#1a1a1a] p-2.5 rounded-full border border-gray-800">
          {(["day", "week", "month"] as StatMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setStatMode(mode)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-colors ${
                statMode === mode
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-600 hover:text-gray-400"
              }`}
            >
              {mode === "day" ? "JOUR" : mode === "week" ? "SEMAINE" : "MOIS"}
            </button>
          ))}
        </div>

        <div className="text-center text-gray-500 text-sm mb-6">{getStatModeLabel()}</div>

        {/* Graph Period Selector */}
        <div className="px-5 mb-6">
          <div className="flex gap-2 bg-[#1a1a1a] p-1 rounded-xl">
            <button
              onClick={() => setGraphPeriod("week")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${
                graphPeriod === "week"
                  ? "bg-[#FFD60A] text-black"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              7 jours
            </button>
            <button
              onClick={() => setGraphPeriod("month")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${
                graphPeriod === "month"
                  ? "bg-[#FFD60A] text-black"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              30 jours
            </button>
          </div>
        </div>

        {/* XP Evolution Chart */}
        <div className="px-5 mb-6">
          <div className="bg-[#121212] rounded-2xl p-5 border border-gray-900">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black">Évolution XP</h3>
              <Activity className="w-5 h-5 text-[#FFD60A]" />
            </div>
            <XPChart period={graphPeriod} />
          </div>
        </div>

        {/* Protocol Regularity Chart */}
        <div className="px-5 mb-6">
          <div className="bg-[#121212] rounded-2xl p-5 border border-gray-900">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black">Régularité Protocole</h3>
              <Target className="w-5 h-5 text-[#32D74B]" />
            </div>
            <ProtocolChart period={graphPeriod} />
          </div>
        </div>

        {/* Protocol Score Card */}
        <div
          onClick={() => setShowRaw(!showRaw)}
          className={`bg-[#111] rounded-3xl p-8 mx-5 mb-5 text-center border-2 cursor-pointer transition-colors ${
            protocolScore >= 80 ? "border-[#32D74B]" : "border-[#FF453A]"
          }`}
        >
          <div className="text-sm text-gray-400 mb-2">Régularité Protocole</div>
          {!showRaw ? (
            <div className={`text-6xl font-black ${
              protocolScore >= 80 ? "text-[#32D74B]" : "text-[#FF453A]"
            }`}>
              {protocolScore}%
            </div>
          ) : (
            <div className="text-2xl font-bold text-gray-400 my-4">
              {protocolTasks.filter(t => t.completed).length} / {protocolTasks.length}
            </div>
          )}
        </div>

        {/* Tactical Score Card */}
        <div
          onClick={() => setShowRaw(!showRaw)}
          className={`bg-[#111] rounded-3xl p-8 mx-5 mb-5 text-center border-2 cursor-pointer transition-colors ${
            tacticalScore >= 80 ? "border-[#32D74B]" : "border-[#FF453A]"
          }`}
        >
          <div className="text-sm text-gray-400 mb-2">Exécution Tactique</div>
          {!showRaw ? (
            <div className={`text-6xl font-black ${
              tacticalScore >= 80 ? "text-[#32D74B]" : "text-[#FF453A]"
            }`}>
              {tacticalScore}%
            </div>
          ) : (
            <div className="text-2xl font-bold text-gray-400 my-4">
              {completedTactical} / {tacticalTasks.length}
            </div>
          )}
        </div>

        {/* Cashflow Chart */}
        <div className="px-5 mb-6">
          <div className="bg-[#121212] rounded-2xl p-5 border border-gray-900">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black">Cashflow</h3>
              <TrendingUp className="w-5 h-5 text-[#32D74B]" />
            </div>
            <CashflowChart period={graphPeriod} />
            <div className="text-center mt-4">
              <div className={`text-3xl font-black ${
                netIncome >= 0 ? "text-[#32D74B]" : "text-[#FF453A]"
              }`}>
                {netIncome.toFixed(2)}€
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {bizMode === "week" ? "Cette semaine" : "Ce mois"}
              </div>
            </div>
          </div>
        </div>

        {/* Tactical Execution Chart */}
        <div className="px-5 mb-6">
          <div className="bg-[#121212] rounded-2xl p-5 border border-gray-900">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black">Exécution Tactique</h3>
              <PieChart className="w-5 h-5 text-[#32D74B]" />
            </div>
            <TacticalChart completed={completedTactical} pending={tacticalTasks.length - completedTactical} />
          </div>
        </div>

        {/* Add Cashflow Input */}
        <div className="bg-[#121212] rounded-2xl p-5 mx-5 border border-gray-900">
          <Input
            type="number"
            value={cashflowInput}
            onChange={(e) => setCashflowInput(e.target.value)}
            placeholder="Cashflow Hebdo (€)"
            className="bg-background border-border text-foreground mb-3"
          />
          <Button
            onClick={handleSaveCashflow}
            disabled={!cashflowInput}
            className="w-full bg-[#FFD60A] text-black hover:bg-[#FFD60A]/90 font-bold"
          >
            ENREGISTRER
          </Button>
        </div>
      </div>
    </div>
  );
}
