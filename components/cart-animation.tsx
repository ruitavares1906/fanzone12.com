"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart } from "lucide-react"

interface CartAnimationProps {
  show: boolean
  onComplete: () => void
  productImage?: string
}

export function CartAnimation({ show, onComplete, productImage }: CartAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        onComplete()
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative"
            initial={{ scale: 0.5, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {productImage && (
              <motion.div
                className="absolute top-0 left-0 w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg"
                initial={{ scale: 1, x: 0, y: 0 }}
                animate={{ scale: 0.5, x: 40, y: -40 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <img src={productImage || "/placeholder.svg"} alt="Produto" className="w-full h-full object-cover" />
              </motion.div>
            )}
            <motion.div
              className="bg-green-500 text-white p-6 rounded-full shadow-lg"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <ShoppingCart size={40} />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
