import Footer from "./Footer";
import imageAdmin from "/admin-amico.png";
import "../styles/notFound.css";
import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { BsGear } from "react-icons/bs";
import { useSettings } from "../contexts/SettingsContext";
import { useMaterials } from "../contexts/MaterialsContext";
import React, { useState } from "react";
import MaterialsManager from "./MaterialsManager";
import "../styles/dashboard.css";

export default function Admin() {
  const { user, logout, admin } = useAuthContext();
  const { settings, setSettings } = useSettings();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const handleSettingsChange = (e) => {
    const { name, value } = e.target;

    setSettings({
      ...settings,
      [name]: name === "currency" ? value : Number(value),
    });
  };

  // Protección por si entra sin ser admin
  if (!admin) return <Navigate to="/login" replace />;
  return (
  <div className="container py-4">

    {/* FILA SUPERIOR */}
    <div className="row g-4 align-items-stretch mb-4">

      {/* CARD BIENVENIDA */}
      <div className="col-lg-5">
        <div className="admin-welcome-card text-center shadow-sm rounded-4 p-4 h-100">

          <h4 className="cute-title mb-3">
            ¡Hola Administrador!
          </h4>

          <p className="mb-3">
            Sesión iniciada como{" "}
            <strong>
              {typeof user === "string" ? user : user.email}
            </strong>
          </p>

          <img
            src={imageAdmin}
            alt="Admin"
            className="img-fluid mb-3"
            style={{
              maxWidth: "220px",
            }}
          />

          <div className="d-flex justify-content-center gap-2 flex-wrap">

            <Link
              to="/admin/panel"
              className="btn btn-primary"
            >
              <BsGear className="me-2" />
              Gestionar productos
            </Link>

            <button
              className="btn btn-danger"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-2" />
              Salir
            </button>

          </div>
        </div>
      </div>

      {/* CONFIGURACIÓN */}
      <div className="col-lg-7">
        <div className="dashboard-card shadow-sm p-4 h-100">

          <h4 className="cute-title mb-4">
            Configuración global de costos
          </h4>

          <div className="mb-3">
            <label className="form-label">
              Moneda
            </label>

            <select
              className="form-select"
              name="currency"
              value={settings.currency}
              onChange={handleSettingsChange}
            >
              <option value="ARS">ARS</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">
              Valor hora de trabajo
            </label>

            <input
              type="number"
              className="form-control"
              name="hourlyRate"
              value={settings.hourlyRate}
              onChange={handleSettingsChange}
              min="0"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Índice de ganancia
            </label>

            <input
              type="number"
              className="form-control"
              name="profitIndex"
              value={settings.profitIndex}
              onChange={handleSettingsChange}
              min="1"
              step="0.1"
            />
          </div>

        </div>
      </div>
    </div>

    {/* FILA INFERIOR */}
    <div className="row mb-5">
      <div className="col-12">
        <MaterialsManager />
      </div>
    </div>

    {/* FOOTER */}
    <div className="mt-5">
      <Footer />
    </div>

  </div>
);
}
