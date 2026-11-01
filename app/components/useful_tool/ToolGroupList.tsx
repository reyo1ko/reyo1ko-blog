"use client";
import Link from "next/link";
import { useState } from "react";
import { ToolGroup } from "./tools";
import PixelIcon, { toolIcon } from "../PixelIcon";
export default function ToolGroupList({ groups }: { groups: ToolGroup[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const visible = groups
    .filter((g) => !category || g.title === category)
    .map((g) => ({
      ...g,
      items: g.items.filter((t) =>
        (t.title + " " + t.description)
          .toLocaleLowerCase()
          .includes(query.trim().toLocaleLowerCase()),
      ),
    }))
    .filter((g) => g.items.length);
  return (
    <div>
      <label className="search-field">
        <PixelIcon name="search" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ツール名・用途から探す"
          aria-label="便利ツールを検索"
        />
        <span>{visible.reduce((n, g) => n + g.items.length, 0)} tools</span>
      </label>
      <div className="catalog-filters" aria-label="ツールのカテゴリ">
        {["", ...groups.map((g) => g.title)].map((title) => (
          <button
            key={title}
            aria-pressed={category === title}
            className={category === title ? "is-active" : ""}
            onClick={() => setCategory(title)}
          >
            {title || "すべて"}
          </button>
        ))}
      </div>
      <div aria-live="polite">
        {visible.length ? (
          visible.map((group, index) => (
            <section className="tool-section" key={group.title}>
              <div className="tool-section-heading">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h2>{group.title}</h2>
                <small>{group.items.length} tools</small>
              </div>
              {group.description && (
                <p className="tool-section-description">{group.description}</p>
              )}
              <div className="tool-grid">
                {group.items.map((tool) => (
                  <Link className="tool-card" href={tool.href} key={tool.href}>
                    <span className="tool-icon">
                      <PixelIcon name={toolIcon(tool.href)} />
                    </span>
                    <h3>{tool.title}</h3>
                    <p>{tool.description}</p>
                    <span className="tool-card-action">
                      ツールを開く
                      <PixelIcon name="arrow" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="empty-state">
            <PixelIcon name="search" />
            <h2>ツールが見つかりません</h2>
            <p>別のキーワードやカテゴリで探してみてください。</p>
            <button
              className="button-secondary"
              onClick={() => {
                setQuery("");
                setCategory("");
              }}
            >
              条件をリセット
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
