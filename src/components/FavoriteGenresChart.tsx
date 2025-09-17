"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { GenreStats } from "../types";

interface FavoriteGenresChartProps {
  data: GenreStats[];
}

export default function FavoriteGenresChart({
  data,
}: FavoriteGenresChartProps) {
  const hasData = data.length > 0 && data.some((item) => item.count > 0);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Gêneros Favoritos
        </h3>
        <p className="text-sm text-gray-500">Top 5 gêneros mais lidos</p>
      </div>
      <div className="h-64">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="genre"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-sm">Nenhum gênero registrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
