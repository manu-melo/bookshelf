"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { ReadingStatusData } from "../types";

interface ReadingStatusChartProps {
  data: ReadingStatusData[];
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"];

export default function ReadingStatusChart({ data }: ReadingStatusChartProps) {
  const hasData = data.some((item) => item.value > 0);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Status dos Livros
        </h3>
        <p className="text-sm text-gray-500">
          Distribuição por status de leitura
        </p>
      </div>
      <div className="h-64">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) =>
                  value > 0 ? `${name} ${value}%` : ""
                }
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-sm">Nenhum livro cadastrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
