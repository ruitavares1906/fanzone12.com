export interface ShippingCarrier {
  id: string
  label: string
  trackingBaseUrl: string
}

export const shippingCarriers: ShippingCarrier[] = [
  {
    id: "ctt",
    label: "CTT",
    trackingBaseUrl: "https://www.cttexpress.com/localizador-de-envios/?sc="
  },
  {
    id: "dhl",
    label: "DHL",
    trackingBaseUrl: "https://www.dhl.com/track?trackingNumber="
  },
  {
    id: "ups",
    label: "UPS",
    trackingBaseUrl: "https://www.ups.com/track?tracknum="
  },
  {
    id: "fedex",
    label: "FedEx",
    trackingBaseUrl: "https://www.fedex.com/fedextrack/?trknbr="
  },
  {
    id: "dpd",
    label: "DPD",
    trackingBaseUrl: "https://tracking.dpd.de/status/en_US/parcel/"
  },
  {
    id: "gls",
    label: "GLS",
    trackingBaseUrl: "https://gls-group.eu/app/service/open/rest/EN/en/rstt001?match="
  },
  {
    id: "tnt",
    label: "TNT",
    trackingBaseUrl: "https://www.tnt.com/express/en_pt/site/shipping-tools/tracking.html?searchType=con&cons="
  },
  {
    id: "custom",
    label: "Custom",
    trackingBaseUrl: ""
  }
]

export function getTrackingUrl(carrierId: string, trackingNumber: string): string {
  const carrier = shippingCarriers.find(c => c.id === carrierId)
  if (!carrier || !carrier.trackingBaseUrl) {
    return ""
  }
  return `${carrier.trackingBaseUrl}${trackingNumber}`
}

export function getCarrierLabel(carrierId: string): string {
  const carrier = shippingCarriers.find(c => c.id === carrierId)
  return carrier?.label || "Unknown Carrier"
}

