"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import SideMenu from "../../sideMenu/sideMenu";
import { createUser } from "@/api/admin";
import type { CreateUserRequest } from "@/types/admin/admin_type";

export default function AdminUserCreatePage() {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [form, setForm] = useState<CreateUserRequest>({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange<K extends keyof CreateUserRequest>(
    key: K,
    value: CreateUserRequest[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSave() {
    setError("");

    if (!form.name.trim()) {
      setError("名前を入力してください。");
      return;
    }

    if (!form.email.trim()) {
      setError("メールアドレスを入力してください。");
      return;
    }

    if (!form.password.trim()) {
      setError("パスワードを入力してください。");
      return;
    }

    setIsSaving(true);

    try {
      await createUser(form);
      router.push("/admin/users");
    } catch (err) {
      console.error(err);

      if (err instanceof Error && err.message) {
        setError(err.message);
        return;
      }

      setError("ユーザーの新規作成に失敗しました。");
    } finally {
      setIsSaving(false);
    }
  }

  function handleBack() {
    router.push("/admin/users");
  }

  return (
    <>
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main
        style={{
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
          padding: "24px",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <section
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  ユーザー新規作成
                </h1>
                <p
                  style={{
                    margin: "8px 0 0 0",
                    fontSize: "14px",
                    color: "#6b7280",
                  }}
                >
                  管理者画面から新しいユーザーを登録できます
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                aria-label="メニューを開く"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "42px",
                  height: "42px",
                  border: "none",
                  borderRadius: "10px",
                  backgroundColor: "#fed7aa",
                  color: "#9a3412",
                  cursor: "pointer",
                }}
              >
                <Menu size={22} />
              </button>
            </div>
          </section>

          <section
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <div>
                <label
                  htmlFor="name"
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#374151",
                  }}
                >
                  名前
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  disabled={isSaving}
                  style={{
                    width: "100%",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    padding: "12px 14px",
                    fontSize: "14px",
                    color: "#111827",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#374151",
                  }}
                >
                  メールアドレス
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  disabled={isSaving}
                  style={{
                    width: "100%",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    padding: "12px 14px",
                    fontSize: "14px",
                    color: "#111827",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#374151",
                  }}
                >
                  パスワード
                </label>
                <input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  disabled={isSaving}
                  style={{
                    width: "100%",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    padding: "12px 14px",
                    fontSize: "14px",
                    color: "#111827",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="role"
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#374151",
                  }}
                >
                  権限
                </label>
                <select
                  id="role"
                  value={form.role}
                  onChange={(e) =>
                    handleChange("role", e.target.value as "ADMIN" | "USER")
                  }
                  disabled={isSaving}
                  style={{
                    width: "100%",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    padding: "12px 14px",
                    fontSize: "14px",
                    color: "#111827",
                    outline: "none",
                    backgroundColor: "#ffffff",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              {error && (
                <p
                  style={{
                    margin: 0,
                    color: "#dc2626",
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                >
                  {error}
                </p>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginTop: "8px",
                }}
              >
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSaving}
                  style={{
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    padding: "10px 16px",
                    backgroundColor: "#ffffff",
                    color: "#374151",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: isSaving ? "not-allowed" : "pointer",
                  }}
                >
                  一覧へ戻る
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  style={{
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 16px",
                    backgroundColor: isSaving ? "#d1d5db" : "#f97316",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: isSaving ? "not-allowed" : "pointer",
                  }}
                >
                  {isSaving ? "保存中..." : "保存"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}