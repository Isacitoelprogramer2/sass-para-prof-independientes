"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ImageUp, X, AlertCircle } from "lucide-react"

type FileWithPreview = {
  file: File
  preview: string
}

interface ImageUploaderProps {
  onImageChange?: (file: File | null) => void
  imagenPreview?: string
  imagenExistente?: string
  error?: string
  onRemoveImage?: () => void
}

export default function ImageUploader({ 
  onImageChange, 
  imagenPreview, 
  imagenExistente, 
  error: externalError, 
  onRemoveImage 
}: ImageUploaderProps) {
  const [file, setFile] = useState<FileWithPreview | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const maxSizeMB = 5
  const maxSize = maxSizeMB * 1024 * 1024

  // Sincronizar con props externas
  useEffect(() => {
    if (externalError) {
      setError(externalError)
    } else {
      setError(null)
    }
  }, [externalError])

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      setError("Por favor selecciona un archivo de imagen válido")
      return
    }
    if (selectedFile.size > maxSize) {
      setError(`La imagen no puede ser mayor a ${maxSizeMB}MB`)
      return
    }
    setError(null)
    
    const fileWithPreview = {
      file: selectedFile,
      preview: URL.createObjectURL(selectedFile),
    }
    setFile(fileWithPreview)
    
    // Notificar al componente padre
    if (onImageChange) {
      onImageChange(selectedFile)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) handleFile(droppedFile)
  }, [])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (uploadedFile) handleFile(uploadedFile)
  }

  const removeFile = () => {
    setFile(null)
    setError(null)
    
    // Notificar al componente padre
    if (onRemoveImage) {
      onRemoveImage()
    } else if (onImageChange) {
      onImageChange(null)
    }
  }

  // Determinar qué imagen mostrar
  const getImageToShow = () => {
    if (imagenPreview) return imagenPreview
    if (file) return file.preview
    if (imagenExistente) return imagenExistente
    return null
  }

  const imageToShow = getImageToShow()
  const currentError = error || externalError

  return (
    <div className="flex flex-col items-center gap-3 w-full ">
      <div
        className={`relative w-full min-h-56 flex items-center justify-center rounded-xl border-2 border-dashed cursor-pointer transition-colors 
          ${isDragging ? "border-blue-500 bg-blue-500/10" : "border-gray-700 hover:bg-gray-700/60"}
          ${imageToShow ? "p-0" : "p-6"}
        `}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInput}
        />

        {/* Preview de imagen */}
        <AnimatePresence>
          {imageToShow ? (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <img
                src={imageToShow}
                alt="preview"
                className="w-full h-full object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile()
                }}
                className="absolute top-3 right-3 flex items-center justify-center w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
                aria-label="Eliminar imagen"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full border bg-white mb-3">
                <ImageUp className="w-6 h-6 text-gray-500" />
              </div>
              <p className="font-medium text-gray-700">
                Arrastra tu imagen aquí o haz clic
              </p>
              <p className="text-sm text-gray-500">
                Máx {maxSizeMB}MB • PNG, JPG, JPEG
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error */}
      <AnimatePresence>
        {currentError && (
          <motion.div
            className="flex items-center gap-2 text-red-600 text-sm mt-1"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            <AlertCircle className="w-4 h-4" />
            <span>{currentError}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
