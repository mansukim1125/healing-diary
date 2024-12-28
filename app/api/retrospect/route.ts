import {streamText} from "ai";
import {makeDiarySystemPrompt} from "@/app/util/makeDiarySystemPrompt";
import {openai} from "@/app/common/openai";

export async function POST(req: Request) {
	const {prompt} = await req.json();

	const result = streamText({
		model: openai('gpt-4o'),
		system: makeDiarySystemPrompt(),
		prompt,
	});

	return result.toDataStreamResponse();
}
