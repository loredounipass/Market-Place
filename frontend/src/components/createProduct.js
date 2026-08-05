"use client"

import { useState, useContext } from "react"
import Navbar from "./Navbar"
import { useNavigate } from "react-router-dom"
import useProducts from "../hooks/useProducts"
import { AuthContext } from "../hooks/AuthContext"

const steps = ["Información Básica", "Detalles del Producto", "Imagen y Confirmación"]

const inputBase = "w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-green-500/10 focus:bg-white focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20"

const cardBase = "p-6 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl"

function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center mb-4">
      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mr-3 shrink-0">
        <span className="text-white text-lg">{icon}</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
  )
}

function CreateProduct() {
  const { createProduct, loading, error } = useProducts()
  const { auth } = useContext(AuthContext)
  const [name, setName] = useState("")
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")

  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastSeverity, setToastSeverity] = useState("success")
  const [activeStep, setActiveStep] = useState(0)
  const navigate = useNavigate()

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      ; (async () => {
        try {
          const resized = await resizeAndCropImage(file, 1000)
          setPhoto(resized)
          const reader = new FileReader()
          reader.onloadend = () => setPreview(reader.result)
          reader.readAsDataURL(resized)
        } catch (err) {
          console.error("Error resizing image:", err)
          setPhoto(file)
          const reader = new FileReader()
          reader.onloadend = () => setPreview(reader.result)
          reader.readAsDataURL(file)
        }
      })()
    }
  }

  const resizeAndCropImage = (file, size = 1000) =>
    new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas")
          canvas.width = size
          canvas.height = size
          const ctx = canvas.getContext("2d")

          const ratio = Math.max(size / img.width, size / img.height)
          const w = img.width * ratio
          const h = img.height * ratio
          const dx = (size - w) / 2
          const dy = (size - h) / 2

          ctx.drawImage(img, dx, dy, w, h)

          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error("Canvas is empty"))
              const resizedFile = new File([blob], file.name, { type: file.type })
              resolve(resizedFile)
            },
            file.type || "image/jpeg",
            0.9
          )
        } catch (err) {
          reject(err)
        }
      }
      img.onerror = (e) => reject(e)
      const reader = new FileReader()
      reader.onload = (ev) => {
        img.src = ev.target.result
      }
      reader.onerror = (e) => reject(e)
      reader.readAsDataURL(file)
    })

  const submitProduct = async () => {
    const userEmail = auth?.email || localStorage.getItem("email")

    const missingFields = []
    if (!name) missingFields.push("Nombre")
    if (!category) missingFields.push("Categoría")
    if (!price) missingFields.push("Precio")
    if (!description) missingFields.push("Descripción")
    if (!photo) missingFields.push("Imagen")
    if (!userEmail) missingFields.push("Email de usuario")

    if (missingFields.length > 0) {
      setToastMessage(`Faltan campos: ${missingFields.join(", ")}`)
      setToastSeverity("error")
      setToastOpen(true)
      return
    }

    const formData = new FormData()
    formData.append("name", name)
    formData.append("email", userEmail)
    formData.append("photo", photo)
    formData.append("price", price)
    formData.append("description", description)
    formData.append("category", category)

    await createProduct(formData)

    setToastMessage("Producto creado correctamente")
    setToastSeverity("success")
    setToastOpen(true)
    setName("")
    setPhoto(null)
    setPrice("")
    setDescription("")
    setPreview("")
    setCategory("")
  }

  const validateStep = (step) => {
    switch (step) {
      case 0:
        if (!name) {
          setToastMessage("Por favor, completa el nombre del producto.")
          setToastSeverity("error")
          setToastOpen(true)
          return false
        }
        return true
      case 1:
        if (!category || !price || !description) {
          setToastMessage("Por favor, completa la categoría, precio y descripción.")
          setToastSeverity("error")
          setToastOpen(true)
          return false
        }
        return true
      case 2:
        if (!photo) {
          setToastMessage("Por favor, sube una imagen para el producto.")
          setToastSeverity("error")
          setToastOpen(true)
          return false
        }
        return true
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(Math.min(steps.length - 1, activeStep + 1))
    }
  }

  const handleBack = () => {
    navigate("/")
  }

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case "electronics":
        return "📱"
      case "clothes":
        return "👕"
      case "vehicles":
        return "🚗"
      default:
        return "📦"
    }
  }

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className={cardBase}>
              <SectionHeader icon="🛒" title="Información del Producto" />
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 text-lg">📦</span>
                <input
                  className={`${inputBase} pl-12`}
                  placeholder="Nombre del Producto"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        )
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={cardBase}>
              <SectionHeader icon="🗂️" title="Categoría" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className={`${inputBase} appearance-none bg-white`}
              >
                <option value="">Selecciona una categoría</option>
                <option value="electronics">📱 Electronics</option>
                <option value="clothes">👕 Clothes</option>
                <option value="vehicles">🚗 Vehicles</option>
              </select>
              {category && (
                <span className="mt-3 inline-block px-4 py-1.5 bg-green-500 text-white font-semibold rounded-full">
                  {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
              )}
            </div>

            <div className={cardBase}>
              <SectionHeader icon="💰" title="Precio" />
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 font-semibold">$</span>
                <input
                  type="number"
                  className={`${inputBase} pl-8`}
                  placeholder="Precio del Producto"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              {price && (
                <p className="mt-3 text-3xl font-bold text-green-500 text-center">${price}</p>
              )}
            </div>

            <div className={`${cardBase} md:col-span-2`}>
              <SectionHeader icon="📝" title="Descripción del Producto" />
              <textarea
                rows={4}
                className={inputBase}
                placeholder="Describe tu producto en detalle"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>
        )
      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={cardBase}>
              <SectionHeader icon="📷" title="Imagen del Producto" />
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload">
                <div className="p-6 text-center rounded-2xl border-2 border-dashed border-green-500 bg-green-500/5 cursor-pointer transition-all duration-300 hover:bg-green-500/10 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/20">
                  <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-lg text-green-500 font-semibold">Subir Imagen</p>
                  <p className="text-sm text-gray-500 mt-1">Haz clic para seleccionar una imagen</p>
                </div>
              </label>
            </div>

            <div>
              {preview ? (
                <div className="rounded-2xl overflow-hidden shadow-xl shadow-black/10 h-full animate-fadeIn">
                  <div className="p-3 bg-green-500 text-white text-center">
                    <p className="font-semibold">Vista Previa</p>
                  </div>
                  <img src={preview} alt="Vista previa de la foto" className="w-full h-64 object-cover bg-gray-50" />
                </div>
              ) : (
                <div className="p-8 text-center h-full flex items-center justify-center bg-gray-50 border border-gray-200 rounded-2xl">
                  <div>
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-500">La imagen aparecerá aquí</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      default:
        return "Unknown step"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 mb-6 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 text-white relative overflow-hidden shadow-xl shadow-green-500/20">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
          <div className="flex items-center justify-between relative">
            <div>
              <h1 className="text-3xl font-bold mb-1">Crear Nuevo Producto</h1>
              <p className="text-lg opacity-90">Panel de Gestión de Inventario</p>
            </div>
            <button
              onClick={handleBack}
              className="p-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
              aria-label="Volver"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 mb-6 rounded-2xl shadow-lg shadow-black/5">
          <ol className="flex items-center justify-between">
            {steps.map((label, index) => (
              <li key={label} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${index <= activeStep ? "bg-green-500 text-white shadow-lg shadow-green-500/30" : "bg-gray-100 text-gray-500"
                      }`}
                  >
                    {index < activeStep ? "✓" : index + 1}
                  </div>
                  <span className={`mt-2 text-xs sm:text-sm font-semibold text-center ${index <= activeStep ? "text-green-600" : "text-gray-500"}`}>
                    {label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mt-0 ${index < activeStep ? "bg-green-500" : "bg-gray-200"}`} />
                )}
              </li>
            ))}
          </ol>
        </div>

        <form onSubmit={(e) => e.preventDefault()} noValidate>
          <div className="bg-white p-6 rounded-2xl shadow-lg shadow-black/5 mb-6 animate-fadeIn" key={activeStep}>
            {getStepContent(activeStep)}
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-lg shadow-black/5">
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                disabled={activeStep === 0}
                className="px-5 py-2.5 rounded-xl border-2 border-green-500 text-green-500 font-semibold hover:bg-green-500/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              <div className="flex gap-3">
                {activeStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submitProduct}
                    disabled={loading}
                    className="px-8 py-2.5 rounded-xl bg-green-500 text-white font-bold text-lg shadow-lg shadow-green-500/30 hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-green-500/40 transition-all disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Creando...</span>
                      </span>
                    ) : (
                      "🚀 Crear Producto"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-500 text-red-700 font-semibold animate-fadeIn">
              ⚠️ Error: {error}
            </div>
          )}
        </form>
      </div>

      {toastOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideUp" role="alert">
          <div
            className={`flex items-center px-6 py-4 rounded-xl shadow-2xl border ${toastSeverity === "success"
                ? "bg-green-500 text-white border-green-400"
                : "bg-red-500 text-white border-red-400"
              }`}
          >
            <span className="font-medium">{toastMessage}</span>
            <button onClick={() => setToastOpen(false)} className="ml-4 text-white/80 hover:text-white transition-opacity" aria-label="Cerrar">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.4s ease-out; }
      `}</style>
    </div>
  )
}

export default CreateProduct