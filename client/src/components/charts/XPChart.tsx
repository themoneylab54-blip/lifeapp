import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface XPChartProps {
  period: "week" | "month";
}

export default function XPChart({ period }: XPChartProps) {
  // Générer des données de démonstration
  const days = period === "week" ? 7 : 30;
  const labels = Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  });

  // Simuler une progression XP
  const xpData = Array.from({ length: days }, (_, i) => {
    const baseXP = 1000;
    const dailyGain = Math.floor(Math.random() * 200) + 50;
    return baseXP + dailyGain * i;
  });

  const data = {
    labels,
    datasets: [
      {
        label: "XP Total",
        data: xpData,
        borderColor: "#FFD60A",
        backgroundColor: "rgba(255, 214, 10, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#FFD60A",
        pointBorderColor: "#000",
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1a1a1a",
        titleColor: "#FFD60A",
        bodyColor: "#fff",
        borderColor: "#FFD60A",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: any) => `${context.parsed.y} XP`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "#2a2a2a",
          drawBorder: false,
        },
        ticks: {
          color: "#666",
          font: {
            size: 10,
          },
        },
      },
      y: {
        grid: {
          color: "#2a2a2a",
          drawBorder: false,
        },
        ticks: {
          color: "#666",
          font: {
            size: 10,
          },
          callback: (value: any) => `${value} XP`,
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Line data={data} options={options} />
    </div>
  );
}
