const formatTodosForAI = (board:Board)=>{
    // Create a copy of the board columns entries
    const todos = Array.from(board.columns.entries());

    // Reduce the results into a flat array.
    const flatArray = todos.reduce((map, [key, value])=>{
        map[key] = value.todos;
        return map;
    }, {} as {[key in TypedColumn]: Todo[]});

    //Now, reduce to key: value(length)
    // For mor info about iterating through an object visit: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries#iterating_through_an_object
    const flatArrayCounted = Object.entries(flatArray).reduce(
        (map, [key, value])=>{
            map[key as TypedColumn] = value.length;
            return map;
        },
        {} as {[key in TypedColumn]: number}
    );

    console.log('the original board>>>', board);
    console.log('The todos>>>', todos);
    console.log('The flatArray>>>', flatArray);
    console.log('the flatArrayCounted>>>', flatArrayCounted);

    return flatArrayCounted;
}

export default formatTodosForAI;