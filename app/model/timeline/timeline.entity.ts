import { TimelineTypeEnum } from "@/app/model/timeline/timeline-type.enum";

export class TimelineEntity {
	private readonly summary: string;
	private readonly type: TimelineTypeEnum;

	private constructor(param: {
		summary: string;
		type: TimelineTypeEnum;
	}) {
		this.summary = param.summary;
		this.type = param.type;
	}

	public getType() {
		return this.type;
	}

	public getSummary() {
		return this.summary;
	}

	public static of(param: {
		summary: string;
		type: TimelineTypeEnum;
	}) {
		return new TimelineEntity({
			summary: param.summary,
			type: param.type,
		});
	}
}
