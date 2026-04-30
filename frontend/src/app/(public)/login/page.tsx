"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { useAuth } from "../../../hooks/useAuth";

/*
 * ログインページ
 */

export default function LoginPage() {
    const router = useRouter();
    const { login, isLoading, error } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const[localError, setLocalError] = useState("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLocalError("");

        if (!email.trim()) {
            setLocalError("メールアドレスを入力してください。");
            return;
        }

        if (!password.trim()) {
            setLocalError("パスワードを入力してください。");
            return;
        }

        try {
            const user = await login({ email, password });

            console.log("login result user =", user);
            console.log("login result role =", user.role);

            //　管理者の場合、ユーザーマネジメントページへ遷移
            if (user.role === "ADMIN") {
                router.push("/admin/users");
                return;
            }

            // 一般ユーザーの場合、マイページへ遷移
            router.push("/user/mypage")
        } catch {
            // errorは useAuthから提供されるエラーを表示
        }
    }

    return (
        <main
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f3f4f6",
                padding: "24px",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "420px",
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    padding: "24px",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                    boxSizing: "border-box",
                }}
            >
                <h1
                    style={{
                        margin: "0 0 20px 0",
                        fontSize: "24px",
                        fontWeight: 700,
                        color: "#111827",
                        textAlign: "center",
                    }}
                >
                    ログイン
                </h1>

                <form
                    onSubmit={handleSubmit}
                    style={{ display: "flex", flexDirection: "column", gap: "16px" }}
                >
                    <Input
                        label="メールアドレス"
                        name="email"
                        type="email"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        label="パスワード"
                        name="password"
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {(localError || error) && (
                        <p
                            style={{
                                margin: 0,
                                fontSize: "14px",
                                color: "#dc2626",
                                textAlign: "center",
                            }}
                        >
                            {localError || error}
                        </p>
                    )}

                    <Button type="submit" isLoading={isLoading}>
                        ログイン
                    </Button>
                </form>
            </div>
        </main>
    );
}
