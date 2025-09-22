import { useState, useEffect, useCallback } from 'react';
import { Book, ReadingStatus } from '@/types';
import { useLocalStorage } from './useLocalStorage';

// Dados iniciais dos livros (adaptados para interface Book)
const initialBooks: Book[] = [
  {
    id: '1',
    title: '1984',
    author: 'George Orwell',
    genre: 'Ficção Científica',
    year: 1949,
    pages: 328,
    isbn: '978-0452284234',
    synopsis: 'Uma distopia sobre um regime totalitário que controla todos os aspectos da vida.',
    cover: 'https://covers.openlibrary.org/b/isbn/9780452284234-L.jpg',
    rating: 4.5,
    status: ReadingStatus.LIDO,
    dateAdded: '2024-01-15',
    currentPage: 328
  },
  {
    id: '2',
    title: 'Dom Quixote',
    author: 'Miguel de Cervantes',
    genre: 'Literatura Brasileira',
    year: 1605,
    pages: 863,
    isbn: '978-0060934347',
    synopsis: 'As aventuras do fidalgo Dom Quixote e seu escudeiro Sancho Pança.',
    cover: 'https://covers.openlibrary.org/b/isbn/9780060934347-L.jpg',
    rating: 4.2,
    status: ReadingStatus.LENDO,
    dateAdded: '2024-02-01',
    currentPage: 388
  },
  {
    id: '3',
    title: 'O Pequeno Príncipe',
    author: 'Antoine de Saint-Exupéry',
    genre: 'Ficção',
    year: 1943,
    pages: 96,
    isbn: '978-0156012195',
    synopsis: 'A história de um pequeno príncipe que viaja de planeta em planeta.',
    cover: 'https://covers.openlibrary.org/b/isbn/9780156012195-L.jpg',
    rating: 4.8,
    status: ReadingStatus.LIDO,
    dateAdded: '2024-01-10',
    currentPage: 96
  },
  {
    id: '4',
    title: 'Cem Anos de Solidão',
    author: 'Gabriel García Márquez',
    genre: 'Realismo Mágico',
    year: 1967,
    pages: 417,
    isbn: '978-0060883287',
    synopsis: 'A saga da família Buendía na cidade fictícia de Macondo.',
    cover: 'https://covers.openlibrary.org/b/isbn/9780060883287-L.jpg',
    rating: 4.6,
    status: ReadingStatus.QUERO_LER,
    dateAdded: '2024-02-15',
    currentPage: 0
  },
  {
    id: '5',
    title: 'O Senhor dos Anéis: A Sociedade do Anel',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasia',
    year: 1954,
    pages: 423,
    isbn: '978-0547928210',
    synopsis: 'O início da épica jornada de Frodo para destruir o Um Anel.',
    cover: 'https://covers.openlibrary.org/b/isbn/9780547928210-L.jpg',
    rating: 4.9,
    status: ReadingStatus.LENDO,
    dateAdded: '2024-01-20',
    currentPage: 330
  },
  {
    id: '6',
    title: 'Orgulho e Preconceito',
    author: 'Jane Austen',
    genre: 'Romance',
    year: 1813,
    pages: 279,
    isbn: '978-0141439518',
    synopsis: 'A história de Elizabeth Bennet e sua relação com Mr. Darcy.',
    cover: 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg',
    rating: 4.4,
    status: ReadingStatus.PAUSADO,
    dateAdded: '2024-02-10',
    currentPage: 167
  },
  {
    id: '7',
    title: 'Sapiens: Uma Breve História da Humanidade',
    author: 'Yuval Noah Harari',
    genre: 'História',
    year: 2011,
    pages: 443,
    isbn: '978-0062316097',
    synopsis: 'Uma análise da evolução da humanidade desde a Idade da Pedra.',
    cover: 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg',
    rating: 4.3,
    status: ReadingStatus.LIDO,
    dateAdded: '2024-01-05',
    currentPage: 443
  },
  {
    id: '8',
    title: 'A Metamorfose',
    author: 'Franz Kafka',
    genre: 'Ficção',
    year: 1915,
    pages: 55,
    isbn: '978-0486290300',
    synopsis: 'A história de Gregor Samsa que acorda transformado em inseto.',
    cover: 'https://covers.openlibrary.org/b/isbn/9780486290300-L.jpg',
    rating: 4.0,
    status: ReadingStatus.ABANDONADO,
    dateAdded: '2024-02-05',
    currentPage: 14
  },
  {
    id: '9',
    title: 'Harry Potter e a Pedra Filosofal',
    author: 'J.K. Rowling',
    genre: 'Fantasia',
    year: 1997,
    pages: 309,
    isbn: '9780439708180',
    synopsis: 'O primeiro ano de Harry Potter na Escola de Magia e Bruxaria de Hogwarts.',
    cover: 'https://covers.openlibrary.org/b/isbn/9780439708180-L.jpg',
    rating: 4.7,
    status: ReadingStatus.LIDO,
    dateAdded: '2024-01-30',
    currentPage: 309
  },
  {
    id: '10',
    title: 'O Código Da Vinci',
    author: 'Dan Brown',
    genre: 'Ficção',
    year: 2003,
    pages: 454,
    isbn: '978-0307474278',
    synopsis: 'Robert Langdon desvenda mistérios envolvendo arte e história.',
    cover: 'https://covers.openlibrary.org/b/isbn/9780307474278-L.jpg',
    rating: 3.8,
    status: ReadingStatus.QUERO_LER,
    dateAdded: '2024-02-20',
    currentPage: 0
  }
];

export const useBooksStorage = () => {
  const [books, setBooks] = useLocalStorage<Book[]>('bookshelf-books', initialBooks);
  const [isLoading, setIsLoading] = useState(true);

  // Inicialização - carrega os dados do localStorage ou usa dados iniciais
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Função para adicionar um novo livro
  const addBook = useCallback((newBook: Omit<Book, 'id' | 'dateAdded'>) => {
    const bookWithId: Book = {
      ...newBook,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString().split('T')[0]
    };
    
    setBooks(currentBooks => [...currentBooks, bookWithId]);
    return bookWithId;
  }, [setBooks]);

  // Função para atualizar um livro existente
  const updateBook = useCallback((bookId: string, updates: Partial<Book>) => {
    setBooks(currentBooks => 
      currentBooks.map(book => 
        book.id === bookId ? { ...book, ...updates } : book
      )
    );
  }, [setBooks]);

  // Função para remover um livro
  const removeBook = useCallback((bookId: string) => {
    setBooks(currentBooks => 
      currentBooks.filter(book => book.id !== bookId)
    );
  }, [setBooks]);

  // Função para buscar um livro por ID
  const getBookById = useCallback((bookId: string): Book | undefined => {
    return books.find(book => book.id === bookId);
  }, [books]);

  // Função para atualizar o status de leitura
  const updateReadingStatus = useCallback((bookId: string, status: ReadingStatus, currentPage?: number) => {
    const updates: Partial<Book> = { 
      status,
      currentPage: currentPage !== undefined ? currentPage : (status === ReadingStatus.LIDO ? books.find(b => b.id === bookId)?.pages || 0 : 0)
    };
    
    updateBook(bookId, updates);
  }, [updateBook, books]);

  // Função para resetar todos os dados (útil para desenvolvimento/testes)
  const resetBooks = useCallback(() => {
    setBooks(initialBooks);
  }, [setBooks]);

  return {
    books,
    isLoading,
    addBook,
    updateBook,
    removeBook,
    getBookById,
    updateReadingStatus,
    resetBooks
  };
};