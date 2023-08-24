import { ID, databases, storage } from '@/appwrite';
import Column from '@/components/Column';
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';
import uploadImage from '@/lib/uploadImage';
import { create } from 'zustand'
// For more info on how to manage state with zustand with TypeScript head over to https://www.npmjs.com/package/zustand#typescript-usage

// Create the interface BoardState
interface BoardState { 
    board: Board;
    getBoard: ()=>void;
    setBoardState:(board: Board)=>void;
    updateTodoInDB: (todo: Todo, columnId: TypedColumn)=>void;
    // This piece of state will be used in the Modal component when creating a new task
    newTaskInput: string;
    setNewTaskInput:(input: string)=>void;
    // The search string which will be used to search among the Board's todos.
    // Define the newTaskType property to be used in the TaskTypeRadioGroup (for creating new tasks)
    newTaskType: TypedColumn;
    setNewTaskType:(columnId: TypedColumn)=>void;
    // The searchString that stores the data writen in the Header component's Search input
    searchString: string;
    setSearchString: (searchString: string)=>void;
    // Add Task: Push a new task to the database
    addTask: (todo: string, columnId: TypedColumn, image?: File | null)=>void;
    //Delete todo
    deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn)=>void;
    //The image can be either a File or null
    image: File | null;
    setImage: (image:File|null)=>void;

    
}

// Here, set and get are zustand's implementation to update and get the state.
export const useBoardStore = create<BoardState>((set, get)=>({
    board:{
        columns: new Map<TypedColumn, Column>()
    },
    // The search string which will be used to search among the Board's todos.
    searchString:"",
    newTaskInput:"",
    newTaskType:"todo",
    image: null,
    setSearchString: (searchString)=>set({searchString}),
    setNewTaskInput: (input:string)=>set({newTaskInput:input}),
    setNewTaskType:(columnId:TypedColumn)=>set({newTaskType:columnId}),
    setImage: (image: File|null)=>set({image}),
    // This function get the Board's state from database
    getBoard: async ()=>{
        // This will return:
        // {
        //  todo: [..,..,..],
        // inprogress: [...,...,...]
        // }
        const board = await getTodosGroupedByColumn();
        // Now, set the global state for the board:
        set({board})
    },
    // This function sets the board's state to the new state passed as paramenter
    // In other words, this will take the board and set the variable in the global state.
    setBoardState: (board)=>set({board}),

    // This function implements the updating of the column in the DB.
    updateTodoInDB: async (todo, columnId) => {
        await databases.updateDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id,
            // here we pass the information (the document) to update:
            {
                title: todo.title,
                status: columnId,
            }
        )
    },
    
    // Push new task to the database with the image uploading optional
    addTask: async(todo: string, columnId: TypedColumn, image?:File|null)=>{
        let file: Image | undefined;

        // Check whether the image is null. If it is defined hen save to the database.
        if(image){
            const fileUploaded = await uploadImage(image);
            if(fileUploaded){
                // If the file was uploaded successfully to appwrite then take it to our file variable
                file={
                    bucketId: fileUploaded.bucketId,
                    fileId: fileUploaded.$id,
                };
            }
        }

        //Now that we uploaded the file, create a new document (in appwrite).
        // Destructure to obtain only the id back from the just created document.
       const {$id} = await databases.createDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            ID.unique(),
            {
                title:todo,
                status:columnId,
                // include image if it exists
                ...(file&&{image:JSON.stringify(file)}),
            }
        );

        // Set the newTaskInput to "" so that next time the modal is open the input will be empty
        set({newTaskInput:""});

        // Now, set the state by adding the new todo the current column & board.
        set((state)=>{
            // Copy all the columns...
            const newColumns = new Map(state.board.columns)
            //Create the new todo to add to the respective column:
            const newTodo: Todo={
                $id,
                $createdAt: new Date().toISOString(),
                title: todo,
                status: columnId,
                //Include image if it exists
                ...(file && {image: file}),
            };

            // Get the column that we must enter the new todo
            const column = newColumns.get(columnId);
            if(!column){
                newColumns.set(columnId, {
                    id: columnId,
                    todos:[newTodo],
                });
            }else{
                newColumns.get(columnId)?.todos.push(newTodo);
            }

            return {
                // Return the board itself with the (copy of) new columns
                board: {
                    columns:newColumns,
                }
            }
        })

    },

    deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn)=>{
        //First make a copy of the current map
        // Here, get is zustand's implementation to read the state.
        // For more info about get head over to: https://docs.pmnd.rs/zustand/recipes/recipes#read-from-state-in-actions
        const newColumns = new Map(get().board.columns);
        //Delete the todoId from newColumns
        newColumns.get(id)?.todos.splice(taskIndex, 1);

        //Now update the state:
        set({board:{columns: newColumns}});
        // If there is an image, delete it:
        if(todo.image){
            await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
        }
        // And now, delete from the database
        await databases.deleteDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id
        )
    },

    
}))