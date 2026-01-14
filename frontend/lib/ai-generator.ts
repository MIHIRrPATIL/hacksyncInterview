"use client";

export interface DSAQuestion {
    title: string;
    description: string;
    difficulty: string;
    example: {
        input: string;
        output: string;
    };
    testCases: Array<{
        input: string;
        output: string;
    }>;
}

export interface VoiceQuestion {
    question: string;
    answer: string;
}

export interface InterviewContent {
    dsa: DSAQuestion[];
    voice: VoiceQuestion[];
}

export async function generateInterviewContent(config: {
    difficulty: string;
    dsaCount: number;
    vivaCount: number;
    type: string;
}): Promise<InterviewContent> {
    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    if (!apiKey || apiKey === 'your_key_here') {
        throw new Error("OpenRouter API key is missing. Please add it to .env.local.");
    }

    const prompt = `
    Generate professional coding interview content for a ${config.type} interview with ${config.difficulty} difficulty.
    
    REQUIRED CONTENT:
    ${config.dsaCount > 0 ? `1. ${config.dsaCount} DSA Questions. Each must have:
       - title
       - description (with technical constraints)
       - difficulty (${config.difficulty})
       - example (input and output strings)
       - testCases (at least 3 sample test cases as an array of {input, output} objects)` : '1. SKIP DSA Questions. Do not generate any coding challenges.'}
    
    2. ${config.vivaCount} Voice/Viva Questions. Each must have:
       - question
       - answer (concise but complete)

    RESPONSE FORMAT:
    You MUST respond with a valid JSON object only. Do not include any other text.
    Format:
    {
      "dsa": [
        ${config.dsaCount > 0 ? '{ "title": "...", "description": "...", "difficulty": "...", "example": { "input": "...", "output": "..." }, "testCases": [{ "input": "...", "output": "..." }] }' : ''}
      ],
      "voice": [
        { "question": "...", "answer": "..." }
      ]
    }
  `;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // Increased to 60s

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "SkillSphere Content Generator",
            },
            body: JSON.stringify({
                model: "xiaomi/mimo-v2-flash:free",
                messages: [{ role: "user", content: prompt }]
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenRouter API Error:", response.status, errorText);
            throw new Error(`AI Service Error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        if (data.error) throw new Error(data.error.message || "AI Generation Failed");

        const rawContent = data.choices?.[0]?.message?.content || "{}";
        console.log("AI Raw Response:", rawContent);

        let cleanJson = rawContent;

        // Robust extraction: find the first '{' and last '}'
        const firstBrace = rawContent.indexOf('{');
        const lastBrace = rawContent.lastIndexOf('}');

        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            cleanJson = rawContent.substring(firstBrace, lastBrace + 1);
        }

        try {
            const content = JSON.parse(cleanJson);
            return {
                dsa: content.dsa || [],
                voice: content.voice || []
            };
        } catch (parseError) {
            console.error("JSON Parse Error on:", cleanJson);
            throw parseError;
        }
    } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            console.error("Content Generation Timed Out (60s)");
            throw new Error("AI Generation Timeout: The model is taking too long to respond. Standard mode enabled.");
        }
        console.error("Content Generation Error:", error);
        throw error;
    }
}

export async function evaluateCode(params: {
    code: string;
    language: string;
    testCases: Array<{ input: string; output: string }>;
    problemTitle: string;
}) {
    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("API key missing");

    const prompt = `
    You are a high-speed code execution sandbox and compiler for ${params.language}.
    Evaluate the following solution for the problem "${params.problemTitle}".
    
    CODE:
    ${params.code}
    
    TEST CASES:
    ${JSON.stringify(params.testCases, null, 2)}
    
    INSTRUCTIONS:
    1. Check if the code compiles/has syntax errors. Be specific like a real compiler.
    2. If it compiles, "run" it against the test cases provided.
    3. Return a JSON object with:
       - "success": boolean (true if all tests pass and no errors)
       - "results": array of { "input": string, "expected": string, "actual": string, "passed": boolean }
       - "compilerOutput": string (stdout/stderr or error messages)

    STRICT JSON ONLY RESPONSE.
    `;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s for eval

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "SkillSphere Code Runner",
            },
            body: JSON.stringify({
                model: "xiaomi/mimo-v2-flash:free",
                messages: [{ role: "user", content: prompt }]
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        const data = await response.json();
        const rawContent = data.choices?.[0]?.message?.content || "{}";

        let cleanJson = rawContent;
        const firstBrace = rawContent.indexOf('{');
        const lastBrace = rawContent.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
            cleanJson = rawContent.substring(firstBrace, lastBrace + 1);
        }

        return JSON.parse(cleanJson);
    } catch (error: any) {
        clearTimeout(timeoutId);
        console.error("Evaluation Error:", error);
        throw error;
    }
}
