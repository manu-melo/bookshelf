"use client";

import { Book, User, Plus, BarChart3, BookOpen } from "lucide-react";
import StatsCard from "./StatsCard";
import ReadingStatusChart from "./ReadingStatusChart";
import FavoriteGenresChart from "./FavoriteGenresChart";
import RecentActivity from "./RecentActivity";
import ReadingProgress from "./ReadingProgress";
import { useDashboardData } from "../hooks/useDashboardData";

export default function Dashboard() {
  const { dashboardData, loading, error } = useDashboardData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Nenhum dado disponível</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Visão geral da sua biblioteca pessoal</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total de Livros"
            value={dashboardData.stats.totalBooks.toString()}
            subtitle={`${dashboardData.stats.totalPages} páginas total`}
            icon={<Book className="h-6 w-6" />}
          />
          <StatsCard
            title="Livros Lidos"
            value={dashboardData.stats.completedBooks.toString()}
            subtitle={`${Math.round(
              (dashboardData.stats.completedBooks /
                Math.max(dashboardData.stats.totalBooks, 1)) *
                100
            )}% da biblioteca`}
            icon={<BarChart3 className="h-6 w-6" />}
          />
          <StatsCard
            title="Lendo Atualmente"
            value={dashboardData.stats.readingBooks.toString()}
            subtitle={
              dashboardData.stats.readingBooks > 0
                ? "Em progresso"
                : "Nenhum em progresso"
            }
            icon={<BookOpen className="h-6 w-6" />}
          />
          <StatsCard
            title="Avaliação Média"
            value={
              dashboardData.stats.averageRating > 0
                ? dashboardData.stats.averageRating.toFixed(1)
                : "0"
            }
            subtitle="/5"
            rating={
              dashboardData.stats.averageRating > 0
                ? `${dashboardData.stats.totalBooks} livros avaliados`
                : "Nenhum livro avaliado"
            }
            icon={<User className="h-6 w-6" />}
          />
        </div>

        {/* Quick Actions */}
        <div className="mt-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Ações Rápidas
          </h2>
          <div className="flex gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Adicionar Livro
            </button>
          </div>
        </div>

        {/* Charts and Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ReadingStatusChart data={dashboardData.statusData} />
          <FavoriteGenresChart data={dashboardData.genreStats} />
        </div>

        {/* Reading Progress - Full Width */}
        <div className="mb-8">
          <ReadingProgress
            pagesRead={dashboardData.stats.pagesRead}
            totalPages={dashboardData.stats.totalPages}
            completionPercentage={dashboardData.stats.completionPercentage}
          />
        </div>

        {/* Recent Activity - Full Width */}
        <div>
          <RecentActivity books={dashboardData.recentBooks} />
        </div>
      </main>
    </div>
  );
}
