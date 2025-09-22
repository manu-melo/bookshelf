"use client";

import { Book, ReadingStatus } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Star } from "lucide-react";
import Image from "next/image";

interface BookCardProps {
  book: Book;
  onView?: (book: Book) => void;
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
}

const STATUS_LABELS = {
  [ReadingStatus.QUERO_LER]: "Quero Ler",
  [ReadingStatus.LENDO]: "Lendo",
  [ReadingStatus.LIDO]: "Lido",
  [ReadingStatus.PAUSADO]: "Pausado",
  [ReadingStatus.ABANDONADO]: "Abandonado",
};

const STATUS_COLORS = {
  [ReadingStatus.QUERO_LER]: "bg-blue-100 text-blue-800",
  [ReadingStatus.LENDO]: "bg-yellow-100 text-yellow-800",
  [ReadingStatus.LIDO]: "bg-green-100 text-green-800",
  [ReadingStatus.PAUSADO]: "bg-orange-100 text-orange-800",
  [ReadingStatus.ABANDONADO]: "bg-red-100 text-red-800",
};

export function BookCard({ book, onView, onEdit, onDelete }: BookCardProps) {
  const renderStars = (rating?: number) => {
    if (!rating) return null;

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 h-full flex flex-col">
      <CardContent className="p-4 flex-1">
        <div className="flex flex-col h-full">
          {/* Capa do livro */}
          <div className="relative w-full h-48 mb-4 bg-gray-100 rounded-lg overflow-hidden">
            {book.cover ? (
              <Image
                src={book.cover}
                alt={`Capa do livro ${book.title}`}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  // Evita loop infinito de erro
                  if (!target.src.includes("placeholder-book.svg")) {
                    target.src = "/placeholder-book.svg";
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-6xl mb-2">📚</div>
                  <p className="text-sm">Sem capa</p>
                </div>
              </div>
            )}
          </div>

          {/* Informações do livro */}
          <div className="flex-1 space-y-2">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg line-clamp-2 leading-tight">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-1">
                por {book.author}
              </p>
              <p className="text-xs text-gray-500">
                {book.year} • {book.pages} páginas
              </p>
            </div>

            {/* Avaliação por estrelas */}
            {book.rating && (
              <div className="flex items-center gap-2">
                {renderStars(book.rating)}
                <span className="text-sm text-gray-600">{book.rating}/5</span>
              </div>
            )}

            {/* Badges de gênero e status */}
            <div className="flex flex-wrap gap-2 mt-auto">
              <Badge variant="secondary" className="text-xs">
                {book.genre}
              </Badge>
              <Badge className={`text-xs ${STATUS_COLORS[book.status]}`}>
                {STATUS_LABELS[book.status]}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Botões de ação */}
      <CardFooter className="p-2 pt-0">
        <div className="grid grid-cols-3 gap-1 w-full">
          <Button
            variant="outline"
            size="sm"
            className="text-xs px-1 py-1 h-7 min-w-0"
            onClick={() => onView?.(book)}
          >
            <Eye className="w-3 h-3 mr-0.5" />
            Ver
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs px-1 py-1 h-7 min-w-0"
            onClick={() => onEdit?.(book)}
          >
            <Edit className="w-3 h-3 mr-0.5" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs px-1 py-1 h-7 min-w-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDelete?.(book)}
          >
            <Trash2 className="w-3 h-3 mr-0.5" />
            Excluir
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
