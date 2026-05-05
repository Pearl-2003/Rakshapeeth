import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";

export default function AdminActivityChart({ data }) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <LineChart data={data}>
          
          {/* Soft grid */}
          <CartesianGrid strokeDasharray="3 3" stroke="#f1e6dc" />

          <XAxis
            dataKey="hour"
            tick={{ fill: "#7B4B2A", fontSize: 12 }}
          />

          <YAxis
            tick={{ fill: "#7B4B2A", fontSize: 12 }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              border: "1px solid #e5d5c7"
            }}
          />

          <Legend />

          {/* Students */}
          <Line
            type="monotone"
            dataKey="students"
            stroke="#7B4B2A"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Student Entries"
          />

          {/* Vehicles */}
          <Line
            type="monotone"
            dataKey="vehicles"
            stroke="#C08457"
            strokeWidth={3}
            dot={{ r: 4 }}
            name="Vehicle Entries"
          />

          {/* Alerts */}
          <Line
            type="monotone"
            dataKey="alerts"
            stroke="#DC2626"
            strokeWidth={3}
            dot={{ r: 4 }}
            name="Alerts"
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

