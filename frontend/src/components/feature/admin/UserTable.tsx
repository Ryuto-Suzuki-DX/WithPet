type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type UserTableProps = {
  users: User[];
  isLoading: boolean;
};

export default function UserTable({ users, isLoading }: UserTableProps) {
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
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td
                style={{
                  padding: "12px",
                  fontSize: "14px",
                  color: "#111827",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                {user.id}
              </td>
              <td
                style={{
                  padding: "12px",
                  fontSize: "14px",
                  color: "#111827",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                {user.name}
              </td>
              <td
                style={{
                  padding: "12px",
                  fontSize: "14px",
                  color: "#111827",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                {user.email}
              </td>
              <td
                style={{
                  padding: "12px",
                  fontSize: "14px",
                  color: "#111827",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                {user.role}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}