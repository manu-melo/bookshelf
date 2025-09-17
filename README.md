# BookShelf Dashboard

Um dashboard para gerenciamento de biblioteca pessoal, inspirado no design moderno e responsivo.

## 🚀 Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Recharts** - Biblioteca de gráficos para React
- **Lucide React** - Ícones SVG

## 📊 Funcionalidades do Dashboard

### Estatísticas Principais

- **Total de Livros**: Mostra o número total de livros na biblioteca
- **Livros Lidos**: Percentual de livros já lidos
- **Lendo Atualmente**: Livros em progresso
- **Avaliação Média**: Rating médio dos livros avaliados

### Visualizações

- **Gráfico de Pizza**: Status de leitura (Lidos, Lendo, Abandonados, Para Ler)
- **Gráfico de Barras**: Top 5 gêneros favoritos
- **Barra de Progresso**: Progresso total de leitura por páginas
- **Atividade Recente**: Últimos livros adicionados/atualizados

## 🛠️ Como Executar

1. **Instalar dependências**:

   ```bash
   npm install
   ```

2. **Executar em modo de desenvolvimento**:

   ```bash
   npm run dev
   ```

3. **Acessar o projeto**:
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
└── components/
    ├── Dashboard.tsx
    ├── StatsCard.tsx
    ├── ReadingStatusChart.tsx
    ├── FavoriteGenresChart.tsx
    ├── ReadingProgress.tsx
    └── RecentActivity.tsx
```

## 🎨 Design

O dashboard foi desenvolvido baseado no design das imagens fornecidas, com:

- Layout responsivo
- Cards informativos
- Gráficos interativos
- Interface limpa e moderna
- Tema claro com tons de cinza e azul

## 📝 Status Atual

Este é um dashboard inicial com dados mockados. As próximas etapas incluirão:

- Integração com banco de dados
- Sistema de autenticação
- CRUD completo de livros
- Sistema de avaliações
- Relatórios avançados

## 🔧 Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Gera build de produção
- `npm run start` - Executa build de produção
- `npm run lint` - Executa linting do código
