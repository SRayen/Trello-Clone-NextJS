"use client";

import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { useEffect } from "react";
import { useBoardStore } from "@/store/BoardStore";
import Column from "./Column";

export default function Board() {
  const [board, getBoard, setBoardState, updateTodoInDB] = useBoardStore(
    (state) => [
      state.board,
      state.getBoard,
      state.setBoardState,
      state.updateTodoInDB,
    ]
  );
  useEffect(() => {
    getBoard();
  }, [getBoard]);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;
    if (type === "column") {
      const entries = Array.from(board.columns);
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);
      const rearrangedColumns = new Map(entries);
      setBoardState({ ...board, columns: rearrangedColumns });
    }

    if (type === "card") {
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }
      const entries = Array.from(board.columns);

      // const [TypedCol, { id, todos }] = entries[Number(source.droppableId)];
      const T = entries[Number(source.droppableId)][1].todos;

      let [removed] = T.splice(source.index, 1);

      const board_destination = entries[Number(destination.droppableId)];
      board_destination[1].todos.splice(destination.index, 0, removed);

      const rearrangedColumns = new Map(entries);
      setBoardState({ ...board, columns: rearrangedColumns });
      updateTodoInDB(removed, board_destination[0]);
    }
  };
  {
    let t = Array.from(board.columns);
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mw-auto `}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {Array.from(board.columns).map(([id, column], index) => (
              <Column key={id} id={id} todos={column.todos} index={index} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
