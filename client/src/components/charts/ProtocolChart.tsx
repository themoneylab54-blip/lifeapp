import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ProtocolChartProps {
  period: "week" | "month";
}

export default function ProtocolChart({ period }: ProtocolChartProps) {
  const days = period === "week" ? 7 : 30;
  const labels = Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    return date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" });
  });

  // Simuler des données de tâches complétées
  const completedData = Array.from({ length: days }, () => 
    Math.floor(Math.random() * 8) + 2
  );
  
  const totalData = Array.from({ length: days }, () => 10);

  const data = {
    labels,
    datasets: [
      {
        label: "Complétées",
        data: completedData,
        backgroundColor: "#32D74B",
        borderRadius: 6,
        barThickness: period === "week" ? 40 : 12,
      },
      {
        label: "Total",
        data: totalData,
        backgroundColor: "#2a2a2a",
        borderRadius: 6,
        barThickness: period === "week" ? 40 : 12,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          color: "#999",
          font: {
            size: 11,
          },
          usePointStyle: true,
          pointStyle: "circle",
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
          label: (context: any) => `${context.dataset.label}: ${context.parsed.y} tâches`,
        },
      },
    },
    scales: {
      x: {
        stacked: false,
        grid: {
          display: false,
        },
        ticks: {
          color: "#666",
          font: {
            size: 9,
          },
        },
      },
      y: {
        stacked: false,
        grid: {
          color: "#2a2a2a",
          drawBorder: false,
        },
        ticks: {
          color: "#666",
          font: {
            size: 10,
          },
          stepSize: 2,
        },
        max: 12,
      },
    },
  };

  return (
    <div className="h-64">
      <Bar data={data} options={options} />
    </div>
  );
}
