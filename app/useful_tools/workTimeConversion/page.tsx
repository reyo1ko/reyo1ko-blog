"use client";
import { useState } from "react";
import InputForm from "./_components/inputForm";
import ToolHeader from "@/app/components/useful_tool/ToolHeader";

const convertWorkTime = (
  value: number,
  unit: string,
  workHoursPerDay: number,
  workDaysPerMonth: number,
): Record<string, number> => {
  let hours = 0;

  if (unit === "hours") {
    hours = value;
  } else if (unit === "days") {
    hours = value * workHoursPerDay;
  } else if (unit === "months") {
    hours = value * workHoursPerDay * workDaysPerMonth;
  }

  return {
    hours,
    days: hours / workHoursPerDay,
    months: hours / (workHoursPerDay * workDaysPerMonth),
  };
};

const WorkTimeConversionPage = () => {
  const [result, setResult] = useState<Record<string, number> | null>(null);
  const [workHoursPerDay, setWorkHoursPerDay] = useState(8);
  const [workDaysPerMonth, setWorkDaysPerMonth] = useState(20);

  const handleConvert = (value: number, unit: string) => {
    setResult(convertWorkTime(value, unit, workHoursPerDay, workDaysPerMonth));
  };

  return (
    <div className="min-h-0 bg-surface">
      <div className="tool-page-inner">
        <ToolHeader
          title="労働時間変換ツール"
          description="所定労働時間と営業日数を基に、人時・人日・人月の間で変換を行います。"
          stepsVariant="ordered"
          className="mb-12"
          steps={
            <>
              <li>所定労働時間（時間/日）と営業日数（日/月）を入力します。</li>
              <li>変換したい人時・人日・人月の値と単位を入力します。</li>
              <li>「変換」ボタンを押すと、他の単位に変換された結果が表示されます。</li>
            </>
          }
        />

        {/* 条件入力 */}
        <section className="mb-12 bg-surface rounded-md p-6 border border-line">
          <h2 className="text-2xl font-semibold text-ink mb-4">条件入力</h2>

          <div className="flex flex-col space-y-4 mb-6">
            <div className="flex items-center space-x-2">
              <label htmlFor="workHoursPerDay" className="font-medium text-ink w-48">
                所定労働時間 (時間/日):
              </label>
              <input
                type="number"
                id="workHoursPerDay"
                value={workHoursPerDay}
                onChange={(e) => setWorkHoursPerDay(Number(e.target.value))}
                className="bg-surface border border-line rounded-md px-2 py-1 flex-1 text-ink focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <label htmlFor="workDaysPerMonth" className="font-medium text-ink w-48">
                営業日数 (日/月):
              </label>
              <input
                type="number"
                id="workDaysPerMonth"
                value={workDaysPerMonth}
                onChange={(e) => setWorkDaysPerMonth(Number(e.target.value))}
                className="bg-surface border border-line rounded-md px-2 py-1 flex-1 text-ink focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* 人時/人日/人月 入力フォーム */}
          <InputForm onConvert={handleConvert} />
        </section>

        {/* 結果カード */}
        {result && (
          <section className="bg-surface rounded-md p-6 border border-line">
            <h2 className="text-2xl font-semibold text-ink mb-4">変換結果</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">人時</span>
                <span className="font-mono font-semibold text-ink">
                  {result.hours.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted">人日</span>
                <span className="font-mono font-semibold text-ink">
                  {result.days.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted">人月</span>
                <span className="font-mono font-semibold text-ink">
                  {result.months.toFixed(2)}
                </span>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default WorkTimeConversionPage;
