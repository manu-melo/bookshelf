"use client";

import { useState, useMemo } from "react";
import { Book } from "@/types";
import { mockBooks } from "@/data/mockData";
import { BookCard } from "@/app/BookCard/page";
import { SearchBar } from "@/components/SearchBar";
import { GenreFilter } from "@/components/GenreFilter";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from "lucide-react";

export default function BibliotecaPage() {
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("todos");

  // Filtrar livros baseado na busca e gênero selecionado
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGenre =
        selectedGenre === "todos" || book.genre === selectedGenre;

      return matchesSearch && matchesGenre;
    });
  }, [books, searchQuery, selectedGenre]);

  const handleViewBook = (book: Book) => {
    console.log("Visualizar livro:", book);
    // TODO: Implementar navegação para página de detalhes
  };

  const handleEditBook = (book: Book) => {
    console.log("Editar livro:", book);
    // TODO: Implementar navegação para página de edição
  };

  const handleDeleteBook = (book: Book) => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir "${book.title}"?`
    );

    if (confirmDelete) {
      setBooks(books.filter((b) => b.id !== book.id));
      // TODO: Implementar toast de confirmação
    }
  };

  const handleAddBook = () => {
    console.log("Adicionar novo livro");
    // TODO: Implementar navegação para página de adição
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Minha Biblioteca
                </h1>
                <p className="text-gray-600 mt-1">
                  {filteredBooks.length}{" "}
                  {filteredBooks.length === 1
                    ? "livro encontrado"
                    : "livros encontrados"}
                </p>
              </div>
            </div>
            <Button onClick={handleAddBook} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Adicionar Livro
            </Button>
          </div>

          {/* Barra de busca e filtros */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <GenreFilter
              selectedGenre={selectedGenre}
              onGenreChange={setSelectedGenre}
            />
          </div>
        </div>

        {/* Grid de livros */}
        {filteredBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum livro encontrado
            </h3>
            <p className="text-gray-500 mb-6 max-w-md">
              {searchQuery || selectedGenre !== "todos"
                ? "Tente ajustar seus filtros de busca ou adicione um novo livro à sua biblioteca."
                : "Sua biblioteca está vazia. Adicione seu primeiro livro para começar!"}
            </p>
            <Button onClick={handleAddBook} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Livro
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onView={handleViewBook}
                onEdit={handleEditBook}
                onDelete={handleDeleteBook}
              />
            ))}
          </div>
        )}

        {/* Estatísticas da busca */}
        {(searchQuery || selectedGenre !== "todos") &&
          filteredBooks.length > 0 && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>{filteredBooks.length}</strong>{" "}
                {filteredBooks.length === 1 ? "livro" : "livros"}
                {searchQuery && (
                  <span>
                    {" "}
                    correspondendo à busca "<strong>{searchQuery}</strong>"
                  </span>
                )}
                {selectedGenre !== "todos" && (
                  <span>
                    {" "}
                    no gênero <strong>{selectedGenre}</strong>
                  </span>
                )}
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
