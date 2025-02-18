import { NextRequest, NextResponse } from "next/server";

// Dummy database
let userData = { balance: 0, transactions: [] };

// Function Helpers
function add(amount: number) {
  userData.balance += amount;
  userData.transactions.push({ type: "credit", amount });
  return `Added ₹${amount} to your balance.`;
}

function subtract(amount: number) {
  userData.balance -= amount;
  userData.transactions.push({ type: "debit", amount });
  return `Deducted ₹${amount} from your balance.`;
}

function getData() {
  return userData;
}

async function callMistralAI(prompt: string) {
  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral",
        prompt,
        stream: false,
      }),
    });

    const textData = await response.text();
    console.log("Raw AI Response:", textData);

    let data;
    try {
      data = JSON.parse(textData);
    } catch (err) {
      console.error("JSON Parse Error:", err);
      return { error: "Invalid AI response format" };
    }

    return data.response || "Error getting response";
  } catch (error) {
    console.error("Mistral AI Error:", error);
    return { error: "AI service unavailable" };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body?.message;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Step 1: AI Categorization
    const categorizationPrompt = `
    Analyze the user query and classify it:
    1. Direct Response (e.g., "Hello")
    2. Function Call Only (e.g., "Add 40" -> function: add, amount: 40)
    3. Function Call + AI Analysis (e.g., "Sum my expenses" -> function: getData)
    
    Query: "${message}"
    
    Reply in JSON format:
    {
      "category": 1 | 2 | 3,
      "function": "add" | "subtract" | "getData" | null,
      "amount": number | null
    }`;

    const categoryResponse = await callMistralAI(categorizationPrompt);
    console.log("AI Categorization Response:", categoryResponse);

    let categoryData;
    try {
      categoryData = JSON.parse(categoryResponse);
    } catch (err) {
      console.error("Categorization Parsing Error:", err);
      return NextResponse.json({ error: "Failed to classify query" }, { status: 500 });
    }

    // Step 2: Process Query
    let botResponse;

    if (categoryData.category === 1) {
      // **Direct Response**
      botResponse = await callMistralAI(message);
    } else if (categoryData.category === 2) {
      // **Function Call Only**
      if (categoryData.function && categoryData.amount) {
        if (categoryData.function === "add") {
          botResponse = add(categoryData.amount);
        } else if (categoryData.function === "subtract") {
          botResponse = subtract(categoryData.amount);
        } else {
          botResponse = "Invalid function call.";
        }
      } else {
        botResponse = "Invalid request data.";
      }
    } else if (categoryData.category === 3) {
      // **Function Call + AI**
      if (categoryData.function === "getData") {
        const userData = getData();
        const finalAIResponse = await callMistralAI(
          `User's finance data: ${JSON.stringify(userData)}. Now respond to: ${message}`
        );
        botResponse = finalAIResponse;
      } else {
        botResponse = "Invalid function call in category 3.";
      }
    } else {
      botResponse = "Unable to process the query.";
    }

    return NextResponse.json({ reply: botResponse }, { status: 200 });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
