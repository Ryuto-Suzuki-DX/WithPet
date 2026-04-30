"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import SideMenu from "@/app/user/sideMenu/sideMenu";

export default function UserSettingsPage() {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // リマインド設定画面へ遷移
  function handleRemindSetting() {
    router.push("/user/settings/remind");
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
                  設定
                </h1>
                <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#6b7280" }}>
                  アプリで使用する各種設定を変更できます
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                aria-label="メニューを開く"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "42px", height: "42px", border: "none", borderRadius: "10px", backgroundColor: "#fed7aa", color: "#9a3412", cursor: "pointer" }}
              >
                <Menu size={22} />
              </button>
            </div>
          </section>

          <section style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)", flex: 1, overflowY: "auto", minHeight: 0 }}>
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#111827" }}>
              設定項目
            </h2>

            <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#6b7280" }}>
              変更したい設定項目を選択してください。
            </p>

            <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
              <button
                type="button"
                onClick={handleRemindSetting}
                style={{ width: "100%", border: "1px solid #fed7aa", borderRadius: "12px", padding: "20px", backgroundColor: "#fff7ed", textAlign: "left", cursor: "pointer", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: "#9a3412" }}>
                      リマインド設定
                    </h3>
                    <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#7c2d12", lineHeight: 1.7 }}>
                      新規作成時に初期表示されるリマインドの有効状態、何日前に通知するか、通知時刻を設定します。
                    </p>
                  </div>

                  <span style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "999px", backgroundColor: "#fed7aa", color: "#9a3412", fontSize: "16px", fontWeight: 700 }}>
                    
                  </span>
                </div>

                <div style={{ marginTop: "16px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  <span style={{ display: "inline-block", borderRadius: "999px", padding: "4px 10px", backgroundColor: "#ffffff", color: "#9a3412", fontSize: "12px", fontWeight: 700 }}>
                    デフォルトON/OFF
                  </span>
                  <span style={{ display: "inline-block", borderRadius: "999px", padding: "4px 10px", backgroundColor: "#ffffff", color: "#9a3412", fontSize: "12px", fontWeight: 700 }}>
                    何日前
                  </span>
                  <span style={{ display: "inline-block", borderRadius: "999px", padding: "4px 10px", backgroundColor: "#ffffff", color: "#9a3412", fontSize: "12px", fontWeight: 700 }}>
                    通知時刻
                  </span>
                </div>
              </button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}