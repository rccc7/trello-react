import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import TodoCard from "./TodoCard";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useBoardStore } from "@/store/BoardStore";
import { useModalStore } from "@/store/ModalStore";

type Props = {
  id: TypedColumn;
  todos: Todo[];
  index: number;
};

// This mapping function turns the key names of the TypedColumn into a readable UI text to be displayed in the UI.
// The parameters must be a valid key (todo, or inprogress or done) of the TypedColumn
const idToColumnText: {
  [key in TypedColumn]: string;
} = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};
function Column({ id, todos, index }: Props) {
  // Get the searchString from the storage:
  // We use an array because we are going to need it afterwards
  const [searchString, setNewTaskType] = useBoardStore((state) => [
    state.searchString,
    state.setNewTaskType,
  ]);

  // Get the openModal from ModalStore
  const openModal = useModalStore((state) => state.openModal);

  const handleAddTodo = () => {
    // First set the new task type before opening the modal.
    // Set the new task type to the "id" so that when the modal opens, the default task
    // type will be selected based on this id.
    setNewTaskType(id);
    // Call the openModal 👆👆👆 function.
    openModal();
  };
  return (
    // Here, dragableId and index are mandatory properties:
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        // The first child of the dragable must have the provided spread props and the  innerRef.
        // We must use the provided in the first element's properties everythime we receive the provided
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {/* Render droppable todos in the column. */}
          <Droppable droppableId={index.toString()} type="card">
            {
              // Here, the snapshot will tell us when we are dragging over
              (provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  //   {...provided.dragHandleProps} //--> The type DroppableProvided does not have dragHandleProps
                  ref={provided.innerRef}
                  className={`p-2 rounded-2xl shadow-sm ${
                    snapshot.isDraggingOver ? "bg-green-200" : "bg-white/50"
                  }`}
                >
                  <h2 className="flex justify-between font-bold text-xl p-2">
                    {idToColumnText[id]}{" "}
                    <span className="text-gray-500 bg-gray-200 rounded-full  px-2 py-2 text-sm font-normal">
                      {
                        // If there is no searchString then show the todos.length, otherwise filter the todos with the
                        // searchString and count the items that meet the filter condition.
                        !searchString
                          ? todos.length
                          : todos.filter((todo) =>
                              todo.title
                                .toLowerCase()
                                .includes(searchString.toLocaleLowerCase())
                            ).length
                      }
                    </span>
                  </h2>
                  <div className="space-y-2">
                    {todos.map((todo, index) => {
                      // Do not render this todo if the searchString exists and if the
                      // todo title does not include the searchString
                      if (
                        searchString &&
                        !todo.title
                          .toLowerCase()
                          .includes(searchString.toLowerCase())
                      ) {
                        return null;
                      }
                      return (
                        <Draggable
                          key={todo.$id}
                          draggableId={todo.$id}
                          index={index}
                        >
                          {(provided) => (
                            // Remember, when we have a provided parent, we have to pass the draggable props as parameters
                            <TodoCard
                              todo={todo}
                              index={index}
                              id={id}
                              innerRef={provided.innerRef}
                              draggableProps={provided.draggableProps}
                              dragHandleProps={provided.dragHandleProps}
                            ></TodoCard>
                          )}
                        </Draggable>
                      );
                    })}
                    {/* provided.placeholder: the space which will be used when dragging elements  */}
                    {provided.placeholder}
                    <div className="flex items-end justify-end p-2">
                      <button
                        // onClick={openModal}
                        onClick={handleAddTodo}
                        className="text-green-500 hover:text-green-600"
                      >
                        <PlusCircleIcon className="w-10 h-10" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            }
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}

export default Column;
