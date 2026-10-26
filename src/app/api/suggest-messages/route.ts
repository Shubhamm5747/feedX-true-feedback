import { NextResponse } from "next/server";

export const runtime = "edge";

const preStoredMessages = [
  "What's your biggest fear?",
  "If you could travel anywhere right now, where would it be?",
  "What's a secret you've never told anyone?",
  "Who is your secret crush?",
  "What's the most embarrassing thing you've ever done?",
  "If you had a million dollars, what's the first thing you'd buy?",
  "What's your favorite childhood memory?",
  "Do you believe in aliens?",
  "What's your guilty pleasure song?",
  "What is your dream job?",
  "If you could have any superpower, what would it be?",
  "What's the weirdest dream you've ever had?",
  "What's the best advice you've ever received?",
  "Who do you look up to the most?",
  "What's your favorite book or movie?",
  "If you could meet anyone, dead or alive, who would it be?",
  "What's a talent you wish you had?",
  "What is something you're proud of?",
  "Do you have any hidden talents?",
  "What's the most spontaneous thing you've ever done?",
  "What's your favorite way to relax?",
  "If you were an animal, what would you be?",
  "What's your favorite food?",
  "What is a habit you want to break?",
  "What's the most adventurous thing you've done?",
  "Do you believe in ghosts?",
  "What is your idea of a perfect date?",
  "What's a controversial opinion you hold?",
  "What's your biggest pet peeve?",
  "What is the most beautiful place you've ever seen?",
  "What's your favorite holiday?",
  "What is a skill you're currently learning?",
  "What's the best gift you've ever given?",
  "What's the worst movie you've ever seen?",
  "If you could change one thing about yourself, what would it be?",
  "What's the most interesting fact you know?",
  "What's your favorite quote?",
  "What is something you can't live without?",
  "What's a goal you have for this year?",
  "What is your favorite time of day?"
];

export async function POST(req: Request) {
  try {
    // Select 3 random unique messages
    const shuffled = [...preStoredMessages].sort(() => 0.5 - Math.random());
    const selectedMessages = shuffled.slice(0, 3).join(" || ");

    // Return the response as JSON
    return NextResponse.json(
      { text: selectedMessages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating suggestions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/*
// ============================================================================
// OPTIMIZED OPENAI STREAMING IMPLEMENTATION (Uncomment when OpenAI key is ready)
// ============================================================================
// To use this:
// 1. Add `import OpenAI from "openai";` at the top of this file
// 2. Set OPENAI_API_KEY in your .env file
// 3. Comment out the pre-stored messages POST handler above and uncomment this POST handler.

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(req: Request) {
//   try {
//     const stream = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a helpful assistant. Generate exactly 3 interesting, random, and engaging questions that someone could ask another person anonymously. Format your response strictly as a single string where each question is separated by '||'. Do not include any other text, quotes, or numbers.",
//         },
//       ],
//       stream: true,
//     });

//     // Transform OpenAI's chunk stream into a clean, plain text stream for the client
//     const textStream = new ReadableStream({
//       async start(controller) {
//         const encoder = new TextEncoder();
//         try {
//           for await (const chunk of stream) {
//             const text = chunk.choices[0]?.delta?.content || "";
//             if (text) {
//               controller.enqueue(encoder.encode(text));
//             }
//           }
//         } catch (err) {
//           controller.error(err);
//         } finally {
//           controller.close();
//         }
//       },
//     });

//     return new Response(textStream, {
//       headers: {
//         "Content-Type": "text/plain; charset=utf-8",
//         "Cache-Control": "no-cache, no-transform",
//       },
//     });
//   } catch (error) {
//     console.error("OpenAI Error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
*/
