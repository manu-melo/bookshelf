import { useState, useEffect } from "react";
import {
  Book,
  BookStats,
  GenreStats,
  ReadingStatusData,
  DashboardData,
} from "../types";
import { fetchBooks } from "../data/mockData";

export const useDashboardData = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateStats = (books: Book[]): BookStats => {
    const totalBooks = books.length;
    const completedBooks = books.filter(
      (book) => book.status === "completed"
    ).length;
    const readingBooks = books.filter(
      (book) => book.status === "reading"
    ).length;
    const toReadBooks = books.filter(
      (book) => book.status === "to-read"
    ).length;
    const abandonedBooks = books.filter(
      (book) => book.status === "abandoned"
    ).length;

    const totalPages = books.reduce((sum, book) => sum + book.pages, 0);
    const pagesRead = books.reduce((sum, book) => {
      if (book.status === "completed") return sum + book.pages;
      if (book.status === "reading") return sum + book.currentPage;
      return sum;
    }, 0);

    const ratedBooks = books.filter((book) => book.rating && book.rating > 0);
    const averageRating =
      ratedBooks.length > 0
        ? ratedBooks.reduce((sum, book) => sum + (book.rating || 0), 0) /
          ratedBooks.length
        : 0;

    const completionPercentage =
      totalPages > 0 ? (pagesRead / totalPages) * 100 : 0;

    return {
      totalBooks,
      totalPages,
      completedBooks,
      readingBooks,
      toReadBooks,
      abandonedBooks,
      pagesRead,
      averageRating,
      completionPercentage,
    };
  };

  const calculateGenreStats = (books: Book[]): GenreStats[] => {
    const genreCounts: { [key: string]: number } = {};

    books.forEach((book) => {
      genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
    });

    return Object.entries(genreCounts)
      .map(([genre, count]) => ({
        genre,
        count,
        percentage: books.length > 0 ? (count / books.length) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 gêneros
  };

  const calculateStatusData = (books: Book[]): ReadingStatusData[] => {
    const totalBooks = books.length;
    if (totalBooks === 0) {
      return [
        { name: "Lidos", value: 0, color: "#10b981" },
        { name: "Lendo", value: 0, color: "#3b82f6" },
        { name: "Abandonados", value: 0, color: "#f59e0b" },
        { name: "Para Ler", value: 0, color: "#8b5cf6" },
      ];
    }

    const completedCount = books.filter(
      (book) => book.status === "completed"
    ).length;
    const readingCount = books.filter(
      (book) => book.status === "reading"
    ).length;
    const abandonedCount = books.filter(
      (book) => book.status === "abandoned"
    ).length;
    const toReadCount = books.filter(
      (book) => book.status === "to-read"
    ).length;

    return [
      {
        name: "Lidos",
        value: Math.round((completedCount / totalBooks) * 100),
        color: "#10b981",
      },
      {
        name: "Lendo",
        value: Math.round((readingCount / totalBooks) * 100),
        color: "#3b82f6",
      },
      {
        name: "Abandonados",
        value: Math.round((abandonedCount / totalBooks) * 100),
        color: "#f59e0b",
      },
      {
        name: "Para Ler",
        value: Math.round((toReadCount / totalBooks) * 100),
        color: "#8b5cf6",
      },
    ];
  };

  const getRecentBooks = (books: Book[]): Book[] => {
    return books
      .sort(
        (a, b) =>
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      )
      .slice(0, 3); // 3 livros mais recentes
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const booksData = await fetchBooks();
        setBooks(booksData);

        const stats = calculateStats(booksData);
        const genreStats = calculateGenreStats(booksData);
        const statusData = calculateStatusData(booksData);
        const recentBooks = getRecentBooks(booksData);

        setDashboardData({
          stats,
          genreStats,
          statusData,
          recentBooks,
        });
      } catch (err) {
        setError("Erro ao carregar dados do dashboard");
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    books,
    dashboardData,
    loading,
    error,
    refetch: () => {
      const loadData = async () => {
        const booksData = await fetchBooks();
        setBooks(booksData);
        const stats = calculateStats(booksData);
        const genreStats = calculateGenreStats(booksData);
        const statusData = calculateStatusData(booksData);
        const recentBooks = getRecentBooks(booksData);
        setDashboardData({ stats, genreStats, statusData, recentBooks });
      };
      loadData();
    },
  };
};
