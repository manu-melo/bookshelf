"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  TrendingUp,
  Users,
  Calendar,
  Award,
  Zap,
  Target,
  Timer,
  Star,
  BookMarked,
  Globe,
  BarChart3,
} from "lucide-react";
import { useBooksStorage } from "@/hooks/useBooksStorage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReadingStatus } from "@/types";

export default function EstatisticasPage() {
  const { books, isLoading } = useBooksStorage();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando estatísticas avançadas...</p>
        </div>
      </div>
    );
  }

  // Cálculos básicos
  const completedBooks = books.filter(book => book.status === ReadingStatus.LIDO);
  const currentlyReading = books.filter(book => book.status === ReadingStatus.LENDO);
  const toRead = books.filter(book => book.status === ReadingStatus.QUERO_LER);
  
  const totalPagesRead = completedBooks.reduce((sum, book) => sum + book.pages, 0);
  const averagePages = totalPagesRead / (completedBooks.length || 1);
  const readingSpeed = Math.round(averagePages / 15);
  
  const averageRating = books
    .filter(book => book.rating)
    .reduce((sum, book) => sum + (book.rating || 0), 0) / (books.filter(book => book.rating).length || 1);

  // Estatísticas de autores
  const authorStats = books.reduce((acc, book) => {
    if (!acc[book.author]) {
      acc[book.author] = { count: 0, totalRating: 0, ratingCount: 0 };
    }
    acc[book.author].count++;
    if (book.rating) {
      acc[book.author].totalRating += book.rating;
      acc[book.author].ratingCount++;
    }
    return acc;
  }, {} as Record<string, { count: number; totalRating: number; ratingCount: number }>);

  const topAuthors = Object.entries(authorStats)
    .map(([author, stats]) => ({
      author,
      count: stats.count,
      avgRating: stats.ratingCount > 0 ? stats.totalRating / stats.ratingCount : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Distribuição de gêneros
  const genreStats = books.reduce((acc, book) => {
    acc[book.genre] = (acc[book.genre] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topGenres = Object.entries(genreStats)
    .map(([genre, count]) => ({ genre, count, percentage: Math.round((count / books.length) * 100) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Livros extremos
  const sortedByPages = [...books].sort((a, b) => b.pages - a.pages);
  const longestBook = sortedByPages[0];
  const shortestBook = sortedByPages[sortedByPages.length - 1];
  
  const sortedByYear = [...books].sort((a, b) => a.year - b.year);
  const oldestBook = sortedByYear[0];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              📊 Estatísticas Avançadas
            </h1>
            <p className="text-gray-600">
              Análise detalhada dos seus hábitos de leitura
            </p>
          </div>
          <Link
            href="/"
            className="bg-gray-900 text-white px-4 py-2 rounded-lg inline-flex items-center hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
        </div>

        {/* KPIs Coloridos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Velocidade Média</CardTitle>
              <Zap className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{readingSpeed}</div>
              <p className="text-xs opacity-90">páginas por dia</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Streak de Leitura</CardTitle>
              <Target className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs opacity-90">dias consecutivos</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Tempo Médio</CardTitle>
              <Timer className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs opacity-90">dias por livro</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Meta Anual</CardTitle>
              <Award className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round((completedBooks.length / 24) * 100)}%</div>
              <p className="text-xs opacity-90">de 24 livros</p>
            </CardContent>
          </Card>
        </div>

        {/* Rankings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Top Autores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                🏆 Top 5 Autores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topAuthors.map((author, index) => (
                  <div key={author.author} className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{author.author}</p>
                      <p className="text-xs text-gray-500">
                        {author.count} {author.count === 1 ? 'livro' : 'livros'} • ⭐ {author.avgRating.toFixed(1)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Gêneros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                📚 Top 5 Gêneros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topGenres.map((genre, index) => (
                  <div key={genre.genre} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${
                        ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'][index]
                      }`} />
                      <span className="text-sm font-medium">{genre.genre}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{genre.count}</div>
                      <div className="text-xs text-gray-500">{genre.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recordes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookMarked className="h-5 w-5 mr-2" />
                🎯 Recordes Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {longestBook && (
                <div>
                  <p className="text-sm font-medium text-gray-900">📚 Maior Livro</p>
                  <p className="text-xs text-gray-600 truncate">{longestBook.title}</p>
                  <p className="text-xs text-gray-500">{longestBook.pages} páginas</p>
                </div>
              )}
              {shortestBook && (
                <div>
                  <p className="text-sm font-medium text-gray-900">📖 Menor Livro</p>
                  <p className="text-xs text-gray-600 truncate">{shortestBook.title}</p>
                  <p className="text-xs text-gray-500">{shortestBook.pages} páginas</p>
                </div>
              )}
              {oldestBook && (
                <div>
                  <p className="text-sm font-medium text-gray-900">📜 Mais Antigo</p>
                  <p className="text-xs text-gray-600 truncate">{oldestBook.title}</p>
                  <p className="text-xs text-gray-500">{oldestBook.year}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Distribuição de Avaliações */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2" />
              ⭐ Distribuição de Avaliações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = books.filter(book => book.rating === rating).length;
                const percentage = Math.round((count / books.length) * 100);
                return (
                  <div key={rating} className="text-center">
                    <div className="flex justify-center mb-2">
                      {Array.from({length: rating}).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{count}</div>
                    <div className="text-xs text-gray-500">{percentage}% dos livros</div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{width: `${percentage}%`}}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Resumo Final */}
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center text-indigo-900">
              <BarChart3 className="h-5 w-5 mr-2" />
              💡 Resumo da Sua Jornada Literária
            </CardTitle>
          </CardHeader>
          <CardContent className="text-indigo-800">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center mb-6">
              <div>
                <div className="text-3xl font-bold text-blue-600">{completedBooks.length}</div>
                <div className="text-sm">Livros Concluídos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">{totalPagesRead.toLocaleString()}</div>
                <div className="text-sm">Páginas Lidas</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">{isNaN(averageRating) ? '0.0' : averageRating.toFixed(1)}⭐</div>
                <div className="text-sm">Avaliação Média</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">{Object.keys(genreStats).length}</div>
                <div className="text-sm">Gêneros Diferentes</div>
              </div>
            </div>
            
            <div className="bg-white/70 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p>🎯 <strong>Progresso da Meta:</strong> {Math.round((completedBooks.length / 24) * 100)}% de 24 livros anuais</p>
                  <p>📚 <strong>Gênero Favorito:</strong> {topGenres[0]?.genre || 'Nenhum ainda'}</p>
                </div>
                <div className="space-y-1">
                  <p>📖 <strong>Ritmo de Leitura:</strong> {readingSpeed} páginas por dia</p>
                  <p>🔥 <strong>Status Atual:</strong> {currentlyReading.length} lendo, {toRead.length} na lista</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}