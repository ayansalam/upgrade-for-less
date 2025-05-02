// API handler for Gemini API calls

interface GeminiRequestParams {
  businessDescription: string;
  monthlyPrice: number;
  businessGoal: string;
}

export async function generatePricingSuggestions(params: GeminiRequestParams) {
  // Use only the environment variable for the API key
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("Gemini API key is not provided. Please set the VITE_GEMINI_API_KEY environment variable.");
  }

  const prompt = `A SaaS business wants to optimize its pricing.  
Monthly price: $${params.monthlyPrice}  
Goal: ${params.businessGoal}  
Description: ${params.businessDescription}  

Based on industry benchmarks and pricing psychology, suggest:  
- Monthly price  
- 8-week upfront discount  
- 12-month upfront discount  
Return clear pricing and % discounts.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to call Gemini API");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
}

// Gemini API handler for pricing suggestions

export async function fetchGeminiPricingSuggestion(apiKey: string, userInput: string) {
  if (!apiKey || typeof apiKey !== "string" || apiKey.trim() === "") {
    throw new Error("Gemini API key is missing. Please provide your Gemini API key.");
  }
  const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
  const body = {
    contents: [
      {
        parts: [
          { text: userInput }
        ]
      }
    ]
  };
  const response = await fetch(`${endpoint}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Failed to fetch pricing suggestion");
  }
  const data = await response.json();
  return data;
}

export function extractJsonFromResponse(response: any) {
  try {
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    const monthlyPriceMatch = text.match(/Monthly price:?\s*\$?(\d+(\.\d+)?)/i);
    const weeklyDiscountMatch = text.match(/8-week.+?(\d+(\.\d+)?)\s*%/i);
    const annualDiscountMatch = text.match(/12-month.+?(\d+(\.\d+)?)\s*%/i);
    const monthlyPrice = monthlyPriceMatch ? parseFloat(monthlyPriceMatch[1]) : null;
    const weeklyDiscount = weeklyDiscountMatch ? parseFloat(weeklyDiscountMatch[1]) : null;
    const annualDiscount = annualDiscountMatch ? parseFloat(annualDiscountMatch[1]) : null;
    return {
      monthlyPrice,
      weeklyDiscount,
      annualDiscount,
      insight: text
    };
  } catch (error) {
    console.error("Error extracting data from response:", error);
    throw new Error("Failed to parse Gemini API response");
  }
}