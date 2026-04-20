type UserSearchFormProps = {
  keyword: string;
  onKeywordChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  isLoading: boolean;
};

export default function UserSearchForm({
  keyword,
  onKeywordChange,
  onSearch,
  onClear,
  isLoading,
}: UserSearchFormProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "flex-end",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          flex: "1 1 320px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <label
          htmlFor="keyword"
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#374151",
          }}
        >
          フリーワード検索
        </label>

        <input
          id="keyword"
          type="text"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="名前・メールアドレスなど"
          style={{
            height: "40px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            padding: "0 12px",
            fontSize: "14px",
            outline: "none",
          }}
        />
      </div>

      <button
        type="button"
        onClick={onSearch}
        disabled={isLoading}
        style={{
          border: "none",
          borderRadius: "8px",
          padding: "10px 16px",
          backgroundColor: "#111827",
          color: "#ffffff",
          fontSize: "14px",
          fontWeight: 700,
          cursor: isLoading ? "not-allowed" : "pointer",
          opacity: isLoading ? 0.7 : 1,
        }}
      >
        検索
      </button>

      <button
        type="button"
        onClick={onClear}
        disabled={isLoading}
        style={{
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          padding: "10px 16px",
          backgroundColor: "#ffffff",
          color: "#111827",
          fontSize: "14px",
          fontWeight: 700,
          cursor: isLoading ? "not-allowed" : "pointer",
          opacity: isLoading ? 0.7 : 1,
        }}
      >
        クリア
      </button>
    </div>
  );
}