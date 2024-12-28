import {streamObject} from "ai";
import {openai} from "@/app/common/openai";
import {makeEmotionalPatternSystemPrompt} from "@/app/util/makeEmotionalPatternSystemPrompt";
import {z} from "zod";

export async function POST(req: Request) {
	const {recentTimeline} = await req.json();

	const result = streamObject({
		model: openai('gpt-4o'),
		schema: z.object({
			emotionalPattern: z.array(z.string()).min(2).max(5),
		}),
		system: makeEmotionalPatternSystemPrompt(),
		prompt: JSON.stringify(recentTimeline),
	});

	return result.toTextStreamResponse();
}
