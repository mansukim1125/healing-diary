'use client';

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Book, Calendar} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useCompletion} from "@ai-sdk/react";
import {Suspense, useEffect, useState} from "react";
import {makeDiaryPrompt} from "@/app/util/makeDiaryPrompt";
import {DiaryService} from "@/app/services/diary/diary.service";
import {Diary} from "@/app/entity/diary";

export default function Home() {
  const { completion, input, setInput, handleSubmit } = useCompletion({
    api: '/api/retrospect',
  });

  const [todayActivities, setTodayActivities] = useState<string>('');
  const [memorableMoment, setMemorableMoment] = useState<string>('');
  const [tomorrowHopes, setTomorrowHopes] = useState<string>('');

  const [shouldSubmit, setShouldSubmit] = useState<boolean>(false);

  const [diaryService, _] = useState<DiaryService>(new DiaryService());

  useEffect(() => {
    // 컴포넌트 마운트 시 localStorage에서 메시지 로드
    const previousDiaries = diaryService.getPreviousDiaries();

    const previousDiaryPrompt = previousDiaries.reduce((prompt, diary) => {
      return prompt + makeDiaryPrompt(diary);
    }, '');

    setInput(previousDiaryPrompt);
  }, [diaryService, setInput]);

  useEffect(() => {
    if (shouldSubmit) {
      handleSubmit();
      setShouldSubmit(false);
    }
  }, [handleSubmit, input, shouldSubmit]);

  const onSubmit = async (e) => {
    const diary = Diary.of({
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
                      오늘 하루를 돌아보며 AI가 작성한 회고와 응원의 메시지가 이 곳에 표시됩니다.
                      <br/>
                      {completion}
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
                      {/* 타임라인 항목 예시 */}
                      <div className="relative pl-8 border-l-2 border-blue-200">
                        <div className="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-400"></div>
                        <div className="mb-1 text-sm text-gray-500">2024년 12월 22일</div>
                        <div className="font-medium">친구들과 저녁 먹으며 많이 웃었다</div>
                        <div className="mt-1 text-sm text-gray-600">
                          오늘의 긍정적 순간
                        </div>
                      </div>

                      <div className="relative pl-8 border-l-2 border-purple-200">
                        <div className="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full bg-purple-400"></div>
                        <div className="mb-1 text-sm text-gray-500">2024년 12월 21일</div>
                        <div className="font-medium">아침에 일어나서 산책을 했다</div>
                        <div className="mt-1 text-sm text-gray-600">
                          활동 기록
                        </div>
                      </div>

                      <div className="relative pl-8 border-l-2 border-rose-200">
                        <div className="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full bg-rose-400"></div>
                        <div className="mb-1 text-sm text-gray-500">2024년 12월 20일</div>
                        <div className="font-medium">사진을 보며 많이 슬펐지만, 책 읽기로 마음을 달랬다</div>
                        <div className="mt-1 text-sm text-gray-600">
                          감정 기록
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">회복의 패턴</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 운동이나 산책을 할 때 긍정적인 감정을 많이 느끼시네요</li>
                      <li>• 친구들과 만날 때 웃음이 많아지고 있어요</li>
                      <li>• 혼자만의 시간에 책읽기가 위로가 되고 있어요</li>
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
