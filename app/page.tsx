'use client';

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Book, Calendar} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useCompletion} from "@ai-sdk/react";
import {useEffect, useState} from "react";
import {makeDiaryPrompt} from "@/app/util/makeDiaryPrompt";
import {DiaryService} from "@/app/services/diary/diary.service";
import {DiaryEntity} from "@/app/model/diary/diary.entity";
import { experimental_useObject as useObject } from 'ai/react'
import {dailyTimelineSchema} from "@/app/model/daily-timeline/daily-timeline.schema";
import {DailyTimelineEntity} from "@/app/model/daily-timeline/daily-timeline.entity";
import {DailyTimelineService} from "@/app/services/daily-timeline/daily-timeline.service";
import PositiveMoment from "@/app/components/timeline/positive-moment.component";
import ActivityRecord from "@/app/components/timeline/activity-record.component";
import EmotionalRecord from "@/app/components/timeline/emotional-record.component";
import {z} from "zod";

export default function Home() {
  const { completion, input, setInput, handleSubmit } = useCompletion({
    api: '/api/retrospect',
  });

  const [diaryService, ] = useState<DiaryService>(new DiaryService());
  const [timelineService, ] = useState<DailyTimelineService>(new DailyTimelineService());

  const [dailyTimeline, setDailyTimeline] = useState<DailyTimelineEntity[]>([]);

  const {object: emotionalPatternObj, submit: emotionalPatternSubmit} = useObject({
    api: '/api/emotional_pattern',
    schema: z.object({
      emotionalPattern: z.array(z.string()).min(2).max(5),
    }),
    async onFinish({ object, error }) {
      console.log('onFinish', object, error);
      if (!object || error) {
        return;
      }
      console.log('emotional_pattern', object.emotionalPattern);
      localStorage.setItem('emotional_pattern', JSON.stringify(object.emotionalPattern));
    },
  })

  const { submit: timelineSubmit } = useObject({
    api: '/api/timeline',
    schema: dailyTimelineSchema,
    async onFinish({ object, error }) {
      if (!object || error) {
      //   TODO: throw error..
        return;
      }
      console.log('object: ', object);
      const newTimeline = DailyTimelineEntity.of({...object, date: new Date().toISOString()});
      console.log('newTimeline: ', newTimeline);
      setDailyTimeline(prevState => [newTimeline, ...prevState]);
      timelineService.addTimeline(newTimeline);

      emotionalPatternSubmit({ recentTimeline: timelineService.getRecentTimeline({ days: 7 }) })
    },
  });

  const [todayActivities, setTodayActivities] = useState<string>('');
  const [memorableMoment, setMemorableMoment] = useState<string>('');
  const [tomorrowHopes, setTomorrowHopes] = useState<string>('');

  const [_, setEmotionalPattern] = useState<string[]>([]);

  const [shouldSubmit, setShouldSubmit] = useState<boolean>(false);

  useEffect(() => {
    // 컴포넌트 마운트 시 localStorage에서 메시지 로드
    const previousDiaries = diaryService.getPreviousDiaries();

    const previousDiaryPrompt = previousDiaries.reduce((prompt, diary) => {
      return prompt + makeDiaryPrompt(diary);
    }, '');

    setInput(previousDiaryPrompt);
  }, [diaryService, setInput]);

  useEffect(() => {
    const previousTimeline = timelineService.getTimeline();

    setDailyTimeline(previousTimeline);
  }, [timelineService]);

  useEffect(() => {
    const previousEmotionalPatternStr = localStorage.getItem('emotional_pattern');
    console.log(previousEmotionalPatternStr);
    const previousEmotionalPattern = JSON.parse(previousEmotionalPatternStr || '[]');
    setEmotionalPattern(previousEmotionalPattern);
  }, []);

  useEffect(() => {
    if (shouldSubmit) {
      handleSubmit();
      const recentDiary = diaryService.getRecentDiary();
      if (recentDiary) {
        timelineSubmit({ diary: makeDiaryPrompt(recentDiary) });
      }
      setShouldSubmit(false);
    }
  }, [diaryService, handleSubmit, input, shouldSubmit, timelineSubmit]);

  const onSubmit = async (e) => {
    const diary = DiaryEntity.of({
      todayActivities,
      memorableMoment,
      tomorrowHopes,
      date: new Date(),
    });

    diaryService.addDiary(diary);

    setInput(prevState => {
      return prevState + makeDiaryPrompt(diary);
    });
    setShouldSubmit(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">마음 치유 공간</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="diary" className="w-full">
          <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100 rounded-lg">
            <TabsTrigger value="diary">
              <Book />
              일기
            </TabsTrigger>
            <TabsTrigger value="timeline">
              <Calendar />
              회복 타임라인
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diary">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">오늘 하루 기록</h3>
                <div className="space-y-4">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">오늘 어떤 하루를 보내셨나요?</label>
                      <textarea
                        className="w-full p-3 border rounded-md h-24 text-base"
                        placeholder="오늘 있었던 일들을 자유롭게 적어주세요."
                        value={todayActivities}
                        onChange={(e) => setTodayActivities(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">어떤 순간이 기억에 남나요?</label>
                      <textarea
                        className="w-full p-3 border rounded-md h-24 text-base"
                        placeholder="오늘 좋았던 순간, 잘 해냈던 순간, 혹은 힘들었던 순간들을 떠올려보세요."
                        value={memorableMoment}
                        onChange={e => setMemorableMoment(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">내일은 어떤 하루를 보내고 싶나요?</label>
                      <textarea
                        className="w-full p-3 border rounded-md h-24 text-base"
                        placeholder="내일 하고 싶은 것들, 기대되는 것들을 적어보세요."
                        value={tomorrowHopes}
                        onChange={e => setTomorrowHopes(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">오늘의 회고</h4>
                    <p className="text-sm text-blue-600">
                      {completion ? completion : '오늘 하루를 돌아보며 AI가 작성한 회고와 응원의 메시지가 이 곳에 표시됩니다.'}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={onSubmit}>기록 남기기</Button>
                  </div>

                  <p className="text-sm text-gray-500 mt-2">
                    기록하신 내용은 자동으로 분석되어 회복 타임라인에 반영됩니다.
                    당신의 이야기를 있는 그대로 들려주세요.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">회복 여정</h3>
                <div className="space-y-6">
                  <div>
                    <select>
                      <option>전체 기간</option>
                      <option>최근 1주일</option>
                      <option>최근 1개월</option>
                      <option>최근 3개월</option>
                    </select>
                    <select>
                      <option>모든 항목</option>
                      <option>긍정적 순간</option>
                      <option>감정 기록</option>
                      <option>활동 기록</option>
                    </select>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="space-y-8">
                      {dailyTimeline.map(daily => {
                        const date = daily.getDate();
                        return (
                          [(() => {
                            return (
                              <p key={date.getTime()}>{`${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`}</p>
                            )
                          })(), daily.getTimeline().map(timeline => {
                            if (timeline.getType() === 'positive_moment') {
                              return <PositiveMoment timeline={timeline} key={`${date.getTime()}-${timeline.getType()}`}/>
                            } else if (timeline.getType() === 'activity_record') {
                              return <ActivityRecord timeline={timeline} key={`${date.getTime()}-${timeline.getType()}`}/>
                            } else {
                              return <EmotionalRecord timeline={timeline} key={`${date.getTime()}-${timeline.getType()}`}/>
                            }
                          })]
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">회복의 패턴</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {emotionalPatternObj ? emotionalPatternObj.emotionalPattern?.map((emotionalPattern, index) => {
                        return (
                          <li key={index}>• {emotionalPattern}</li>
                        )
                      }) : _.map((emotionalPattern, index) => {
                        return (
                          <li key={index}>• {emotionalPattern}</li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
