import React from 'react'
import { useCompraForm } from '../hooks/useCompraForm'
import "../styles/modal.css"

export default function Formulario({ paquete, onClose }) {

  const {
    form,
    errors,
    loading,
    success,
    setField,
    handleVencimiento,
    handleSubmit,
    reset,
  } = useCompraForm()

  const handleClose = () => {
    reset();
    onClose();
  }

  if (!paquete) return null

  return (
    <div
      className="compra-overlay"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="compra-modal">

        {/* ── HEADER ── */}
        <div className="compra-modal-header">
          <span className="compra-modal-title">Comprar fichas</span>
          <button className="compra-modal-close" onClick={handleClose}>×</button>
        </div>

        {success ? (
          /* ── SUCCESS ── */
          <div className="compra-modal-success">
            <div className="compra-success-icon">🎰</div>
            <h3>¡Compra exitosa!</h3>
            <p>
              Recibiste{" "}
              <strong>{paquete.fichas.toLocaleString()} fichas</strong>
            </p>
            <p>
              Confirmación enviada a <strong>{form.email}</strong>
            </p>
            <button className="compra-btn-confirm" onClick={handleClose}>
              Cerrar
            </button>
          </div>
        ) : (
          <>
            {/* ── RESUMEN ── */}
            <div className="compra-modal-summary">
              <div>
                <span className="compra-summary-label">{paquete.nombre}</span>
                <span className="compra-summary-fichas">
                  {paquete.fichas.toLocaleString()} fichas
                </span>
              </div>
              <span className="compra-summary-price">{paquete.precio}</span>
            </div>

            {/* ── NOMBRE ── */}
            <div className="compra-field">
              <label htmlFor="nombre">Nombre completo</label>
              <input
                id="nombre"
                type="text"
                placeholder="Juan Pérez"
                value={form.nombre}
                onChange={(e) => setField("nombre", e.target.value)}
                className={errors.nombre ? "compra-input-error" : ""}
              />
              {errors.nombre && (
                <span className="compra-error-msg">{errors.nombre}</span>
              )}
            </div>

            {/* ── EMAIL ── */}
            <div className="compra-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="juan@email.com"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                className={errors.email ? "compra-input-error" : ""}
              />
              {errors.email && (
                <span className="compra-error-msg">{errors.email}</span>
              )}
            </div>

            {/* ── MÉTODO DE PAGO ── */}
            <div className="compra-field">
              <label htmlFor="metodo">Método de pago</label>
              <select
                id="metodo"
                value={form.metodo}
                onChange={(e) => setField("metodo", e.target.value)}
                className={errors.metodo ? "compra-input-error" : ""}
              >
                <option value="">Seleccionar...</option>
                <option value="tarjeta">Tarjeta crédito / débito</option>
                <option value="nequi">Nequi</option>
                <option value="daviplata">Daviplata</option>
                <option value="pse">PSE</option>
              </select>
              {errors.metodo && (
                <span className="compra-error-msg">{errors.metodo}</span>
              )}
            </div>

            {/* ── TARJETA ── */}
            {form.metodo === "tarjeta" && (
              <div className="compra-field-row">

                <div className="compra-field">
                  <label htmlFor="tarjeta">Número de tarjeta</label>
                  <input
                    id="tarjeta"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    maxLength={16}
                    value={form.tarjeta}
                    onChange={(e) =>
                      setField("tarjeta", e.target.value.replace(/\D/g, ""))
                    }
                    className={errors.tarjeta ? "compra-input-error" : ""}
                  />
                  {errors.tarjeta && (
                    <span className="compra-error-msg">{errors.tarjeta}</span>
                  )}
                </div>

                <div className="compra-field">
                  <label htmlFor="vencimiento">Vencimiento</label>
                  <input
                    id="vencimiento"
                    type="text"
                    placeholder="MM/AA"
                    maxLength={5}
                    value={form.vencimiento}
                    onChange={(e) => handleVencimiento(e.target.value)}
                    className={errors.vencimiento ? "compra-input-error" : ""}
                  />
                  {errors.vencimiento && (
                    <span className="compra-error-msg">{errors.vencimiento}</span>
                  )}
                </div>

              </div>
            )}

            {/* ── BOTÓN ── */}
            <button
              className="compra-btn-confirm"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? "Procesando..."
                : `Confirmar compra — ${paquete.precio}`}
            </button>
          </>
        )}
      </div>
    </div>
  )
}