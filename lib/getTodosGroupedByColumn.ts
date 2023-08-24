import { databases } from "@/appwrite"

export const getTodosGroupedByColumn = async ()=>{
    //Pull from the appwrite database:
    const data = await databases.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!);

        console.log('The data from appwrite>>>', data);
        const todos = data.documents;

        console.log('The todos>>>', todos)
        // Now, we need to rearrange the data into a Map
        // That is, we'll reduce the todos array to a map object
        // param acc acumulated value
        // param todo the current value
        // the new Map<typeColumn, Column> is the initial value
        const columns = todos.reduce((acc, todo)=>{
            if(!acc.get(todo.status)){
                //Create a key inside of that map
                acc.set(todo.status,{
                    id:todo.status,
                    todos:[]
                })
            }
            // Push the information to the database.
            acc.get(todo.status)!.todos.push({
                $id: todo.$id,
                $createdAt: todo.$createdAt,
                title: todo.title,
                status: todo.status,
                // Get the image only if it exists on the todo. 
                // To accomplish this we use the spread (...) operator
                ...(todo.image && {image: JSON.parse(todo.image)})
            });

            return acc;
        }, new Map<TypedColumn, Column>());

        console.log('The mapped columns>>>', columns)
        // If columns doesn't have inprogress, todo, and done add them with empty todos
        // Therefore, we'll always render three columns
        // Create an array with all of the different typed columns:
        const columnTypes: TypedColumn[] = ["todo", "inprogress", "done"];
        // Be careful not to use for...in instead of for...of. The for...in statement iterates over all
        // enumerable string properties of an object ignoring properties keyed by symbols. Whereas the 
        // for...of statement executes a loop that operates on a sequence of values sourced from an iterable 
        // object.
        // See documentation: at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in
        // and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
        // In summary for...in is to iterate over properties of an object whereas for...of is to iterate over
        // the elements of a given array.
        for (const columnType of columnTypes){
            if(!columns.get(columnType)){
                columns.set(columnType,{
                    id:columnType,
                    todos:[],
                });
            }
        }

        console.log('the columns with added ones:>>>', columns);

        // Now, sort the columns:
        const sortedColumns = new Map(
            // this is the same as Array.from... but in IE6: we use the spread out operator:
            // columns.entries() --> Get all the key value pairs and create an array from it
            Array.from(columns.entries()).sort((a,b)=>(
                // Here the comparisson operation and substract will be between srings
                columnTypes.indexOf(a[0])-columnTypes.indexOf(b[0])
            ))
        );

        // Now, create a board with the sorted columns in it.
        const board: Board = {
            columns:sortedColumns
        }

        return board;
}