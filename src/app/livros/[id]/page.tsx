"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Star,
  Calendar,
  BookOpen,
  User,
  Hash,
  FileText,
} from "lucide-react";
import { Book, ReadingStatus } from "@/types";
import { useBooksStorage } from "@/hooks/useBooksStorage";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ToastContainer from "@/components/ToastContainer";
import Image from "next/image";

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { books, removeBook, updateReadingStatus } = useBooksStorage();
  const { toasts, success, error: showError, removeToast } = useToast();
  const [book, setBook] = useState<Book | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const bookId = params.id as string;

  useEffect(() => {
    const foundBook = books.find((b) => b.id === bookId);
    setBook(foundBook || null);
  }, [bookId, books]);

  const handleDelete = async () => {
    if (!book) return;

    setIsDeleting(true);
    try {
      await removeBook(book.id);
      success(`Livro "${book.title}" foi excluído com sucesso!`);
      router.push("/biblioteca");
    } catch (error) {
      console.error("Erro ao deletar livro:", error);
      showError("Erro ao excluir o livro. Tente novamente.");
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: ReadingStatus) => {
    switch (status) {
      case ReadingStatus.LENDO:
        return "bg-blue-100 text-blue-800";
      case ReadingStatus.LIDO:
        return "bg-green-100 text-green-800";
      case ReadingStatus.QUERO_LER:
        return "bg-yellow-100 text-yellow-800";
      case ReadingStatus.PAUSADO:
        return "bg-orange-100 text-orange-800";
      case ReadingStatus.ABANDONADO:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: ReadingStatus) => {
    switch (status) {
      case ReadingStatus.LENDO:
        return "Lendo";
      case ReadingStatus.LIDO:
        return "Lido";
      case ReadingStatus.QUERO_LER:
        return "Quero Ler";
      case ReadingStatus.PAUSADO:
        return "Pausado";
      case ReadingStatus.ABANDONADO:
        return "Abandonado";
      default:
        return status;
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return <span className="text-gray-400">Não avaliado</span>;

    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Livro não encontrado
          </h1>
          <p className="text-gray-600 mb-6">
            O livro que você procura não existe ou foi removido.
          </p>
          <Link href="/biblioteca">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Biblioteca
            </Button>
          </Link>
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
            <Link
              href="/biblioteca"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar para Biblioteca
            </Link>

            <div className="flex items-center space-x-3">
              <Link href={`/livros/${book.id}/editar`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="aspect-[3/4] relative mb-4">
                  {book.cover ? (
                    <Image
                      src={book.cover}
                      alt={`Capa do livro ${book.title}`}
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>

                <Badge className={getStatusColor(book.status)}>
                  {getStatusText(book.status)}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Book Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Title and Author */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-gray-600 mb-4">{book.author}</p>
              <div className="mb-4">{renderStars(book.rating)}</div>
            </div>

            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Hash className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Gênero:</span>
                    <Badge variant="secondary" className="ml-2">
                      {book.genre}
                    </Badge>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Ano:</span>
                    <span className="ml-2 font-medium">{book.year}</span>
                  </div>

                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Páginas:</span>
                    <span className="ml-2 font-medium">{book.pages}</span>
                  </div>

                  {book.isbn && (
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">ISBN:</span>
                      <span className="ml-2 font-medium">{book.isbn}</span>
                    </div>
                  )}
                </div>

                {/* Reading Progress */}
                {book.status === ReadingStatus.LENDO && book.currentPage && (
                  <div className="pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">
                        Progresso de Leitura
                      </span>
                      <span className="text-sm font-medium">
                        {book.currentPage}/{book.pages} páginas
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(book.currentPage / book.pages) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {Math.round((book.currentPage / book.pages) * 100)}%
                      concluído
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Synopsis */}
            {book.synopsis && (
              <Card>
                <CardHeader>
                  <CardTitle>Sinopse</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {book.synopsis}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            {book.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notas Pessoais</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{book.notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Reading Dates */}
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Leitura</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Adicionado em:</span>
                  <span className="text-sm font-medium">
                    {new Date(book.dateAdded).toLocaleDateString("pt-BR")}
                  </span>
                </div>

                {book.dateStarted && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Começou a ler em:
                    </span>
                    <span className="text-sm font-medium">
                      {new Date(book.dateStarted).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                )}

                {book.dateCompleted && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Terminou em:</span>
                    <span className="text-sm font-medium">
                      {new Date(book.dateCompleted).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
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
              <strong>"{book.title}"</strong>? Esta ação não pode ser desfeita.
            </p>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
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
