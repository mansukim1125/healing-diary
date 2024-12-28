import {z} from "zod";

export const dailyTimelineSchema =
	z.object({
		date: z.string(),
		timeline: z.array(z.object({
			summary: z.string(),
			type: z.enum(['positive_moment', 'activity_record', 'emotional_record']),
		})),
	});