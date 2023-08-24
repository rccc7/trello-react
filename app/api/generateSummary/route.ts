import openai from "@/openai";
import { NextResponse } from "next/server";

// Here, the todos are passed inside the request.
export async function POST(request:Request) {
    // todos in the body of the POST request
    const {todos} = await request.json();
    console.log('the todos to POST>>>',todos);

    //Comunicate with openAI GPT
    const response = await openai.createChatCompletion({
        model:"gpt-3.5-turbo", //If we have access to, we can change to 'gpt-4',
        temperature:0.8,
        n:1, // This tells chatGPT to only give one response back.
        stream:false,
        messages:[
            {
                role:"system",//Pretending to be the system
                content:`When responding, welmcome the user always as Mr. RCCC and say welcome to the React-Trello todo App! 
                Limit the response to 200 characters`,
            },
            {
                role:"user", //Pretending to be the user.
                content:`Hi there, provide a summary of the following todos. Count how many todos are in each category
                such as To do, in progress, and done, then tell the user to have a productive day! Here's the data: 
                ${JSON.stringify(todos)}`,
            },
        ],
    });

    // Destructure the data from the response
    const {data} = response;
    console.log("The Data from response: >>>", data);
    console.log('The Message: >>>', data.choices[0].message);
    // Since we specified that n=1 at response properties, choices will always be an array of one element.
    return NextResponse.json(data.choices[0].message);
}