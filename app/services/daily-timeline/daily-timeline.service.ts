import {DailyTimelineEntity} from "@/app/model/daily-timeline/daily-timeline.entity";
import {TimelineTypeEnum} from "@/app/model/timeline/timeline-type.enum";

export class DailyTimelineService {
	private timeline: DailyTimelineEntity[];

	constructor() {
		this.timeline = [];
	}

	public getTimeline(): DailyTimelineEntity[] {
		const timelineStr = localStorage.getItem('timeline');
		if (!timelineStr) return [];
		const parsedTimeline = JSON.parse(timelineStr);

		this.timeline = parsedTimeline.map((tl: { date: string; timeline: { summary: string; type: TimelineTypeEnum; }[]; }) => {
			return DailyTimelineEntity.of(tl);
		});

		return this.timeline;
	}

	public addTimeline(timeline: DailyTimelineEntity) {
		this.timeline = [timeline, ...this.timeline];
		this.persist();
	}

	private persist() {
		localStorage.setItem('timeline', JSON.stringify(this.timeline));
	}

	public getRecentTimeline(param: { days?: number }) {
		if (!param.days) {
			return this.getTimeline();
		}
		const daysBefore = new Date().getTime() - (param.days * 24 * 60 * 60 * 1000);
		return this.timeline.filter((dailyTimeline) => daysBefore <= dailyTimeline.getDate().getTime());
	}

	public getTimelineByPeriodAndType(param: { period?: number, type?: TimelineTypeEnum }) {
		const recentTimeline = this.getRecentTimeline({ days: param.period });

		if (!param.type) {
			return recentTimeline;
		}

		return recentTimeline.map(dailyTimeline => {
			const filteredTimeline = dailyTimeline.getTimeline().filter(tl => tl.getType() === param.type);
			return DailyTimelineEntity.of({
				date: dailyTimeline.getDate().toISOString(),
				timeline: filteredTimeline.map(tl => ({
					summary: tl.getSummary(),
					type: tl.getType(),
				})),
			});
		});
	}
}
