"use client";

import { GENRES } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

interface GenreFilterProps {
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
}

export function GenreFilter({
  selectedGenre,
  onGenreChange,
}: GenreFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <Filter className="w-4 h-4 text-gray-500" />
      <Select value={selectedGenre} onValueChange={onGenreChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filtrar por gênero" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos os gêneros</SelectItem>
          {GENRES.map((genre) => (
            <SelectItem key={genre} value={genre}>
              {genre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
