import type { Metadata } from "next";
import { APP_CONFIG } from "@/config/app";
import "./global.css";

export const metadata: Metadata = {
    title: APP_CONFIG.name,
    description: `${APP_CONFIG.name} - Internal support ticketing`,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="min-h-screen antialiased">{children}</body>
        </html>
    );
}