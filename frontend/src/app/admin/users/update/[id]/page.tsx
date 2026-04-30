/* sonarjs-disable typescript:S6477 */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { getUser, updateUser } from "@/api/admin";
import { extractData } from "@/api/data";
import type { User, Pet } from "@/types/admin/admin_type";
import SideMenu from "../../../sideMenu/sideMenu";

export default function AdminUserUpdatePage() {
  const router = useRouter();
  const params = useParams();

  const userId = Number(params.id);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ADMIN" | "USER">("USER");
  const [password, setPassword] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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

      setName(user.name);
      setEmail(user.email);
      setRole(user.role as "ADMIN" | "USER");
      setPassword("");
      setIsDeleted(user.isDeleted);
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

  // 保存
  async function handleSave() {
    if (!userId) {
      setError("ユーザーIDが不正です。");
      return;
    }

    if (isDeleted) {
      setError("削除済みユーザーは編集できません。")
      return
    }

    if (!name.trim()) {
      setError("名前を入力してください。");
      return;
    }

    if (!email.trim()) {
      setError("メールアドレスを入力してください。");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      await updateUser({
        ID: userId,
        name,
        email,
        password: password || undefined,
        role,
      });

      router.push("/admin/users");
    } catch (err) {
      console.error(err);
      setError("ユーザーの編集に失敗しました。");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main style={{ height: "100vh", backgroundColor: "#f9fafb", padding: "24px", overflow: "hidden" }}>
        <div style={{ maxWidth: "900px", height: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
          <section style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)", flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <div>
                <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: "#111827" }}>ユーザー編集</h1>
                <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#6b7280" }}>ユーザー情報を編集できます</p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button type="button" onClick={handleBack} style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 16px", backgroundColor: "#ffffff", color: "#374151", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
                  一覧へ戻る
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
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "560px" }}>
                <div>
                  <label htmlFor="user-id" style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>
                    ユーザーID
                  </label>
                  <input id="user-id" value={String(userId || "")} disabled className="admin-user-edit-input-disabled" />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>
                    名前
                  </label>
                  <input disabled={isDeleted} value={name} onChange={(e) => setName(e.target.value)} placeholder="名前を入力してください" style={{ width: "100%", boxSizing: "border-box", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }} />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>
                    メールアドレス
                  </label>
                  <input disabled={isDeleted} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="メールアドレスを入力してください" style={{ width: "100%", boxSizing: "border-box", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }} />
                </div>

                <div>
                  <label htmlFor="user-role" style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>
                    権限
                  </label>
                  <select id="user-role" disabled={isDeleted} value={role} onChange={(e) => setRole(e.target.value as "ADMIN" | "USER")} className="admin-user-edit-select">
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>
                    パスワード
                  </label>
                  <input disabled={isDeleted} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="変更する場合のみ入力してください" style={{ width: "100%", boxSizing: "border-box", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }} />
                  <p style={{ margin: "8px 0 0 0", fontSize: "12px", color: "#6b7280" }}>
                    空欄の場合、パスワードは変更しません。
                  </p>
                </div>

                <div style={{ marginTop: "24px", borderTop: "1px solid #e5e7eb", paddingTop: "24px" }}>
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

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "8px" }}>
                  <button type="button" onClick={handleBack} disabled={isSaving} style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 16px", backgroundColor: "#ffffff", color: "#374151", fontSize: "14px", fontWeight: 700, cursor: isSaving ? "not-allowed" : "pointer" }}>
                    キャンセル
                  </button>

                  <button type="button" onClick={handleSave} disabled={isSaving || isLoading || isDeleted} style={{ border: "none", borderRadius: "8px", padding: "10px 16px", backgroundColor: isSaving || isLoading || isDeleted ? "#d1d5db" : "#f97316", color: "#ffffff", fontSize: "14px", fontWeight: 700, cursor: isSaving || isLoading || isDeleted ? "not-allowed" : "pointer" }}>
                    {isSaving ? "保存中..." : "保存する"}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
      <style>{`
        .admin-user-edit-input-disabled,
        .admin-user-edit-select {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 14px;
        }

        .admin-user-edit-input-disabled {
          background-color: #f3f4f6;
          color: #6b7280;
        }

        .admin-user-edit-select {
          background-color: #ffffff;
          color: #111827;
        }
      `}</style>
    </>
  );
}