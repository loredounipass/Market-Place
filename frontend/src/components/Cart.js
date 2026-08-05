"use client"

import React from "react"

function CartDrawer({ open, onClose, items = [], onRemove = () => {}, onUpdateQty = () => {} }) {
  const total = items.reduce((s, it) => s + (parseFloat(it.price || 0) * (it.qty || 1)), 0)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="fixed inset-y-0 right-0 w-96 max-w-full bg-white p-4 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Carrito de Compras</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Cerrar carrito">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <hr className="border-gray-200" />

        <div className="flex-1 overflow-auto mt-4">
          {items.length === 0 ? (
            <p className="text-gray-500 text-center mt-8">Tu carrito está vacío</p>
          ) : (
            <ul>
              {items.map((it, idx) => (
                <li key={idx} className="py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{it.name || 'Producto'} <span className="text-gray-500">x{it.qty || 1}</span></p>
                      <p className="text-gray-600">${(parseFloat(it.price || 0) * (it.qty || 1)).toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <button onClick={() => onUpdateQty(it, (it.qty || 1) + 1)} className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-100 transition-colors">+</button>
                      <button onClick={() => onUpdateQty(it, Math.max(1, (it.qty || 1) - 1))} className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-100 transition-colors">-</button>
                      <button onClick={() => onRemove(it)} className="text-xs px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 transition-colors">Eliminar</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <hr className="border-gray-200" />

        <div className="mt-4 flex justify-between items-center">
          <span className="font-bold text-gray-900">Total</span>
          <span className="font-extrabold text-gray-900">${total.toFixed(2)}</span>
        </div>

        <button className="mt-4 w-full py-3 rounded-lg bg-gradient-to-r from-green-800 to-green-600 text-white font-bold shadow-lg shadow-green-500/30 hover:from-green-900 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed" disabled={items.length === 0}>
          Comprar
        </button>
      </div>
    </div>
  )
}

export default CartDrawer