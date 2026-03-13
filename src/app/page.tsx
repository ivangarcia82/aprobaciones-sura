"use client";

import { useEffect, useState } from "react";
import { DraftOrder } from "@/lib/shopify";
import { OrderTable } from "@/components/OrderTable";

interface DashboardData {
  orders: DraftOrder[];
  summary: {
    total: number;
    pendientes: number;
    aprobadas: number;
    urgentes: number;
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/draft-orders");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setData(json);
    } catch {
      setError("Error al cargar las órdenes. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Cargando órdenes corporativas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">⚠️</div>
        <div className="empty-state-title">{error}</div>
        <button
          className="filter-btn"
          onClick={fetchOrders}
          style={{ marginTop: 16 }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Gestión de cotizaciones corporativas
        </p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card animate-in animate-in-delay-1">
          <div className="kpi-card-icon total">📋</div>
          <div className="kpi-card-value">{data.summary.total}</div>
          <div className="kpi-card-label">Total Órdenes</div>
        </div>
        <div className="kpi-card animate-in animate-in-delay-2">
          <div className="kpi-card-icon pending">⏳</div>
          <div className="kpi-card-value">{data.summary.pendientes}</div>
          <div className="kpi-card-label">Pendientes de Aprobación</div>
        </div>
        <div className="kpi-card animate-in animate-in-delay-3">
          <div className="kpi-card-icon approved">✅</div>
          <div className="kpi-card-value">{data.summary.aprobadas}</div>
          <div className="kpi-card-label">Aprobadas</div>
        </div>
        <div className="kpi-card animate-in animate-in-delay-4">
          <div className="kpi-card-icon urgent">🚨</div>
          <div className="kpi-card-value">{data.summary.urgentes}</div>
          <div className="kpi-card-label">Urgentes</div>
        </div>
      </div>

      <OrderTable orders={data.orders} />
    </>
  );
}

