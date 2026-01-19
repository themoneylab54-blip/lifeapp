import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface TacticalChartProps {
  completed: number;
  pending: number;
}

export default function TacticalChart({ completed, pending }: TacticalChartProps) {
  const total = completed + pending;
  const completedPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const data = {
    labels: ["Complétées", "En attente"],
    datasets: [
      {
        data: [completed, pending],
        backgroundColor: ["#32D74B", "#2a2a2a"],
        borderColor: ["#000", "#000"],
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          color: "#999",
          font: {
            size: 11,
          },
          usePointStyle: true,
          pointStyle: "circle",
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: "#1a1a1a",
        titleColor: "#32D74B",
        bodyColor: "#fff",
        borderColor: "#32D74B",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context: any) => {
            const label = context.label || "";
            const value = context.parsed || 0;
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="relative h-64">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-4xl font-black text-[#32D74B]">{completedPercentage}%</div>
        <div className="text-xs text-gray-500 mt-1">Taux d'exécution</div>
      </div>
    </div>
  );
}
