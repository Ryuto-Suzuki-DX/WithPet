"use client";

import Link from "next/link";

type SideMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.25)", zIndex: 1001 }}
        />
      )}

      <aside
        style={{ position: "fixed", top: 0, right: isOpen ? 0 : "-320px", width: "320px", height: "100vh", backgroundColor: "#ffedd5", boxShadow: "-4px 0 16px rgba(0, 0, 0, 0.12)", zIndex: 1002, transition: "right 0.3s ease", padding: "24px 20px", display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#9a3412" }}>User Menu</h2>

          <button
            type="button"
            onClick={onClose}
            style={{ border: "none", background: "transparent", color: "#9a3412", fontSize: "24px", fontWeight: 700, cursor: "pointer", lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        <Link href="/user/mypage" onClick={onClose} style={{ display: "block", padding: "12px 14px", borderRadius: "10px", backgroundColor: "#ffffff", color: "#7c2d12", textDecoration: "none", fontWeight: 700 }}>
          マイページ
        </Link>

        <Link href="/user/pets" onClick={onClose} style={{ display: "block", padding: "12px 14px", borderRadius: "10px", backgroundColor: "#ffffff", color: "#7c2d12", textDecoration: "none", fontWeight: 700 }}>
          ペット一覧
        </Link>

        <Link href="/user/pets/new" onClick={onClose} style={{ display: "block", padding: "12px 14px", borderRadius: "10px", backgroundColor: "#ffffff", color: "#7c2d12", textDecoration: "none", fontWeight: 700 }}>
          ペット追加
        </Link>

        <Link href="/user/care-templates" onClick={onClose} style={{ display: "block", padding: "12px 14px", borderRadius: "10px", backgroundColor: "#ffffff", color: "#7c2d12", textDecoration: "none", fontWeight: 700 }}>
          食事・おやつ・薬管理
        </Link>

        <Link href="/user/settings" onClick={onClose} style={{ display: "block", padding: "12px 14px", borderRadius: "10px", backgroundColor: "#ffffff", color: "#7c2d12", textDecoration: "none", fontWeight: 700 }}>
          設定
        </Link>
      </aside>
    </>
  );
}