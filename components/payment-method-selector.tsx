"use client"

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { CreditCard } from "lucide-react"
import Image from "next/image"

interface PaymentMethodSelectorProps {
  onCheckout?: () => void
  isLoading?: boolean
  email?: string
  onEmailChange?: (email: string) => void
  emailError?: string
}

export function PaymentMethodSelector({ 
  onCheckout,
  isLoading = false,
  email,
  onEmailChange,
  emailError
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Payment Method</h3>
      
      {/* Online Payment */}
      <Card className="ring-2 ring-green-500 bg-green-50">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <CreditCard className="h-5 w-5 text-green-600" />
            <span className="font-medium">Online Payment</span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription>
            Pay securely with credit/debit card, PayPal, Klarna, and other payment methods
          </CardDescription>
          
          {/* Available payment methods */}
          <div className="mt-3">
            <h4 className="font-semibold text-foreground mb-3 text-center text-sm">Available Payment Methods</h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-card rounded-lg p-3 shadow-sm border border-border">
                <Image src="/images/payment-visa.png" alt="Visa" width={60} height={30} className="h-6 w-auto object-contain mx-auto" />
              </div>
              <div className="bg-card rounded-lg p-3 shadow-sm border border-border">
                <Image src="/images/payment-mastercard.webp" alt="Mastercard" width={60} height={30} className="h-6 w-auto object-contain mx-auto" />
              </div>
              <div className="bg-card rounded-lg p-3 shadow-sm border border-border">
                <Image src="/images/payment-klarna.webp" alt="Klarna" width={60} height={30} className="h-6 w-auto object-contain mx-auto" />
              </div>
              <div className="bg-card rounded-lg p-3 shadow-sm border border-border">
                <Image src="/images/paypal-logo-small-min-1.png" alt="PayPal" width={60} height={30} className="h-6 w-auto object-contain mx-auto" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Field */}
      {onCheckout && email !== undefined && onEmailChange && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <Label htmlFor="checkout-email" className="text-sm font-semibold text-gray-900 mb-2 block">
            Email for confirmation *
          </Label>
          <input
            id="checkout-email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              emailError ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )}
          <p className="text-xs text-gray-600 mt-2">
            You will receive order confirmation at this email
          </p>
        </div>
      )}

      {/* Checkout Button */}
      {onCheckout && (
        <div className="mt-6">
          <button
            onClick={onCheckout}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                <span>Complete Order</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
