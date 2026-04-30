"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { getMyPage } from "@/api/user";
import { extractData } from "@/api/data";
import type { MyPageData, MyPagePet, MyPageUser } from "@/types/user/user_type";
import SideMenu from "../sideMenu/sideMenu";

export default function UserMyPage() {
  const router = useRouter();

  const [user, setUser] = useState<MyPageUser | null>(null);
  const [pets, setPets] = useState<MyPagePet[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 初回ロード
  useEffect(() => {
    fetchMyPage();
  }, []);

  // マイページ取得
  async function fetchMyPage() {
    setIsLoading(true);
    setError("");

    try {
      const result = await getMyPage();
      const data = extractData<MyPageData>(result);

      setUser(data.user);
      setPets(data.pets ?? []);
    } catch (err) {
      console.error(err);
      setError("マイページ情報の取得に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  }

  // ペット詳細へ遷移
  function handlePetDetail(petId: number) {
    router.push(`/user/pets/${petId}`);
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
                  マイページ
                </h1>
                <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#6b7280" }}>
                  自分の情報と登録済みのペットを確認できます
                </p>
              </div>

              <button type="button" onClick={() => setIsMenuOpen(true)} aria-label="メニューを開く" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "42px", height: "42px", border: "none", borderRadius: "10px", backgroundColor: "#fed7aa", color: "#9a3412", cursor: "pointer" }}>
                <Menu size={22} />
              </button>
            </div>
          </section>

          <section style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)", flex: 1, overflowY: "auto", minHeight: 0 }}>
            {error && (
              <p style={{ margin: "0 0 16px 0", color: "#dc2626", fontSize: "14px", fontWeight: 700 }}>
                {error}
              </p>
            )}

            {isLoading ? (
              <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
                読み込み中です...
              </p>
            ) : !user ? (
              <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
                ユーザー情報がありません。
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#111827" }}>
                    ユーザー情報
                  </h2>

                  <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "160px 1fr", border: "1px solid #e5e7eb", borderRadius: "10px", overflow: "hidden" }}>
                    <div style={{ padding: "12px", backgroundColor: "#f3f4f6", fontSize: "14px", fontWeight: 700, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>
                      ユーザーID
                    </div>
                    <div style={{ padding: "12px", fontSize: "14px", color: "#111827", borderBottom: "1px solid #e5e7eb" }}>
                      {user.id}
                    </div>

                    <div style={{ padding: "12px", backgroundColor: "#f3f4f6", fontSize: "14px", fontWeight: 700, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>
                      名前
                    </div>
                    <div style={{ padding: "12px", fontSize: "14px", color: "#111827", borderBottom: "1px solid #e5e7eb" }}>
                      {user.name}
                    </div>

                    <div style={{ padding: "12px", backgroundColor: "#f3f4f6", fontSize: "14px", fontWeight: 700, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>
                      メールアドレス
                    </div>
                    <div style={{ padding: "12px", fontSize: "14px", color: "#111827", borderBottom: "1px solid #e5e7eb" }}>
                      {user.email}
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px" }}>
                  <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#111827" }}>
                    自分のペット
                  </h2>

                  {pets.length === 0 ? (
                    <p style={{ margin: "12px 0 0 0", fontSize: "14px", color: "#6b7280" }}>
                      登録されているペットはいません。
                    </p>
                  ) : (
                    <div style={{ marginTop: "12px", overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "640px" }}>
                        <thead>
                          <tr style={{ backgroundColor: "#f3f4f6" }}>
                            <th style={{ textAlign: "left", padding: "12px", fontSize: "14px", fontWeight: 700, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>名前</th>
                            <th style={{ textAlign: "left", padding: "12px", fontSize: "14px", fontWeight: 700, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>種別</th>
                            <th style={{ textAlign: "left", padding: "12px", fontSize: "14px", fontWeight: 700, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>性別</th>
                            <th style={{ textAlign: "left", padding: "12px", fontSize: "14px", fontWeight: 700, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>誕生日</th>
                          </tr>
                        </thead>

                        <tbody>
                          {pets.map((pet) => (
                            <tr key={pet.id} onClick={() => handlePetDetail(pet.id)} style={{ backgroundColor: "#ffffff", cursor: "pointer" }}>
                              <td style={{ padding: "12px", fontSize: "14px", color: "#111827", borderBottom: "1px solid #e5e7eb" }}>
                                {pet.name}
                              </td>
                              <td style={{ padding: "12px", fontSize: "14px", color: "#111827", borderBottom: "1px solid #e5e7eb" }}>
                                {pet.type}
                              </td>
                              <td style={{ padding: "12px", fontSize: "14px", color: "#111827", borderBottom: "1px solid #e5e7eb" }}>
                                {pet.sex || "-"}
                              </td>
                              <td style={{ padding: "12px", fontSize: "14px", color: "#111827", borderBottom: "1px solid #e5e7eb" }}>
                                {pet.birthDate || "-"}
                              </td>
                            </tr>
                          ))}
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