export class DiaryEntity {
	private readonly todayActivities: string;
	private readonly memorableMoment: string;
	private readonly tomorrowHopes: string;
	private readonly date: Date;

	private constructor(param: {
		todayActivities: string;
		memorableMoment: string;
		tomorrowHopes: string;
		date: Date;
	}) {
		this.todayActivities = param.todayActivities;
		this.memorableMoment = param.memorableMoment;
		this.tomorrowHopes = param.tomorrowHopes;
		this.date = param.date;
	}

	public getTodayActivities(): string {
		return this.todayActivities;
	}

	public getMemorableMoment(): string {
		return this.memorableMoment;
	}

	public getTomorrowHopes(): string {
		return this.tomorrowHopes;
	}

	public getDate(): Date {
		return this.date;
	}

	public static of(param: {
		todayActivities: string;
		memorableMoment: string;
		tomorrowHopes: string;
		date: Date;
	}) {
		return new DiaryEntity({
			todayActivities: param.todayActivities,
			memorableMoment: param.memorableMoment,
			tomorrowHopes: param.tomorrowHopes,
			date: new Date(param.date),
		});
	}
}