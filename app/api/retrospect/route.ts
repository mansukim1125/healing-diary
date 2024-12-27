import {streamText} from "ai";
import { createOpenAI } from '@ai-sdk/openai';
import {makeDiarySystemPrompt} from "@/app/util/makeDiarySystemPrompt";

const openai = createOpenAI();

export async function POST(req: Request) {
	const {prompt} = await req.json();

	console.log(prompt);

	const result = streamText({
		model: openai('gpt-4o'),
		system: makeDiarySystemPrompt(),
		prompt,
	});

	return result.toDataStreamResponse();
}
