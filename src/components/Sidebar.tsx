"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <Link href="/" className="sidebar-logo">
                    <Image
                        src="/logo-sura.svg"
                        alt="Sura"
                        width={100}
                        height={32}
                        className="sidebar-logo-img"
                        priority
                    />
                    <div className="sidebar-logo-text">
                        <span className="sidebar-logo-title">Portal</span>
                        <span className="sidebar-logo-subtitle">Aprobaciones</span>
                    </div>
                </Link>
            </div>

            <nav className="sidebar-nav">
                <Link
                    href="/"
                    className={`sidebar-nav-item ${pathname === "/" ? "active" : ""}`}
                >
                    <span className="sidebar-nav-icon">📊</span>
                    Dashboard
                </Link>
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-status">
                    <span className="sidebar-status-dot"></span>
                    Conectado a Shopify
                </div>
            </div>
        </aside>
    );
}
