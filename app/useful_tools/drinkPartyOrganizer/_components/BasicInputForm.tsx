"use client";

interface BasicInputFormProps {
  calculationMode: string;
  setCalculationMode: (mode: string) => void;
  courseFee: number | "";
  setCourseFee: (fee: number | "") => void;
  totalBill: number | "";
  setTotalBill: (bill: number | "") => void;
  totalPeople: number | "";
  setTotalPeople: (people: number | "") => void;
}

const BasicInputForm = ({
  calculationMode,
  setCalculationMode,
  courseFee,
  setCourseFee,
  totalBill,
  setTotalBill,
  totalPeople,
  setTotalPeople,
}: BasicInputFormProps) => {
  return (
    <section className="mb-12 bg-surface rounded-md p-6 border border-line">
      <h2 className="text-2xl font-semibold text-ink mb-4">請求・人数情報</h2>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <label className="font-medium text-ink">計算方法:</label>
          <label className="flex items-center text-sm text-ink">
            <input
              type="radio"
              value="courseFee"
              checked={calculationMode === "courseFee"}
              onChange={(e) => setCalculationMode(e.target.value)}
              className="mr-1 bg-surface border-line text-ink focus:ring-accent"
            />
            コース料金から計算
          </label>
          <label className="flex items-center text-sm text-ink">
            <input
              type="radio"
              value="totalBill"
              checked={calculationMode === "totalBill"}
              onChange={(e) => setCalculationMode(e.target.value)}
              className="mr-1 bg-surface border-line text-ink focus:ring-accent"
            />
            請求金額から計算
          </label>
        </div>

        {calculationMode === "courseFee" && (
          <div className="flex items-center space-x-2">
            <label className="font-medium text-ink w-20">コース料金:</label>
            <input
              aria-label="1人あたりのコース料金"
              type="number"
              value={courseFee}
              onChange={(e) =>
                setCourseFee(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="bg-surface border border-line rounded-md px-2 py-1 flex-1 text-ink focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="例: 5000"
            />
            <span className="text-muted">円</span>
          </div>
        )}

        {calculationMode === "totalBill" && (
          <div className="flex items-center space-x-2">
            <label className="font-medium text-ink w-20">請求金額:</label>
            <input
              aria-label="請求金額の総額"
              type="number"
              value={totalBill}
              onChange={(e) =>
                setTotalBill(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="bg-surface border border-line rounded-md px-2 py-1 flex-1 text-ink focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="例: 25000"
            />
            <span className="text-muted">円</span>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <label className="font-medium text-ink w-20">参加人数:</label>
          <input
            aria-label="参加人数"
            type="number"
            value={totalPeople}
            onChange={(e) =>
              setTotalPeople(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="bg-surface border border-line rounded-md px-2 py-1 flex-1 text-ink focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="例: 5"
          />
          <span className="text-muted">人</span>
        </div>
      </div>
    </section>
  );
};

export default BasicInputForm;
