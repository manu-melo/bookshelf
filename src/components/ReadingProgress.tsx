import React from "react";
import { TrendingUp } from "lucide-react";

interface ReadingProgressProps {
  pagesRead: number;
  totalPages: number;
  completionPercentage: number;
}

export default function ReadingProgress({
  pagesRead,
  totalPages,
  completionPercentage,
}: ReadingProgressProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Progresso de Leitura</span>
          </h3>
          <p className="text-sm text-gray-500">
            {totalPages > 0
              ? `Você já leu ${pagesRead.toLocaleString()} de ${totalPages.toLocaleString()} páginas`
              : "Você ainda não começou a ler"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Progresso total</span>
            <span className="font-medium">
              {Math.round(completionPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gray-900 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(completionPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
