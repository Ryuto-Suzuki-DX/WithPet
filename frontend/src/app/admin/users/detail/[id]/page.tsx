"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { getUser } from "@/api/admin";
import { extractData } from "@/api/data";
import type { User, Pet } from "@/types/admin/admin_type";
import SideMenu from "../../../sideMenu/sideMenu";

export default function AdminUserDetailPage() {
  const router = useRouter();
  const params = useParams();

  const userId = Number(params.id);

  const [user, setUser] = useState<User | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 初回ロード
  useEffect(() => {
    fetchUser();
  }, [userId]);

  // ユーザー1件取得
  async function fetchUser() {
    if (!userId) {
      setError("ユーザーIDが不正です。");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await getUser(userId);
      const user = extractData<User>(result);

      setUser(user);
      setPets(user.pets ?? []);
    } catch (err) {
      console.error(err);
      setError("ユーザー情報の取得に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  }

  // 一覧へ戻る
  function handleBack() {
    router.push("/admin/users");
  }

  // 編集画面へ移動
  function handleUpdate() {
    router.push(`/admin/users/update/${userId}`);
  }

  return (
    <>
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main style={{ height: "100vh", backgroundColor: "#f9fafb", padding: "24px", overflow: "hidden" }}>
        <div style={{ maxWidth: "1000px", height: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
          <section style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)", flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <div>
                <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: "#111827" }}>
                  ユーザー詳細
                </h1>
                <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#6b7280" }}>
                  ユーザー情報と紐づくペットを確認できます
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button type="button" onClick={handleBack} style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 16px", backgroundColor: "#ffffff", color: "#374151", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
                  一覧へ戻る
                </button>

                <button type="button" onClick={handleUpdate} disabled={user?.isDeleted} style={{ border: "none", borderRadius: "8px", padding: "10px 16px", backgroundColor: user?.isDeleted ? "#d1d5db" : "#f97316", color: "#ffffff", fontSize: "14px", fontWeight: 700, cursor: user?.isDeleted ? "not-allowed" : "pointer", opacity: user?.isDeleted ? 0.5 : 1 }}>
                  編集する
                </button>

                <button type="button" onClick={() => setIsMenuOpen(true)} aria-label="メニューを開く" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "42px", height: "42px", border: "none", borderRadius: "10px", backgroundColor: "#fed7aa", color: "#9a3412", cursor: "pointer" }}>
                  <Menu size={22} />
                </button>
              </div>
            </div>
          </section>

          <section style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)", flex: 1, overflowY: "auto", minHeight: 0 }}>
            {error && (
              <p style={{ margin: "0 0 16px 0", color: "#dc2626", fontSize: "14px", fontWeight: 700 }}>
                {error}
              </p>
            )}

            {isLoading ? (
              <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>読み込み中です...</p>
            ) : !user ? (
              <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>ユーザー情報がありません。</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#111827" }}>
                    基本情報
                  </h2>

                  <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "160px 1fr", border: "1px solid #e5e7eb", borderRadius: "10px", overflow: "hidden" }}>
                    <div style={{ padding: "12px", backgroundColor: "#f3f4f6", fontSize: "14px", fontWeight: 700, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>
                      ユーザーID
                    </div>
                    <div style={{ padding: "12px", fontSize: "14px", color: user.isDeleted ? "#9ca3af" : "#111827", borderBottom: "1px solid #e5e7eb" }}>
                      {user.id}
                    </div>

                    <div style={{ padding: "12px", backgroundColor: "#f3f4f6", fontSize: "14px", fontWeight: 700, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>
                      名前
                    </div>
                    <div style={{ padding: "12px", fontSize: "14px", color: user.isDeleted ? "#9ca3af" : "#111827", borderBottom: "1px solid #e5e7eb" }}>
                      {user.name}
                    </div>

                    <div style={{ padding: "12px", backgroundColor: "#f3f4f6", fontSize: "14px", fontWeight: 700, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>
                      メールアドレス
                    </div>
                    <div style={{ padding: "12px", fontSize: "14px", color: user.isDeleted ? "#9ca3af" : "#111827", borderBottom: "1px solid #e5e7eb" }}>
                      {user.email}
                    </div>

                    <div style={{ padding: "12px", backgroundColor: "#f3f4f6", fontSize: "14px", fontWeight: 700, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>
                      権限
                    </div>
                    <div style={{ padding: "12px", fontSize: "14px", color: user.isDeleted ? "#9ca3af" : "#111827", borderBottom: "1px solid #e5e7eb" }}>
                      {user.role}
                    </div>

                    <div style={{ padding: "12px", backgroundColor: "#f3f4f6", fontSize: "14px", fontWeight: 700, color: "#374151" }}>
                      状態
                    </div>
                    <div style={{ padding: "12px", fontSize: "14px", color: "#111827" }}>
                      <span style={{ display: "inline-block", borderRadius: "999px", padding: "4px 10px", backgroundColor: user.isDeleted ? "#e5e7eb" : "#dcfce7", color: user.isDeleted ? "#6b7280" : "#166534", fontSize: "12px", fontWeight: 700 }}>
                        {user.isDeleted ? "削除済み" : "有効"}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px" }}>
                  <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#111827" }}>
                     ペット一覧
                  </h2>

                  {pets.length === 0 ? (
                    <p style={{ margin: "12px 0 0 0", fontSize: "14px", color: "#6b7280" }}>
                      登録されているペットがいません。
                    </p>
                  ) : (
                    <div style={{ marginTop: "12px", overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "640px" }}>
                        <thead>
                          <tr style={{ backgroundColor: "#f3f4f6" }}>
                            <th style={{ textAlign: "left", padding: "10px", fontSize: "13px", fontWeight: 700, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>名前</th>
                            <th style={{ textAlign: "left", padding: "10px", fontSize: "13px", fontWeight: 700, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>種別</th>
                            <th style={{ textAlign: "left", padding: "10px", fontSize: "13px", fontWeight: 700, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>誕生日</th>
                            <th style={{ textAlign: "left", padding: "10px", fontSize: "13px", fontWeight: 700, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>状態</th>
                            <th style={{ textAlign: "left", padding: "10px", fontSize: "13px", fontWeight: 700, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>作成日</th>
                          </tr>
                        </thead>

                        <tbody>
                          {pets.map((pet) => {
                            const isPetDeleted = pet.isDeleted;

                            return (
                              <tr key={pet.id} style={{ backgroundColor: isPetDeleted ? "#f3f4f6" : "#ffffff" }}>
                                <td style={{ padding: "10px", fontSize: "13px", color: isPetDeleted ? "#9ca3af" : "#111827", borderBottom: "1px solid #e5e7eb" }}>{pet.name}</td>
                                <td style={{ padding: "10px", fontSize: "13px", color: isPetDeleted ? "#9ca3af" : "#111827", borderBottom: "1px solid #e5e7eb" }}>{pet.type}</td>
                                <td style={{ padding: "10px", fontSize: "13px", color: isPetDeleted ? "#9ca3af" : "#111827", borderBottom: "1px solid #e5e7eb" }}>{pet.birthDate || "-"}</td>
                                <td style={{ padding: "10px", fontSize: "13px", borderBottom: "1px solid #e5e7eb" }}>
                                  <span style={{ display: "inline-block", borderRadius: "999px", padding: "4px 10px", backgroundColor: isPetDeleted ? "#e5e7eb" : "#dcfce7", color: isPetDeleted ? "#6b7280" : "#166534", fontSize: "12px", fontWeight: 700 }}>
                                    {isPetDeleted ? "削除済み" : "有効"}
                                  </span>
                                </td>
                                <td style={{ padding: "10px", fontSize: "13px", color: isPetDeleted ? "#9ca3af" : "#111827", borderBottom: "1px solid #e5e7eb" }}>{pet.createdAt || "-"}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}