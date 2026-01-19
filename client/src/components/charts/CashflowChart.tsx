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

interface CashflowChartProps {
  period: "week" | "month";
}

export default function CashflowChart({ period }: CashflowChartProps) {
  const days = period === "week" ? 7 : 30;
  const labels = Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  });

  // Simuler des données de cashflow
  const revenueData = Array.from({ length: days }, () => 
    Math.floor(Math.random() * 500) + 200
  );
  
  const expenseData = Array.from({ length: days }, () => 
    Math.floor(Math.random() * 300) + 100
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Revenus",
        data: revenueData,
        borderColor: "#32D74B",
        backgroundColor: "rgba(50, 215, 75, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: "#32D74B",
        pointBorderColor: "#000",
        pointBorderWidth: 2,
      },
      {
        label: "Dépenses",
        data: expenseData,
        borderColor: "#FF453A",
        backgroundColor: "rgba(255, 69, 58, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: "#FF453A",
        pointBorderColor: "#000",
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
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
        titleColor: "#FFD60A",
        bodyColor: "#fff",
        borderColor: "#FFD60A",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.parsed.y}€`,
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
          callback: (value: any) => `${value}€`,
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
