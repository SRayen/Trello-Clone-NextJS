import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  //todos in the body of the POST req
  const { todos } = await request.json();


  //Communicate with openAI GPT
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0.8,
    n: 1, //1 response
    messages: [
      {
        role: "system",
        content:
          "When responding, Welcome the user always as Mr.Rayen and say welcome to the Trello Clone App!Limit the response to 200 characters ",
      },
      {
        role: "user",
        content: `Hi, provide a summary of the following todos. Count how many todos are in each category such as To do, in progress and done, then tell the user to have a productive day! Here's the data:${JSON.stringify(
          todos
        )}`,
      },
    ],
  });

  const data = response;

  return NextResponse.json(data.choices[0].message);
}
