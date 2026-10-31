"use client";
import { useState } from "react";

interface InputFormProps {
  onConvert: (value: number, unit: string) => void;
}

export default function InputForm({ onConvert }: InputFormProps) {
  const [value, setValue] = useState(0);
  const [unit, setUnit] = useState("hours");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConvert(value, unit);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      {/* 入力行 */}
      <div className="flex items-center space-x-2">
        <input
          aria-label="変換する工数"
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="flex-1 bg-surface border border-line rounded-md px-2 py-1 text-ink focus:outline-none focus:ring-2 focus:ring-accent"
        />

        <select
          aria-label="工数の単位"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="bg-surface border border-line rounded-md px-2 py-1 text-ink focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="hours">人時</option>
          <option value="days">人日</option>
          <option value="months">人月</option>
        </select>
      </div>

      {/* 変換ボタン（右寄せにしやすい） */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-strong text-on-strong px-6 py-2 rounded-md hover:bg-strong focus:outline-none focus:ring-2 focus:ring-accent"
        >
          変換
        </button>
      </div>
    </form>
  );
}
