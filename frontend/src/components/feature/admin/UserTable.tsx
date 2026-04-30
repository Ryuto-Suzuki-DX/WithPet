import type { User } from "@/types/admin/admin_type";

type UserTableProps = {
  users: User[];
  isLoading: boolean;
  onDetail: (userId: number) => void;
  onUpdate: (userId: number) => void;
  onDelete: (user: User) => void;
  currentUserId: number | null;
};

export default function UserTable({
  users,
  isLoading,
  onDetail,
  onUpdate,
  onDelete,
  currentUserId,
}: UserTableProps) {
  if (isLoading) {
    return (
      <p
        style={{
          margin: 0,
          fontSize: "14px",
          color: "#6b7280",
        }}
      >
        読み込み中です...
      </p>
    );
  }

  if (users.length === 0) {
    return (
      <p
        style={{
          margin: 0,
          fontSize: "14px",
          color: "#6b7280",
        }}
      >
        ユーザーが見つかりませんでした。
      </p>
    );
  }

  return (
    <div
      style={{
        overflowX: "auto",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          minWidth: "720px",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#f3f4f6",
            }}
          >
            <th
              style={{
                textAlign: "left",
                padding: "12px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#374151",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              ID
            </th>
            <th
              style={{
                textAlign: "left",
                padding: "12px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#374151",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              名前
            </th>
            <th
              style={{
                textAlign: "left",
                padding: "12px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#374151",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              メールアドレス
            </th>
            <th
              style={{
                textAlign: "left",
                padding: "12px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#374151",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              権限
            </th>
            <th
              style={{
                textAlign: "left",
                padding: "12px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#374151",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              状態
            </th>

            <th
              style={{
                textAlign: "left",
                padding: "12px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#374151",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              操作
            </th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => {
            const isSelf = currentUserId === user.id;
            const isDeleted = user.isDeleted;
            const isDisabled = isSelf || isDeleted;

            return (
              <tr key={user.id} style={{ backgroundColor: isDeleted ? "#f3f4f6" : "#ffffff" }}>
              <td
                style={{
                  padding: "12px",
                  fontSize: "14px",
                  color: isDeleted ? "#9ca3af" : "#111827",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                {user.id}
              </td>
              <td
                style={{
                  padding: "12px",
                  fontSize: "14px",
                  color: isDeleted ? "#9ca3af" : "#111827",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                {user.name}
              </td>
              <td
                style={{
                  padding: "12px",
                  fontSize: "14px",
                  color: isDeleted ? "#9ca3af" : "#111827",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                {user.email}
              </td>
              <td
                style={{
                  padding: "12px",
                  fontSize: "14px",
                  color: isDeleted ? "#9ca3af" : "#111827",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                {user.role}
              </td>
              <td
                style={{
                  padding: "12px",
                  fontSize: "14px",
                  color: isDeleted ? "#9ca3af" : "#111827",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    borderRadius: "999px",
                    padding: "4px 10px",
                    backgroundColor: isDeleted ? "#e5e7eb" : "#dcfce7",
                    color: isDeleted ? "#6b7280" : "#166534",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  {isDeleted ? "削除済み" : "有効"}
                </span>
              </td>
              <td
                style={{
                  padding: "12px",
                  fontSize: "14px",
                  color: isDeleted ? "#9ca3af" : "#111827",
                  borderBottom: "1px solid #e5e7eb",
                  whiteSpace: "nowrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => onDetail(user.id)}
                    style={{
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 10px",
                      backgroundColor: "#2563eb",
                      color: "#ffffff",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    詳細
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdate(user.id)}
                    disabled={isDisabled}
                    style={{
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 10px",
                      backgroundColor: isDisabled ? "#d1d5db" : "#f97316",
                      color: "#ffffff",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: isDisabled ? "not-allowed" : "pointer",
                      opacity: isDisabled ? 0.5 : 1,
                    }}
                  >
                    編集
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(user)}
                    disabled={isDisabled}
                    style={{
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 10px",
                      backgroundColor: isDisabled ? "#d1d5db" : "#dc2626",
                      color: "#ffffff",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: isDisabled ? "not-allowed" : "pointer",
                      opacity: isDisabled ? 0.5 : 1,
                    }}
                  >
                    削除
                  </button>
                </div>
              </td>
            </tr>
          );
          })}
        </tbody>
      </table>
    </div>
  );
}