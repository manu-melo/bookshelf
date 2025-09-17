export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  pages: number;
  currentPage: number;
  status: "to-read" | "reading" | "completed" | "abandoned";
  rating?: number;
  dateAdded: string;
  dateStarted?: string;
  dateCompleted?: string;
  coverUrl?: string;
}

export interface BookStats {
  totalBooks: number;
  totalPages: number;
  completedBooks: number;
  readingBooks: number;
  toReadBooks: number;
  abandonedBooks: number;
  pagesRead: number;
  averageRating: number;
  completionPercentage: number;
}

export interface GenreStats {
  genre: string;
  count: number;
  percentage: number;
}

export interface ReadingStatusData {
  name: string;
  value: number;
  color: string;
}

export interface DashboardData {
  stats: BookStats;
  genreStats: GenreStats[];
  statusData: ReadingStatusData[];
  recentBooks: Book[];
}
