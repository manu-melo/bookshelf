"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Star, Upload, Eye, EyeOff } from "lucide-react";
import { Book, ReadingStatus, GENRES } from "@/types";
import { useBooksStorage } from "@/hooks/useBooksStorage";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ToastContainer from "@/components/ToastContainer";
import Image from "next/image";

interface BookFormData {
  title: string;
  author: string;
  genre: string;
  year: string;
  pages: string;
  currentPage: string;
  status: ReadingStatus;
  rating: number;
  synopsis: string;
  cover: string;
  isbn: string;
  notes: string;
}

export default function EditBookPage() {
  const params = useParams();
  const router = useRouter();
  const { books, updateBook } = useBooksStorage();
  const { toasts, success, error: showError, removeToast } = useToast();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const bookId = params.id as string;

  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    genre: "",
    year: "",
    pages: "",
    currentPage: "",
    status: ReadingStatus.QUERO_LER,
    rating: 0,
    synopsis: "",
    cover: "",
    isbn: "",
    notes: "",
  });

  useEffect(() => {
    const foundBook = books.find((b) => b.id === bookId);
    if (foundBook) {
      setBook(foundBook);
      setFormData({
        title: foundBook.title,
        author: foundBook.author,
        genre: foundBook.genre,
        year: foundBook.year.toString(),
        pages: foundBook.pages.toString(),
        currentPage: foundBook.currentPage?.toString() || "",
        status: foundBook.status,
        rating: foundBook.rating || 0,
        synopsis: foundBook.synopsis || "",
        cover: foundBook.cover || "",
        isbn: foundBook.isbn || "",
        notes: foundBook.notes || "",
      });
    }
  }, [bookId, books]);

  const handleInputChange = (
    field: keyof BookFormData,
    value: string | number | ReadingStatus
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleStarClick = (rating: number) => {
    setFormData((prev) => ({
      ...prev,
      rating: prev.rating === rating ? 0 : rating,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Título é obrigatório";
    }

    if (!formData.author.trim()) {
      newErrors.author = "Autor é obrigatório";
    }

    if (
      formData.year &&
      (isNaN(Number(formData.year)) ||
        Number(formData.year) < 0 ||
        Number(formData.year) > new Date().getFullYear() + 10)
    ) {
      newErrors.year = "Ano deve ser válido";
    }

    if (
      formData.pages &&
      (isNaN(Number(formData.pages)) || Number(formData.pages) <= 0)
    ) {
      newErrors.pages = "Número de páginas deve ser maior que zero";
    }

    if (formData.currentPage && formData.pages) {
      const current = Number(formData.currentPage);
      const total = Number(formData.pages);
      if (current < 0 || current > total) {
        newErrors.currentPage =
          "Página atual deve estar entre 0 e o total de páginas";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !book) return;

    setIsLoading(true);

    try {
      const updates: Partial<Book> = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        genre: formData.genre || book.genre,
        year: formData.year ? Number(formData.year) : book.year,
        pages: formData.pages ? Number(formData.pages) : book.pages,
        currentPage: formData.currentPage
          ? Number(formData.currentPage)
          : undefined,
        status: formData.status,
        rating: formData.rating || undefined,
        synopsis: formData.synopsis.trim() || undefined,
        cover: formData.cover.trim() || undefined,
        isbn: formData.isbn.trim() || undefined,
        notes: formData.notes.trim() || undefined,
      };

      await updateBook(book.id, updates);
      success(`Livro "${formData.title}" foi atualizado com sucesso!`);
      router.push(`/livros/${book.id}`);
    } catch (error) {
      console.error("Erro ao atualizar livro:", error);
      showError("Erro ao atualizar o livro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const getCompletionPercentage = () => {
    const fields = [
      formData.title,
      formData.author,
      formData.genre,
      formData.year,
      formData.pages,
      formData.synopsis,
      formData.cover,
    ];

    const filledFields = fields.filter(
      (field) => field && field.toString().trim()
    ).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Livro não encontrado
          </h1>
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
            <div className="flex items-center space-x-4">
              <Link
                href={`/livros/${book.id}`}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar para Detalhes
              </Link>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Progresso:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getCompletionPercentage()}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {getCompletionPercentage()}%
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Preview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Preview</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              {showPreview && (
                <CardContent className="space-y-4">
                  <div className="aspect-[3/4] relative">
                    {formData.cover ? (
                      <Image
                        src={formData.cover}
                        alt="Preview da capa"
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        onError={() => handleInputChange("cover", "")}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                        <Upload className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">
                      {formData.title || "Título do livro"}
                    </h3>
                    <p className="text-gray-600">
                      {formData.author || "Autor do livro"}
                    </p>

                    {formData.rating > 0 && (
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= formData.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Título *
                      </label>
                      <Input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        className={errors.title ? "border-red-300" : ""}
                        placeholder="Digite o título do livro"
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.title}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="author"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Autor *
                      </label>
                      <Input
                        id="author"
                        type="text"
                        value={formData.author}
                        onChange={(e) =>
                          handleInputChange("author", e.target.value)
                        }
                        className={errors.author ? "border-red-300" : ""}
                        placeholder="Nome do autor"
                      />
                      {errors.author && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.author}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor="genre"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Gênero
                      </label>
                      <select
                        id="genre"
                        value={formData.genre}
                        onChange={(e) =>
                          handleInputChange("genre", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Selecionar gênero</option>
                        {GENRES.map((genre) => (
                          <option key={genre} value={genre}>
                            {genre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="year"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Ano de Publicação
                      </label>
                      <Input
                        id="year"
                        type="number"
                        value={formData.year}
                        onChange={(e) =>
                          handleInputChange("year", e.target.value)
                        }
                        className={errors.year ? "border-red-300" : ""}
                        placeholder="2024"
                        min="0"
                        max={new Date().getFullYear() + 10}
                      />
                      {errors.year && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.year}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="pages"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Total de Páginas
                      </label>
                      <Input
                        id="pages"
                        type="number"
                        value={formData.pages}
                        onChange={(e) =>
                          handleInputChange("pages", e.target.value)
                        }
                        className={errors.pages ? "border-red-300" : ""}
                        placeholder="300"
                        min="1"
                      />
                      {errors.pages && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.pages}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reading Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Leitura</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="status"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Status de Leitura
                      </label>
                      <select
                        id="status"
                        value={formData.status}
                        onChange={(e) =>
                          handleInputChange(
                            "status",
                            e.target.value as ReadingStatus
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={ReadingStatus.QUERO_LER}>
                          Quero Ler
                        </option>
                        <option value={ReadingStatus.LENDO}>Lendo</option>
                        <option value={ReadingStatus.LIDO}>Lido</option>
                        <option value={ReadingStatus.PAUSADO}>Pausado</option>
                        <option value={ReadingStatus.ABANDONADO}>
                          Abandonado
                        </option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="currentPage"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Página Atual
                      </label>
                      <Input
                        id="currentPage"
                        type="number"
                        value={formData.currentPage}
                        onChange={(e) =>
                          handleInputChange("currentPage", e.target.value)
                        }
                        className={errors.currentPage ? "border-red-300" : ""}
                        placeholder="0"
                        min="0"
                        max={formData.pages || undefined}
                      />
                      {errors.currentPage && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.currentPage}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Avaliação
                    </label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleStarClick(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-6 w-6 cursor-pointer transition-colors ${
                              star <= formData.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300 hover:text-yellow-300"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {formData.rating > 0
                          ? `${formData.rating}/5`
                          : "Não avaliado"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações Adicionais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label
                      htmlFor="cover"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      URL da Capa
                    </label>
                    <Input
                      id="cover"
                      type="url"
                      value={formData.cover}
                      onChange={(e) =>
                        handleInputChange("cover", e.target.value)
                      }
                      placeholder="https://exemplo.com/capa.jpg"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="isbn"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      ISBN
                    </label>
                    <Input
                      id="isbn"
                      type="text"
                      value={formData.isbn}
                      onChange={(e) =>
                        handleInputChange("isbn", e.target.value)
                      }
                      placeholder="978-0123456789"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="synopsis"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Sinopse
                    </label>
                    <textarea
                      id="synopsis"
                      value={formData.synopsis}
                      onChange={(e) =>
                        handleInputChange("synopsis", e.target.value)
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Descreva brevemente sobre o que se trata o livro..."
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="notes"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Notas Pessoais
                    </label>
                    <textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        handleInputChange("notes", e.target.value)
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Suas anotações, reflexões ou comentários sobre o livro..."
                    />
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
