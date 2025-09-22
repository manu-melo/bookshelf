import { useState, useEffect } from 'react';

// Hook personalizado para gerenciar localStorage
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Estado para armazenar o valor
  // Passa a função de estado inicial para useState para que a lógica seja executada apenas uma vez
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      // Obtém do localStorage pela chave
      const item = window.localStorage.getItem(key);
      // Analisa o JSON armazenado ou se nenhum retorna o valor inicial
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Se erro também retorna valor inicial
      console.log(error);
      return initialValue;
    }
  });

  // Retorna uma versão encapsulada da função setState que persiste o novo valor no localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permite que o valor seja uma função para que tenhamos a mesma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Salva no estado
      setStoredValue(valueToStore);
      // Salva no localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // Um erro mais avançado seria melhor
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}