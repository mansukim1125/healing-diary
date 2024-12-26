export function makeDiaryPrompt(param: {
	todayActivities: string;
	memorableMoment: string;
	tomorrowHopes: string;
	date: Date;
}) {
	return `DIARY ENTRY DATE: ${param.date.toISOString()}\n` +
		'- What kind of day did you have today?\n' +
		`  - ${param.todayActivities}\n` +
		'\n' +
		'- What moments stand out in your mind?\n' +
		`  - ${param.memorableMoment}\n` +
		'\n' +
		'- What kind of day do you want to have tomorrow?\n' +
		`  - ${param.tomorrowHopes}` +
		'\n' +
		'\n';
}
