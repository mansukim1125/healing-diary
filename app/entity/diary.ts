export class Diary {
	private readonly _todayActivities: string;
	private readonly _memorableMoment: string;
	private readonly _tomorrowHopes: string;
	private readonly _date: Date;

	private constructor(param: {
		todayActivities: string;
		memorableMoment: string;
		tomorrowHopes: string;
		date: Date;
	}) {
		this._todayActivities = param.todayActivities;
		this._memorableMoment = param.memorableMoment;
		this._tomorrowHopes = param.tomorrowHopes;
		this._date = param.date;
	}

	public getTodayActivities(): string {
		return this._todayActivities;
	}

	public getMemorableMoment(): string {
		return this._memorableMoment;
	}

	public getTomorrowHopes(): string {
		return this._tomorrowHopes;
	}

	public getDate(): Date {
		return this._date;
	}

	public static of(param: {
		todayActivities: string;
		memorableMoment: string;
		tomorrowHopes: string;
		date: Date;
	}) {
		return new Diary(param);
	}
}