import { databases, storage } from "@/appwrite";
import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;

  searchString: string;
  setSearchString: (searchString: string) => void;

  deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set((state) => ({ board }));
  },
  setBoardState: (board) => set((state) => ({ board })),

  deleteTask: async (taskIndex, todo, id) => {
    const newColumns = new Map(get().board.columns);
    //Delete todoId from newColumns
    newColumns.get(id)?.todos.splice(taskIndex, 1);

    set((state) => ({ board: { columns: newColumns } }));

    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fieldId);
    }
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    );
  },

  updateTodoInDB: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      { title: todo.title, status: columnId }
    );
  },
  searchString: "",
  setSearchString: (searchString) => {
    set((state) => ({ searchString }));
  },
}));
