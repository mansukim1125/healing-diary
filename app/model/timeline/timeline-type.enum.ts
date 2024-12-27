export const TimelineType = {
	PositiveMoment: 'positive_moment',
	ActivityRecord: 'activity_record',
	EmotionalRecord: 'emotional_record',
} as const;

export type TimelineTypeEnum = typeof TimelineType[keyof typeof TimelineType];
