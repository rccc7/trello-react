"use client";
import { useBoardStore } from "@/store/BoardStore";
import { useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Column from "./Column";

function Board() {
  // here, we obtain the board and getBoard from the state
  const [board, getBoard, setBoardState, updateTodoInDB] = useBoardStore(
    (state) => [
      state.board,
      state.getBoard,
      state.setBoardState,
      state.updateTodoInDB,
    ]
  );
  useEffect(() => {
    // getBoard(); fetch the board and use it in any point of our app.
    getBoard();
  }, [getBoard]);

  console.log("The board>>>", board);

  // This function will be triggered whenever the user drops the draggable component inside this board.
  // In other words, this function will handle every drop event
  const handleOnDragEnd = (result: DropResult) => {
    // Destructure the result in order to get the source, destination and the type.
    const { destination, source, type } = result;

    console.log("The source>>>", source);
    console.log("The destination>>>", destination);
    console.log("The type >>>", type);

    //Check if the user dragged outside the board:
    if (!destination) return;

    // Handle the drag and drop of columns from an old location to a new location and update the state
    // with the new location
    if (type === "column") {
      const entries = Array.from(board.columns.entries());
      // The removed is the item which is being removed from its original location and dragged to a new one.
      // ES6 desctructuring the array:
      // It is the same as "const removed = entries.splice(source.index,1)[0];"
      const [removed] = entries.splice(source.index, 1);
      // Nos push the removed item into the entries array in the destination location:
      entries.splice(destination.index, 0, removed);
      // Now, create a new map with the rearanged columns:
      const rearrangedColumns = new Map(entries);
      // Now set the board state to the new state:
      // Here, we use the spread operator to keep everything in the current state and only replace the columns
      // with the new rearrangedColumns.
      setBoardState({ ...board, columns: rearrangedColumns });
    }

    // The following steps are needed as the indexes are stored as numbers 0,1,2, etc. instead of id's with DND library
    // First create a copy of the columns:
    const columns = Array.from(board.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const finishColIndex = columns[Number(destination.droppableId)];

    console.log(
      "The start and finish columns: >>>",
      startColIndex,
      finishColIndex,
      "The number:>>>",
      Number(source.droppableId),
      source.droppableId
    );

    // Source column
    const startCol: Column = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    };
    // Destination Column
    const finishCol: Column = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos,
    };

    console.log(
      "The start column:>>",
      startCol,
      " The finish column:>>>",
      finishCol
    );

    // If for whatever reason we don't get the startCol or the finishCol then return;
    if (!startCol || !finishCol) return;

    // If we drag and drop in the same location, we should do nothing as well
    if (source.index === destination.index && startCol === finishCol) return;

    //
    const newTodos = startCol.todos;
    // Remove the dragged todo from the origin
    const [todoMoved] = newTodos.splice(source.index, 1);

    // If we are dragging and dropping in the same column:
    if (startCol.id === finishCol.id) {
      // Same column task drag
      // Only move the todo in the same column. Push the new todo into its destination index
      newTodos.splice(destination.index, 0, todoMoved);
      // Create a new column object.
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };
      // Create a copy of the board columns
      const newColumns = new Map(board.columns);
      // Add the new column to the newly created columns map.
      newColumns.set(startCol.id, newCol);

      // Now set the board state by keeping the other properties and only updating the columns
      // with the newColumns object.
      setBoardState({ ...board, columns: newColumns });
    } else {
      // Dragging to another column.
      // now we need to modify the start column and the finish column.
      // Make a copy of the finishtodos and splice it
      const finishTodos = Array.from(finishCol.todos);
      finishTodos.splice(destination.index, 0, todoMoved);

      const newColumns = new Map(board.columns);
      const newCol = { id: startCol.id, todos: newTodos };

      newColumns.set(startCol.id, newCol);
      newColumns.set(finishCol.id, {
        id: finishCol.id,
        todos: finishTodos,
      });

      // Update the DB.
      updateTodoInDB(todoMoved, finishCol.id);

      // Now set the board state by keeping the other properties intact and only updating the columns.
      setBoardState({ ...board, columns: newColumns });
    }
  };
  return (
    // <h1>Hello there</h1>
    // here, the onDragEnd function parameter is mandatory
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          // IMPORTANT NOTE: Whenever we have a Dropable, we have to spread some props inside the first child of the Dropable:
          // {...provided.droppabeProps} ref={provided.innerRef}
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
          >
            {
              // REndering of all the columns
              // Here, we are destructuring the todo into [id, column]
              Array.from(board.columns.entries()).map(([id, column], index) => (
                <Column key={id} id={id} todos={column.todos} index={index} />
              ))
            }
            {/* <p>hello there</p>
            <p>heyyy</p> */}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Board;
