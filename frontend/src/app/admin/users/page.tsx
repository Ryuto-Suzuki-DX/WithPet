"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import UserSearchForm from "@/components/feature/admin/UserSearchForm";
import UserTable from "@/components/feature/admin/UserTable";
import { ApiResponse, SearchListData, extractSearchListData } from "@/lib/data";
import SideMenu from "../sideMenu/sideMenu";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function AdminUsersPage() {
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const limit = 50;
  const [hasMore, setHasMore ] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  async function fetchUsers(searchWord: string) {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
          `http://localhost:8080/api/v1/admin/users?keyword=${encodeURIComponent(searchWord)}&offset=0&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("withpet_access_token") ?? ""}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("ユーザー一覧の取得に失敗しました。");
      }

      const result = await response.json() as ApiResponse<SearchListData<User>>;
      const { users: userList, hasMore } = extractSearchListData<User>(result);

      setUsers(userList);
      setHasMore(hasMore);
    } catch (err) {
      console.error(err);
      setError("ユーザー一覧の取得に失敗しました。");
      setUsers([]);
      setHasMore(false)
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchMoreUsers() {
    if (!hasMore || isFetchingMore) return;

    setIsFetchingMore(true);
    setError("");

    try {
      const response = await fetch(
      `http://localhost:8080/api/v1/admin/users?keyword=${encodeURIComponent(searchKeyword)}&offset=${users.length}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${localStorage.getItem("withpet_access_token") ?? ""}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("追加のユーザー取得に失敗しました。");
    }

    const result = await response.json() as ApiResponse<SearchListData<User>>;
    const { users: nextUsers, hasMore: nextHasMore } = extractSearchListData<User>(result);

    setUsers((prev) => [...prev, ...nextUsers]);
    setHasMore(nextHasMore);
    } catch (err) {
      console.error(err);
      setError("追加のユーザー取得に失敗しました。");
    } finally {
      setIsFetchingMore(false);
    }
  }

  useEffect(() => {
    fetchUsers("");
  }, []);

  function handleSearch() {
    setSearchKeyword(keyword);
    fetchUsers(keyword);
  }

  function handleClear() {
    setKeyword("");
    setSearchKeyword("");
    fetchUsers("");
  }

  function handleCreate() {
    router.push("/admin/users/new");
  }

  return (
    <>
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main style={{ height: "100vh", backgroundColor: "#f9fafb", padding: "24px", overflow: "hidden" }}>
        <div style={{ maxWidth: "1200px", height: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
          <section style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)", flexShrink: 0, }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap", marginBottom: "20px" }}>
              <div>
                <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: "#111827" }}>ユーザー一覧</h1>
                <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#6b7280" }}>登録されている利用者を確認できます</p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  type="button"
                  onClick={handleCreate}
                  style={{ border: "none", borderRadius: "8px", padding: "10px 16px", backgroundColor: "#f97316", color: "#ffffff", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}
                >
                  新規作成
                </button>

                <button
                  type="button"
                  onClick={() => setIsMenuOpen(true)}
                  aria-label="メニューを開く"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "42px", height: "42px", border: "none", borderRadius: "10px", backgroundColor: "#fed7aa", color: "#9a3412", cursor: "pointer" }}
                >
                  <Menu size={22} />
                </button>
              </div>
            </div>

            <UserSearchForm
              keyword={keyword}
              onKeywordChange={setKeyword}
              onSearch={handleSearch}
              onClear={handleClear}
              isLoading={isLoading}
            />
            </section>

          <section style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)", flex: 1, overflowY: "auto", minHeight: 0,}}>
            {searchKeyword && (
              <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "#374151" }}>
                検索キーワード: <strong>{searchKeyword}</strong>
              </p>
            )}

            {error ? (
              <p style={{ margin: 0, color: "#dc2626", fontSize: "14px" }}>{error}</p>
            ) : (
              <>
                <UserTable users = {users} isLoading={isLoading} />

                <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
                  {hasMore ? (
                    <button
                      type="button"
                      onClick={fetchMoreUsers}
                      disabled={isFetchingMore}
                      style={{
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 16px",
                        backgroundColor: isFetchingMore ? "#d1d5db" : "#f97316",
                        color: "#ffffff",
                        fontSize: "14px",
                        fontWeight: 700,
                        cursor: isFetchingMore ? "not-allowed" : "pointer",
                      }}
                    >
                      {isFetchingMore ? "読み込み中..." : "もっと見る"}
                    </button>
                  ) : (
                    users.length > 0 && (
                      <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
                        すべて表示しました
                      </p>
                    )
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </>
  );
}