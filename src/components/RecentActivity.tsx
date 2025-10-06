import React from "react";
import { BookOpen, Star } from "lucide-react";
import { Book, ReadingStatus } from "../types";

interface RecentActivityProps {
  books: Book[];
}

export default function RecentActivity({ books }: RecentActivityProps) {
  const getStatusBadge = (status: Book["status"]) => {
    switch (status) {
      case ReadingStatus.LENDO:
        return (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            Lendo
          </span>
        );
      case ReadingStatus.LIDO:
        return (
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            Lido
          </span>
        );
      case ReadingStatus.QUERO_LER:
        return (
          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
            Quero Ler
          </span>
        );
      case ReadingStatus.PAUSADO:
        return (
          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
            Pausado
          </span>
        );
      case ReadingStatus.ABANDONADO:
        return (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
            Abandonado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Atividade Recente
        </h3>
        <p className="text-sm text-gray-500">
          Últimos livros adicionados ou atualizados
        </p>
      </div>

      {books.length > 0 ? (
        <div className="space-y-4">
          {books.map((book) => (
            <div
              key={book.id}
              className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg"
            >
              <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs font-medium">
                {book.title.substring(0, 4)}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{book.title}</h4>
                <p className="text-sm text-gray-500">{book.author}</p>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusBadge(book.status)}
                  {book.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-500">
                        {book.rating}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <button className="text-xs text-blue-600 hover:text-blue-800">
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-32 text-center">
          <BookOpen className="h-8 w-8 text-gray-300 mb-2" />
          <p className="text-gray-400 text-sm">Nenhuma atividade recente</p>
          <p className="text-gray-300 text-xs mt-1">
            Adicione seu primeiro livro para começar
          </p>
        </div>
      )}
    </div>
  );
}
