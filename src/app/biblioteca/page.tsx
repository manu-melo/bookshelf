"use client";

import { useState, useMemo } from "react";
import { Book } from "@/types";
import Link from "next/link";

import { BookCard } from "@/components/BookCard";

import { useBooksStorage } from "@/hooks/useBooksStorage";
import { useToast } from "@/hooks/useToast";

import { SearchBar } from "@/components/SearchBar";
import { GenreFilter } from "@/components/GenreFilter";
import { Button } from "@/components/ui/button";
import ToastContainer from "@/components/ToastContainer";
import { Plus, BookOpen, Trash2, ArrowLeft } from "lucide-react";

import { useRouter } from "next/navigation";

export default function BibliotecaPage() {
  const router = useRouter(); // ← inicializa router

  const {
    books,
    isLoading,
    updateBook,
    removeBook,
    updateReadingStatus,
    resetBooks,
  } = useBooksStorage();
  const { toasts, success, error: showError, removeToast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("todos");
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteBook = (book: Book) => {
    setBookToDelete(book);
  };

  const confirmDelete = async () => {
    if (!bookToDelete) return;

    setIsDeleting(true);
    try {
      await removeBook(bookToDelete.id);
      success(`Livro "${bookToDelete.title}" foi excluído com sucesso!`);
      setBookToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir livro:", error);
      showError("Erro ao excluir o livro. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setBookToDelete(null);
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir "${bookToDelete?.title}"?`
    );

    if (confirmDelete) {
      removeBook(bookToDelete?.id || "");
      // TODO: Implementar toast de confirmação
    }
  };

  const handleAddBook = () => {
    router.push("/biblioteca/add"); // ← navega para a página de adicionar livro
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Carregando livros...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar ao Dashboard
              </Link>

              <div className="flex items-center space-x-3">
                <BookOpen className="h-8 w-8 text-gray-800" />
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Biblioteca
                </h1>
                <span className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full">
                  {books.length} {books.length === 1 ? "livro" : "livros"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
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
            <div className="flex gap-2">
              <Link href="/livros/novo">
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Adicionar Livro
                </Button>
              </Link>
              <Button
                onClick={resetBooks}
                variant="outline"
                className="flex items-center gap-2"
              >
                🔄 Reset
              </Button>
            </div>
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
            <Link href="/livros/novo">
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Livro
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} onDelete={handleDeleteBook} />
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

      {/* Modal de Confirmação de Exclusão */}
      {bookToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <Trash2 className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">
                Confirmar Exclusão
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir o livro{" "}
              <strong>"{bookToDelete.title}"</strong> de {bookToDelete.author}?{" "}
              Esta ação não pode ser desfeita.
            </p>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={cancelDelete}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Excluindo..." : "Excluir"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
