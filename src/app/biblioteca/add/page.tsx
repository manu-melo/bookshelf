"use client";

import { useState } from "react";
import { useBooksStorage } from "@/hooks/useBooksStorage";
import { GENRES, ReadingStatus } from "@/types";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

export default function AddBookPage() {
  const { addBook } = useBooksStorage();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pages, setPages] = useState<number | "">("");
  const [currentPage, setCurrentPage] = useState<number | "">("");
  const [status, setStatus] = useState<ReadingStatus>(
    ReadingStatus.QUERO_LER
  );
  const [genre, setGenre] = useState<string>(GENRES[0]);
  const [isbn, setIsbn] = useState("");
  const [cover, setCover] = useState("");
  const [rating, setRating] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [synopsis, setSynopsis] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);


  const totalFields = 10;
  const filledFields = [
    title,
    author,
    pages,
    currentPage,
    status,
    genre,
    isbn,
    cover,
    rating,
    notes,
  ].filter((f) => f !== "" && f !== undefined && f !== null).length;
  const progress = (filledFields / totalFields) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !author.trim()) {
      alert("Os campos Título e Autor são obrigatórios.");
      return;
    }

    setIsSubmitting(true);

    const newBook = {
      title,
      author,
      pages: pages ? Number(pages) : undefined,
      currentPage: currentPage ? Number(currentPage) : undefined,
      status,
      genre,
      isbn,
      cover,
      rating: rating ? Number(rating) : undefined,
      notes,
      synopsis,
    };

    addBook(newBook);

    setTitle("");
    setAuthor("");
    setPages("");
    setCurrentPage("");
    setStatus(ReadingStatus.QUERO_LER);
    setGenre(GENRES[0]);
    setIsbn("");
    setCover("");
    setRating("");
    setNotes("");
    setSynopsis("");
    setIsSubmitting(false);

    alert("Livro adicionado com sucesso!");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Adicionar Novo Livro</h1>

      <Progress value={progress} className="mb-4" />

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Input
          placeholder="Autor"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <Input
          type="number"
          placeholder="Total de páginas"
          value={pages}
          onChange={(e) => setPages(e.target.value ? Number(e.target.value) : "")}
        />
        <Input
          type="number"
          placeholder="Página atual"
          value={currentPage}
          onChange={(e) =>
            setCurrentPage(e.target.value ? Number(e.target.value) : "")
          }
        />

        {/* Select de Status */}
        <Select value={status} onValueChange={(v) => setStatus(v as ReadingStatus)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(ReadingStatus).map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Select de Gênero */}
        <Select value={genre} onValueChange={(v) => setGenre(v)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o gênero" />
          </SelectTrigger>
          <SelectContent>
            {GENRES.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
        />
        <Input
          placeholder="URL da capa"
          value={cover}
          onChange={(e) => setCover(e.target.value)}
        />
        {cover && (
          <img
            src={cover}
            alt="Preview da capa"
            className="w-32 h-48 object-cover rounded mt-2"
          />
        )}
        <Input
          type="number"
          placeholder="Avaliação (1-5)"
          value={rating}
          onChange={(e) => setRating(e.target.value ? Number(e.target.value) : "")}
          min={1}
          max={5}
        />
        <Input
          placeholder="Notas pessoais"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <Input
          placeholder="Sinopse"
          value={synopsis}
          onChange={(e) => setSynopsis(e.target.value)}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adicionando..." : "Adicionar Livro"}
        </Button>
      </form>
    </div>
  );
}