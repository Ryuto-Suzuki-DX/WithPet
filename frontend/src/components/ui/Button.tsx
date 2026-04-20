"use client";

import { propagateServerField } from "next/dist/server/lib/render-server";
import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isLoading?: boolean;
};

export default function Button({
    children,
    isLoading = false,
    disabled,
    type = "button",
    className = "",
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            className={className}
            {...props}
            style={{
                width: "100%",
                padding: "10px 12px",
                border: "none",
                borderRadius: "8px",
                backgroundColor: disabled || isLoading ? "#9ca3af" : "#2563eb",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "700",
                cursor: disabled || isLoading ? "not-allowed" : "pointer",
                ...(props.style || {}),
            }}
        >
            {isLoading ? "LOADING..." : children}
        </button>
    );
}
