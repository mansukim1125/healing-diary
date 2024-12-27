import {TimelineEntity} from "@/app/model/timeline/timeline.entity";

export default function ActivityRecord(param: {timeline: TimelineEntity}) {
	const {timeline} = param;
	return (
		<div className="relative pl-8 border-l-2 border-purple-200">
			<div
				className="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full bg-purple-400"></div>
			<div className="font-medium">{timeline.getSummary()}</div>
			<div className="mt-1 text-sm text-gray-600">
				활동 기록
			</div>
		</div>
	);
}