import {Diary} from "@/app/entity/diary";

export class DiaryService {
	private _diaries: Diary[];

	constructor() {
		this._diaries = [];
	}

	public getPreviousDiaries(): Diary[] {
		const savedDiariesStr = localStorage.getItem('diaries');
		if (!savedDiariesStr) return [];

		const parsedDiaries = JSON.parse(savedDiariesStr);
		this._diaries = parsedDiaries.map((diary) =>
			Diary.of({
				todayActivities: diary._todayActivities,
				memorableMoment: diary._memorableMoment,
				tomorrowHopes: diary._tomorrowHopes,
				date: new Date(diary._date),
			}));

		return this._diaries;
	}

	public addDiary(diary: Diary) {
		this._diaries = [...this._diaries, diary];
		this.persist();
	}

	private persist() {
		localStorage.setItem('diaries', JSON.stringify(this._diaries));
	}
}
