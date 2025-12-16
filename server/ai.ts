import OpenAI from "openai";
import type { Plan } from "@shared/schema";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

function summarizeTasks(plans: Plan[]) {
  if (!plans.length) return "No tasks available.";
  return plans
    .map(
      (p) =>
        `- ${p.title} [priority:${p.priority}] [status:${p.status}] [category:${p.category}] [deadline:${p.deadline ?? "none"}]`,
    )
    .join("\n");
}

export async function aiSuggestImprovements(plans: Plan[]) {
  const prompt = `You are an assistant helping users manage tasks. Analyze the tasks and provide concise suggestions:
- Which tasks are urgent and why
- What to prioritize next (top 3)
- How to schedule them today/tomorrow/this week
Keep it short and bulleted.

Tasks:
${summarizeTasks(plans)}
`;

  const res = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      { role: "system", content: "You help users prioritize tasks with brief, actionable advice." },
      { role: "user", content: prompt },
    ],
  });

  return res.choices[0]?.message?.content ?? "No suggestions available.";
}

export async function aiSortTasks(plans: Plan[]) {
  const prompt = `You will prioritize tasks into High, Medium, Low. Return JSON with an array "prioritized" where each entry has: id, title, priority (High|Medium|Low), reason.
Return ONLY JSON.

Tasks:
${summarizeTasks(plans)}
`;

  const res = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      { role: "system", content: "You prioritize tasks and respond with JSON only." },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  });

  const text = res.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(text);
  return parsed.prioritized ?? [];
}

export async function aiDailyPlanner(plans: Plan[], userPrompt: string) {
  const prompt = `Create a concise daily plan based on the user's description and their tasks.
Include time blocks, priorities, and 3 quick tips.
Respond in markdown bullet format.

User description:
${userPrompt}

Tasks:
${summarizeTasks(plans)}
`;

  const res = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      { role: "system", content: "You are a focused daily planner assistant. Be concise and actionable." },
      { role: "user", content: prompt },
    ],
  });

  return res.choices[0]?.message?.content ?? "No plan generated.";
}

