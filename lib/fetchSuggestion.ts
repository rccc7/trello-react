import formatTodosForAI from "./formatTodosForAI";

const fetchSuggestion = async (board: Board)=>{
    // First, format the todos to send to chatGPT:
    const todos = formatTodosForAI(board);
    console.log('The formated todos for chatGPT>>> ', todos);
    const res = await fetch("api/generateSummary",{
        method:"POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify({todos}),
    });

    const GPTData = await res.json();
    console.log('The GPTData>>>', GPTData)
    //Destructure the GPTData
    const {content}= GPTData;

    return content;
}

export default fetchSuggestion;