import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { cssVar } from "../utils/getCssColor";
import "../styles/TaskStatsChart.css";

ChartJS.register(ArcElement, Tooltip, Legend);

/* ================= CENTER TEXT PLUGIN ================= */
const centerTextPlugin = {
  id: "centerText",
  afterDraw(chart, args, pluginOptions) {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;

    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "700 22px Inter, system-ui, sans-serif";
    ctx.fillStyle = cssVar("--text-primary");
    ctx.fillText(pluginOptions.total ?? 0, centerX, centerY - 6);

    ctx.font = "500 11px Inter, system-ui, sans-serif";
    ctx.fillStyle = cssVar("--text-muted");
    ctx.fillText("Total Tasks", centerX, centerY + 14);

    ctx.restore();
  },
};

export default function TaskStatsChart({ stats }) {
  if (!stats) return null;

  const data = {
    labels: ["To Do", "In Progress", "On Hold", "Delivered", "Cancelled"],
    datasets: [
      {
        data: [
          stats.todo ?? 0,
          stats["in-progress"] ?? 0,
          stats.hold ?? 0,
          stats.delivered ?? 0,
          stats.cancelled ?? 0,
        ],
        backgroundColor: [
          cssVar("--status-todo"),
          cssVar("--status-progress"),
          cssVar("--status-hold"),
          cssVar("--status-delivered"),
          cssVar("--status-cancelled"),
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    interaction: {
      intersect: true,
      mode: "nearest",
    },
    plugins: {
      centerText: {
        total: stats.total,
      },
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 16,
          color: cssVar("--text-secondary"),
          font: { size: 11 },
        },
      },
      tooltip: {
        position: "nearest",
        caretPadding: 14,
        xAlign: "center",
        yAlign: "bottom",
        backgroundColor: cssVar("--bg-panel-raised"),
        titleColor: cssVar("--text-primary"),
        bodyColor: cssVar("--text-secondary"),
        borderColor: cssVar("--border-hairline"),
        borderWidth: 1,
      },
    },
  };

  return (
    <div className="task-chart-card">
      <div className="chart-header">
        <span>Task Breakdown</span>
        <span className="total mono">{stats.total} total</span>
      </div>

      <div className="chart-wrapper">
        <Doughnut
          data={data}
          options={options}
          plugins={[centerTextPlugin]}
        />
      </div>
    </div>
  );
}