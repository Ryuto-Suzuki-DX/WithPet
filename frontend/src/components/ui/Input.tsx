"use client";

import * as React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
};

export default function Input({
    label,
    error,
    id,
    className = "",
    ...props
}: InputProps) {
    const inputId = id || props.name;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {label && (
                <label
                    htmlFor={inputId}
                    style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={className}
                {...props}
                style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: error ? "1px solid #dc2626" : "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                    ...(props.style || {}),
                }}
            />  

            {error && (
                <p style={{ margin: 0, fontSize: "12px", color: "#dc2626" }}>{error}</p>
            )}
            </div>
    );
}