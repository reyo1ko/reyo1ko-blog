export default function Loading() {
  return (
    <div role="status" aria-label="ページを読み込み中" className="page-loading">
      <div className="loading-kicker" />
      <div className="loading-title" />
      {[0, 1, 2, 3].map((index) => (
        <div className="loading-row" key={index}>
          <div />
          <div />
        </div>
      ))}
      <span className="sr-only">読み込み中…</span>
    </div>
  );
}
