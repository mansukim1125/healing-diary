import {DiaryEntity} from "@/app/model/diary/diary.entity";

export class DiaryService {
	private diaries: DiaryEntity[];

	constructor() {
		this.diaries = [];
	}

	public getPreviousDiaries(): DiaryEntity[] {
		const savedDiariesStr = localStorage.getItem('diaries');
		if (!savedDiariesStr) return [];

		const parsedDiaries = JSON.parse(savedDiariesStr);
		this.diaries = parsedDiaries.map((diary) =>
			DiaryEntity.of(diary));

		return this.diaries;
	}

	public addDiary(diary: DiaryEntity) {
		this.diaries = [...this.diaries, diary];
		this.persist();
	}

	public getRecentDiary(): DiaryEntity | undefined {
		return this.diaries.slice(-1).at(0);
	}

	private persist() {
		localStorage.setItem('diaries', JSON.stringify(this.diaries));
	}
}
