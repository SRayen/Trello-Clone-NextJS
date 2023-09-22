const formatTodosForAI = (board: Board) => {
  const todos = Array.from(board.columns);

  const flatArray = todos.reduce((map, [key, value]) => {
    map[key] = value.todos;
    return map;
  }, {} as { [key in TypedColumn]: Todo[] });

  //reduce to key:value (length)
  const flatArrayCounted = Object.entries(flatArray).reduce(
    (map, [key, value]) => {
      //rq: as here to tell TS that i now more about the type of the value than it does
      map[key as TypedColumn] = value.length;
      return map;
    },
    {} as { [key in TypedColumn]: number }
  );
  return flatArrayCounted;
};

export default formatTodosForAI
