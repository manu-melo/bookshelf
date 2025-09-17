"use client";

import {
  Book,
  Search,
  User,
  Plus,
  BarChart3,
  BookOpen,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import StatsCard from "./StatsCard";
import ReadingStatusChart from "./ReadingStatusChart";
import FavoriteGenresChart from "./FavoriteGenresChart";
import RecentActivity from "./RecentActivity";
import ReadingProgress from "./ReadingProgress";
import { useDashboardData } from "../hooks/useDashboardData";

export default function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo e Menu Mobile */}
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <Book className="h-8 w-8 text-gray-800" />
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  BookShelf
                </h1>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex ml-8 space-x-8">
                <a
                  href="#"
                  className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium border-b-2 border-gray-900"
                >
                  Dashboard
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                >
                  Biblioteca
                </a>
              </nav>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
              <button className="bg-gray-900 text-white px-3 lg:px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span className="hidden lg:inline">Adicionar Livro</span>
                <span className="lg:hidden">Adicionar</span>
              </button>
              <button className="text-gray-500 hover:text-gray-700 p-2">
                <Search className="h-5 w-5" />
              </button>
              <button className="text-gray-500 hover:text-gray-700 p-2">
                <User className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-gray-900 hover:text-gray-700 px-3 py-2 text-base font-medium bg-gray-50 rounded-md"
                >
                  Dashboard
                </a>
                <a
                  href="#"
                  className="block text-gray-500 hover:text-gray-700 px-3 py-2 text-base font-medium"
                >
                  Biblioteca
                </a>
              </div>

              {/* Mobile Actions */}
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <button className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Adicionar Livro</span>
                </button>
                <div className="flex justify-center space-x-6 pt-2">
                  <button className="text-gray-500 hover:text-gray-700 p-2">
                    <Search className="h-5 w-5" />
                  </button>
                  <button className="text-gray-500 hover:text-gray-700 p-2">
                    <User className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

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
