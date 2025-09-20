export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  year: number;
  pages: number;
  currentPage?: number;
  status: ReadingStatus;
  rating?: number;
  synopsis?: string;
  cover?: string;
  isbn?: string;
  notes?: string;
  dateAdded: string;
  dateStarted?: string;
  dateCompleted?: string;
}

// Status de Leitura conforme especificado
export enum ReadingStatus {
  QUERO_LER = "QUERO_LER",
  LENDO = "LENDO",
  LIDO = "LIDO",
  PAUSADO = "PAUSADO",
  ABANDONADO = "ABANDONADO",
}

// Gêneros disponíveis conforme especificado
export const GENRES = [
  "Literatura Brasileira",
  "Ficção Científica",
  "Realismo Mágico",
  "Ficção",
  "Fantasia",
  "Romance",
  "Biografia",
  "História",
  "Autoajuda",
  "Tecnologia",
  "Programação",
  "Negócios",
  "Psicologia",
  "Filosofia",
  "Poesia",
] as const;

export type Genre = (typeof GENRES)[number];

export interface BookStats {
  totalBooks: number;
  totalPages: number;
  completedBooks: number;
  readingBooks: number;
  toReadBooks: number;
  pausedBooks: number;
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
