"use client";

interface Group {
  groupName: string;
  groupCount: number;
  groupAmountPerPerson: number;
  groupTotalAmount: number;
}

interface GroupFormProps {
  groups: Group[];
  setGroups: (groups: Group[]) => void;
  addGroup: () => void;
  removeGroup: (index: number) => void;
}

const GroupForm = ({ groups, setGroups, addGroup, removeGroup }: GroupFormProps) => {
  const updateGroup = (index: number, field: keyof Group, value: string | number) => {
    const newGroups = [...groups];
    newGroups[index] = { ...newGroups[index], [field]: value };
    // 合計金額を自動計算
    if (field === "groupCount" || field === "groupAmountPerPerson") {
      newGroups[index].groupTotalAmount =
        newGroups[index].groupCount * newGroups[index].groupAmountPerPerson;
    }
    setGroups(newGroups);
  };

  return (
    <section className="mb-12 bg-surface rounded-md p-6 border border-line">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-ink">グループ情報</h2>
        <button
          onClick={addGroup}
          className="px-3 py-1.5 rounded-md border border-line bg-surface text-ink hover:bg-soft focus:outline-none focus:ring-2 focus:ring-accent"
        >
          + グループ追加
        </button>
      </div>

      <div className="space-y-4">
        {groups.map((group, index) => (
          <div
            key={index}
            className="bg-surface rounded-md border border-line p-4 hover:bg-soft"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-ink">グループ {index + 1}</span>
              {groups.length > 1 && (
                <button
                  onClick={() => removeGroup(index)}
                  className="text-xs text-red-400 hover:underline"
                >
                  削除
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  グループ名
                </label>
                <input
                  aria-label="グループ名"
                  type="text"
                  value={group.groupName}
                  onChange={(e) => updateGroup(index, "groupName", e.target.value)}
                  className="w-full bg-surface border border-line rounded-md px-2 py-1 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="例: 先輩グループ"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">人数</label>
                <input
                  aria-label="グループの人数"
                  type="number"
                  value={group.groupCount}
                  onChange={(e) =>
                    updateGroup(index, "groupCount", Number(e.target.value))
                  }
                  className="w-full bg-surface border border-line rounded-md px-2 py-1 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="例: 3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  1人あたりの支払額
                </label>
                <input
                  aria-label="グループの1人あたりの支払額"
                  type="number"
                  value={group.groupAmountPerPerson}
                  onChange={(e) =>
                    updateGroup(index, "groupAmountPerPerson", Number(e.target.value))
                  }
                  className="w-full bg-surface border border-line rounded-md px-2 py-1 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="例: 5000"
                />
              </div>
            </div>

            <div className="mt-2 text-sm text-muted">
              合計: {group.groupTotalAmount}円
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GroupForm;
