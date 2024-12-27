import {DailyTimelineEntity} from "@/app/model/daily-timeline/daily-timeline.entity";

export class DailyTimelineService {
	private timeline: DailyTimelineEntity[];

	constructor() {
		this.timeline = [];
	}

	public getTimeline(): DailyTimelineEntity[] {
		const timelineStr = localStorage.getItem('timeline');
		if (!timelineStr) return [];
		const parsedTimeline = JSON.parse(timelineStr);

		this.timeline = parsedTimeline.map(tl => {
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

	public getRecentTimeline(param: { days: number }) {
		const daysBefore = new Date().getTime() - (param.days * 24 * 60 * 60 * 1000);
		return this.timeline.filter((dailyTimeline) => daysBefore <= dailyTimeline.getDate().getTime());
	}
}
