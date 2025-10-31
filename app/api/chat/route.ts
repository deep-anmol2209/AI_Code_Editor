import { NextRequest, NextResponse } from "next/server";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  message: string;
  history: ChatMessage[];
}

async function generateAIResponse(messages: ChatMessage[]): Promise<string> {
  console.log("🔹 [generateAIResponse] Called with messages:", JSON.stringify(messages, null, 2));

  const systemPrompt = `You are a helpful AI coding assistant. You help developers with:
  - code explanations and debugging
  - best practices and architecture advice
  - writing clean, efficient code
  - troubleshooting errors
  - code reviews and optimizations`;

  const fullMessages = [
    { role: "user", content: systemPrompt },
    ...messages,
  ];
  console.log("🔹 [generateAIResponse] Full message list prepared:", fullMessages.length);

  // Map roles correctly for Gemini API
  const geminiMessages = fullMessages.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));
  console.log("🔹 [generateAIResponse] Gemini formatted messages:", JSON.stringify(geminiMessages, null, 2));

  try {
    console.log(" [generateAIResponse] Sending request to Gemini API...");
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY!,
        },
        body: JSON.stringify({
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
            topP: 0.9,
          },
        }),
      }
    );

    console.log(" [generateAIResponse] Response received. Status:", response.status);
    const data = await response.json();
    console.log(" [generateAIResponse] Parsed response JSON:", JSON.stringify(data, null, 2));

    if (data.error) {
      console.error(" [generateAIResponse] Gemini API error:", data.error);
      return `Gemini API error: ${data.error.message}`;
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini model";
    console.log("[generateAIResponse] Final AI text:", text.slice(0, 100) + "...");

    return text.trim();
  } catch (error) {
    console.error(" [generateAIResponse] Error generating AI response:", error);
    return "An error occurred while generating the response.";
  }
}

export async function POST(req: NextRequest) {
  console.log("[POST] API route hit at:", new Date().toISOString());

  try {
    console.log("🔹 [POST] Reading request body...");
    const body: ChatRequest = await req.json();
    console.log(" [POST] Body received:", JSON.stringify(body, null, 2));

    const { message, history = [] } = body;

    if (!message || typeof message !== "string") {
      console.warn(" [POST] Invalid message input:", message);
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    console.log(" [POST] Message valid. Length:", message.length);
    console.log(" [POST] History received with length:", history?.length ?? 0);

    const validHistory = Array.isArray(history)
      ? history.filter(
          (msg) =>
            msg &&
            typeof msg === "object" &&
            typeof msg.role === "string" &&
            typeof msg.content === "string" &&
            ["user", "assistant"].includes(msg.role)
        )
      : [];

    console.log(" [POST] Validated history count:", validHistory.length);

    const recentHistory = validHistory.slice(-10);
    console.log(" [POST] Trimmed to recent 10 messages");

    const messages: ChatMessage[] = [
      ...recentHistory,
      { role: "user", content: message },
    ];

    console.log(" [POST] Final messages sent to Gemini:", JSON.stringify(messages, null, 2));

    const aiResponse = await generateAIResponse(messages);

    console.log(" [POST] AI response received:", aiResponse.slice(0, 100) + "...");

    const result = {
      response: aiResponse,
      timeStamp: new Date().toISOString(),
    };
    console.log(" [POST] Sending final response:", JSON.stringify(result, null, 2));

    return NextResponse.json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(" [POST] Fatal error:", errorMessage);

    return NextResponse.json(
      {
        error: "Failed to generate AI response",
        details: errorMessage,
        timeStamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
