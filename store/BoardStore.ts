import { ID, databases, storage } from "@/appwrite";
import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import uploadImage from "@/lib/uploadImage";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;

  searchString: string;
  setSearchString: (searchString: string) => void;

  deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;

  newTaskInput: string;
  setNewTaskInput: (input: string) => void;

  newTaskType: TypedColumn;
  setNewTaskType: (columnId: TypedColumn) => void;

  image: File | null;
  setImage: (image: File | null) => void;

  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
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
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
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

  newTaskInput: "",
  setNewTaskInput: (input) => {
    set((state) => ({ newTaskInput: input }));
  },

  newTaskType: "todo",
  setNewTaskType: (input) => {
    set((state) => ({ newTaskType: input }));
  },

  image: null,
  setImage: (image) => {
    set((state) => ({ image }));
  },

  addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
    let file: Image | undefined;

    if (image) {
      const fileUploadeed = await uploadImage(image);
      if (fileUploadeed) {
        file = {
          bucketId: fileUploadeed.bucketId,
          fileId: fileUploadeed.$id,
        };
      }
    }

    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        ...(file && { image: JSON.stringify(file) }),
      }
    );

    set((state) => ({ newTaskInput: "" }));

    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        //includes image if exists
        ...(file && { image: file }),
      };

      const column = newColumns.get(columnId);

      if (!column) {
        newColumns.set(columnId, { id: columnId, todos: [newTodo] });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }

      return { board: { columns: newColumns } };
    });
  },
}));
