import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { cssVar } from "../utils/getCssColor";
import "../styles/EmployeeTaskChart.css";

ChartJS.register(ArcElement, Tooltip, Legend);

/* ================== CENTER TEXT PLUGIN ================== */
const centerTextPlugin = {
  id: "centerText",
  afterDraw(chart) {
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);

    if (!meta || !meta.data || !meta.data.length) return;

    const total = chart.config.data.datasets[0].data.reduce(
      (a, b) => a + b,
      0
    );

    const { x, y } = meta.data[0];

    ctx.save();

    // TOTAL NUMBER
    ctx.font = "700 22px var(--font-mono)";
    ctx.fillStyle = cssVar("--text-primary");
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(total, x, y - 6);

    // LABEL
    ctx.font = "11px var(--font-body)";
    ctx.fillStyle = cssVar("--text-muted");
    ctx.fillText("Total Tasks", x, y + 14);

    ctx.restore();
  },
};

export default function EmployeeTaskChart({ employee }) {
  const STATUS_COLORS = [
    cssVar("--status-todo"),
    cssVar("--status-progress"),
    cssVar("--status-hold"),
    cssVar("--status-delivered"),
    cssVar("--status-cancelled"),
  ];

  const data = {
    labels: [
      "To Do",
      "In Progress",
      "On Hold",
      "Delivered",
      "Cancelled",
    ],
    datasets: [
      {
        data: [
          employee.todo ?? 0,
          employee["in-progress"] ?? 0,
          employee.hold ?? 0,
          employee.delivered ?? 0,
          employee.cancelled ?? 0,
        ],
        backgroundColor: STATUS_COLORS,
        hoverBackgroundColor: STATUS_COLORS,
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
        yAlign: "bottom",
        caretPadding: 14,
        backgroundColor: cssVar("--bg-panel-raised"),
        titleColor: cssVar("--text-primary"),
        bodyColor: cssVar("--text-secondary"),
        borderColor: cssVar("--border-hairline"),
        borderWidth: 1,
        padding: 10,
      },
    },
  };

  return (
    <div className="employee-chart-card">
      <div className="chart-title">Task Breakdown</div>
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