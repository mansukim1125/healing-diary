import {Diary} from "@/app/entity/diary";

export function makeDiaryPrompt(diary: Diary) {
	return `DIARY ENTRY DATE: ${diary.getDate().toISOString()}\n` +
		'- What kind of day did you have today?\n' +
		`  - ${diary.getTodayActivities()}\n` +
		'\n' +
		'- What moments stand out in your mind?\n' +
		`  - ${diary.getMemorableMoment()}\n` +
		'\n' +
		'- What kind of day do you want to have tomorrow?\n' +
		`  - ${diary.getTomorrowHopes()}` +
		'\n' +
		'\n';
}
