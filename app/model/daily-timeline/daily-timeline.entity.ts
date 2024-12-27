import {TimelineEntity} from "@/app/model/timeline/timeline.entity";
import {TimelineTypeEnum} from "@/app/model/timeline/timeline-type.enum";

export class DailyTimelineEntity {
	private readonly date: Date;
	private readonly timeline: TimelineEntity[];

	private constructor(param: {
		date: Date;
		timeline: TimelineEntity[];
	}) {
		this.date = param.date;
		this.timeline = param.timeline;
	}

	public getDate() {
		return this.date;
	}

	public getTimeline() {
		return this.timeline;
	}

	public static of(param: {
		date: string;
		timeline: {
			summary: string;
			type: TimelineTypeEnum;
		}[];
	}) {
		return new DailyTimelineEntity({
			date: new Date(param.date),
			timeline: param.timeline.map(tl => TimelineEntity.of({
				summary: tl.summary,
				type: tl.type,
			})),
		});
	}
}
