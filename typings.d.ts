interface Board{
    columns: Map<TypedColumn, Column>
}

// Define the TypedColumn an Enum with three possible values:
type TypedColumn = "todo" | "inprogress" | "done";

//Define the Column interface:
interface Column{
    id:TypedColumn,
    todos: Todo[],
}

//Define the Todo interface
interface Todo{
    $id: string,
    $createdAt: string, //Timestamp
    title : string,
    status: TypedColumn,
    image?:Image //image is optional
}

interface Image {
    bucketId: string, //id of the bucket
    fileId: string
}