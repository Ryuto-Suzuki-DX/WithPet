"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Send } from "lucide-react";
import {
  getRemindSetting,
  sendRemindTestEmail,
  updateRemindSetting,
} from "@/api/user";
import { extractData } from "@/api/data";
import type { RemindSetting } from "@/types/user/user_setting_type";
import SideMenu from "@/app/user/sideMenu/sideMenu";

export default function UserRemindSettingPage() {
  const router = useRouter();

  const [isEmailEnabled, setIsEmailEnabled] = useState(true);
  const [remindDaysBefore, setRemindDaysBefore] = useState(1);
  const [remindHour, setRemindHour] = useState(9);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [testMessage, setTestMessage] = useState("");

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const remindTime = `${String(remindHour).padStart(2, "0")}:00`;

  useEffect(() => {
    fetchRemindSetting();
  }, []);

  async function fetchRemindSetting() {
    setIsLoading(true);
    setError("");
    setSuccessMessage("");
    setTestMessage("");

    try {
      const result = await getRemindSetting();
      const setting = extractData<RemindSetting>(result);

      setIsEmailEnabled(setting.isEmailEnabled);
      setRemindDaysBefore(setting.remindDaysBefore);
      setRemindHour(setting.remindHour);
    } catch (err) {
      console.error(err);
      setError("リマインド設定の取得に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    setError("");
    setSuccessMessage("");
    setTestMessage("");

    if (remindDaysBefore < 0) {
      setError("通知日は0日以上で入力してください。");
      return;
    }

    if (remindHour < 0 || remindHour > 23) {
      setError("通知時刻を正しく入力してください。");
      return;
    }

    setIsSaving(true);

    try {
      await updateRemindSetting({
        isEmailEnabled,
        remindDaysBefore,
        remindHour,
      });

      setSuccessMessage("リマインド設定を保存しました。");
    } catch (err) {
      console.error(err);
      setError("リマインド設定の保存に失敗しました。");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSendTestEmail() {
    setError("");
    setSuccessMessage("");
    setTestMessage("");

    setIsSendingTest(true);

    try {
      await sendRemindTestEmail();
      setTestMessage("テストメールを送信しました。ログイン中ユーザーのメールアドレスを確認してください。");
    } catch (err) {
      console.error(err);
      setError("テストメールの送信に失敗しました。");
    } finally {
      setIsSendingTest(false);
    }
  }

  function handleBack() {
    router.push("/user/settings");
  }

  return (
    <>
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main style={{ height: "100vh", backgroundColor: "#f9fafb", padding: "24px", overflow: "hidden" }}>
        <div style={{ maxWidth: "1000px", height: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
          <section style={{ backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)", padding: "24px", flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <div>
                <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: "#111827" }}>リマインド設定</h1>
                <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#6b7280" }}>
                  新規作成時に初期表示するリマインドのデフォルト値を設定できます
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button type="button" onClick={handleBack} style={{ border: "1px solid #d1d5db", backgroundColor: "#ffffff", color: "#374151", borderRadius: "8px", padding: "10px 16px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
                  設定へ戻る
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
          </section>

          <section style={{ backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)", padding: "24px", flex: 1, overflowY: "auto", minHeight: 0 }}>
            {error && <p style={{ margin: "0 0 16px", color: "#dc2626", fontSize: "14px", fontWeight: 700 }}>{error}</p>}

            {successMessage && <p style={{ margin: "0 0 16px", color: "#166534", fontSize: "14px", fontWeight: 700 }}>{successMessage}</p>}

            {testMessage && <p style={{ margin: "0 0 16px", color: "#166534", fontSize: "14px", fontWeight: 700 }}>{testMessage}</p>}

            {isLoading ? (
              <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#6b7280" }}>読み込み中です...</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#111827" }}>デフォルトリマインド</h2>

                  <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#6b7280", lineHeight: 1.7 }}>
                    ワクチン、薬、食事、予定などを新規作成するとき、この設定が初期値として使われます。
                    個別の登録画面で変更した場合は、その登録だけ別のリマインド時間にできます。
                  </p>
                </div>

                <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px", backgroundColor: "#ffffff" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", fontSize: "15px", fontWeight: 700, color: "#111827" }}>
                    <input
                      type="checkbox"
                      checked={isEmailEnabled}
                      onChange={(e) => setIsEmailEnabled(e.target.checked)}
                      style={{ width: "18px", height: "18px", cursor: "pointer" }}
                    />
                    <span>メール通知をデフォルトで有効にする</span>
                  </label>

                  <p style={{ margin: "8px 0 0 30px", fontSize: "13px", color: "#6b7280", lineHeight: 1.6 }}>
                    OFFにすると、新規作成時のリマインド初期値は無効になります。
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label htmlFor="remindDaysBefore" style={{ fontSize: "14px", fontWeight: 700, color: "#374151" }}>
                      何日前に通知するか
                    </label>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        id="remindDaysBefore"
                        type="number"
                        min={0}
                        value={remindDaysBefore}
                        onChange={(e) => setRemindDaysBefore(Number(e.target.value))}
                        disabled={!isEmailEnabled}
                        style={{ width: "120px", boxSizing: "border-box", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", backgroundColor: isEmailEnabled ? "#ffffff" : "#f3f4f6", color: isEmailEnabled ? "#111827" : "#9ca3af", fontSize: "14px" }}
                      />

                      <span style={{ fontSize: "14px", color: "#374151" }}>日前</span>
                    </div>

                    <p style={{ margin: "8px 0 0 30px", fontSize: "13px", color: "#6b7280", lineHeight: 1.6 }}>
                      0を指定すると、予定日当日に通知します。
                    </p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label htmlFor="remindTime" style={{ fontSize: "14px", fontWeight: 700, color: "#374151" }}>
                      通知時刻
                    </label>

                    <input
                      id="remindTime"
                      type="time"
                      value={remindTime}
                      onChange={(e) => {
                        const hour = Number(e.target.value.split(":")[0]);
                        setRemindHour(hour);
                      }}
                      disabled={!isEmailEnabled}
                      style={{ width: "160px", boxSizing: "border-box", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", backgroundColor: isEmailEnabled ? "#ffffff" : "#f3f4f6", color: isEmailEnabled ? "#111827" : "#9ca3af", fontSize: "14px" }}
                    />

                    <p style={{ margin: "8px 0 0 30px", fontSize: "13px", color: "#6b7280", lineHeight: 1.6 }}>
                      新規作成画面で初期表示される通知時刻です。
                    </p>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "20px" }}>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827" }}>現在の初期値</h3>

                  <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#374151", lineHeight: 1.7 }}>
                    {isEmailEnabled
                      ? remindDaysBefore === 0
                        ? `予定日当日の ${remindTime} にメール通知する設定です。`
                        : `予定日の${remindDaysBefore}日前 ${remindTime} にメール通知する設定です。`
                      : "新規作成時のリマインドは無効になります。"}
                  </p>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap", border: "1px solid #fed7aa", borderRadius: "12px", padding: "20px", backgroundColor: "#fff7ed" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827" }}>テストメール送信</h3>
                    <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#6b7280", lineHeight: 1.7 }}>
                      現在ログインしているユーザーのメールアドレス宛に、テスト用のリマインドメールを送信します。
                      メール送信設定や受信確認をするときに使用してください。
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSendTestEmail}
                    disabled={isSendingTest}
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "none", borderRadius: "8px", padding: "10px 16px", backgroundColor: isSendingTest ? "#d1d5db" : "#ea580c", color: "#ffffff", fontSize: "14px", fontWeight: 700, cursor: isSendingTest ? "not-allowed" : "pointer" }}
                  >
                    <Send size={17} />
                    {isSendingTest ? "送信中..." : "テストメールを送信"}
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "flex-end", marginTop: "8px" }}>
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isSaving}
                    style={{ border: "1px solid #d1d5db", backgroundColor: "#ffffff", color: "#374151", borderRadius: "8px", padding: "10px 16px", fontSize: "14px", fontWeight: 700, cursor: isSaving ? "not-allowed" : "pointer", opacity: isSaving ? 0.6 : 1 }}
                  >
                    キャンセル
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    style={{ border: "none", backgroundColor: "#f97316", color: "#ffffff", borderRadius: "8px", padding: "10px 16px", fontSize: "14px", fontWeight: 700, cursor: isSaving ? "not-allowed" : "pointer", opacity: isSaving ? 0.6 : 1 }}
                  >
                    {isSaving ? "保存中..." : "保存する"}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
