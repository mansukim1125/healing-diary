import {streamObject} from "ai";
import {openai} from "@/app/common/openai";
import {dailyTimelineSchema} from "@/app/model/daily-timeline/daily-timeline.schema";
import {makeTimelineSystemPrompt} from "@/app/util/makeTimelineSystemPrompt";

export async function POST(req: Request) {
	const { diary } = await req.json();

	const result = streamObject({
		model: openai('gpt-4o'),
		schema: dailyTimelineSchema,
		system: makeTimelineSystemPrompt(), // 유저가 입력한 일기 내용을 바탕으로 타임라인을 생성해달라는 지시문
		prompt: diary, // 일기 내용
	});



	return result.toTextStreamResponse();
}
