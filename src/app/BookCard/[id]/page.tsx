"use client";
import { mockBooks } from "@/data/mockData";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function Detalhes() {
  const params = useParams();
  const id = params.id as string;
  const [books, setBooks] = useState(mockBooks);
  const book = books.find((p) => p.id === id);

  const handleDelete = () => {
    if (confirm(`Deseja Deletar " ${book?.title} " da sua Biblioteca ?`)) {
      setBooks((prev) => prev.filter((b) => b.id !== id));
      alert("Livro deletado com Sucesso");
      window.location.href = "/biblioteca";
    }
  };
  if (!book) return notFound();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-6 bg-white shadow-md rounded-lg p-6">
        {/* Capa do livro */}
        <div className="relative w-full md:w-48 h-64 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          {book.cover ? (
            <Image
              src={book.cover}
              alt={book.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 12rem"
            />
          ) : (
            <div className="text-gray-400 text-center">
              <div className="text-6xl">📚</div>
              <p>Sem capa</p>
            </div>
          )}
        </div>
        {/* Informações */}
        <div className="flex-1 space-y-3">
          <h1 className="text-2xl font-bold">{book.title}</h1>
          <p className="text-gray-600">por {book.author}</p>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary">{book.genre}</Badge>
            <Badge variant="secondary">{book.status}</Badge>
          </div>
          <p className="text-gray-700">{book.synopsis}</p>

          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <p>
              <span className="font-semibold">Ano:</span> {book.year}
            </p>
            <p>
              <span className="font-semibold">Páginas:</span> {book.pages}
            </p>
            <p>
              <span className="font-semibold">ISBN:</span> {book.isbn}
            </p>
            <p>
              <span className="font-semibold">Classificação:</span>{" "}
              {book.rating || "–"}
            </p>
            <p>
              <span className="font-semibold">Notas:</span> {book.notes || "–"}
            </p>
            <p>
              <span className="font-semibold">Página atual:</span>{" "}
              {book.currentPage || "–"}
            </p>
            <p>
              <span className="font-semibold">Início:</span>{" "}
              {book.dateStarted || "–"}
            </p>
            <p>
              <span className="font-semibold">Conclusão:</span>{" "}
              {book.dateCompleted || "–"}
            </p>
            <p>
              <span className="font-semibold">Adicionado em:</span>{" "}
              {book.dateAdded || "–"}
            </p>
          </div>
          <div className="flex text-red-600 justify-end  rounded ">
            <button
              className="p-2 bg-red-600 text-white rounded"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Botão de voltar */}
      <Link
        href="/biblioteca"
        className="inline-block bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
      >
        Voltar à Biblioteca
      </Link>
    </div>
  );
}
