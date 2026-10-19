/**
 * Toyvolt Central Brand & Storefront Configuration
 * Keeps all brand identity tokens, verified backend rules, and configurable
 * contact/policy metadata in one maintainable place without fabricated claims.
 */
export const BRAND_CONFIG = {
  name: 'TOYVOLT',
  legalEntityName: 'Toyvolt', // Storefront and brand identity for India operations
  tagline: 'Power Up The Fun.',
  badgeText: 'Power Up',
  currencySymbol: '₹',
  currencyCode: 'INR',

  // Brand Palette
  colors: {
    electricBlue: '#1769FF',
    voltOrange: '#FF7626',
    warmCream: '#FFF3DF',
    jetBlack: '#171717',
    canvas: '#F7F3EB',
    card: '#FFF9F0',
    secondary: '#F0E8DA',
    divider: '#DDD3C3'
  },

  // Verified Operational Rules: ₹0 Free Shipping Nationwide
  shipping: {
    freeShippingThresholdRupees: 0,
    freeShippingThresholdPaise: 0,
    standardShippingFeeRupees: 0,
    standardShippingFeePaise: 0,
    dispatchTimeline: '1–2 business days',
    deliveryTimeline: '3–7 business days across serviceable PIN codes in India',
    carrierNetwork: 'Shiprocket partner courier network (Delhivery, Bluedart, etc.)'
  },

  // Verified Order & Return Operational Rules
  cancellation: {
    window: 'Prior to order dispatch and courier handover',
    method: 'Direct self-service cancellation via My Orders or via support email',
    refundDays: '5–7 business days to reflect in the original payment source'
  },

  returns: {
    transitDamageWindowHours: 48, // 48 hours for reporting physical transit or box damage
    defectWindowDays: 7, // 7 days for reporting manufacturing defects or electronic faults
    returnShippingCharge: '₹0 (Free reverse pickup or reimbursed for approved defect/damage returns)',
    resolutionOptions: 'Free replacement or full refund if replacement is unavailable'
  },

  // Verified Coupons seeded in backend (from toyvolt-backend/src/config/seedData.json)
  verifiedCoupons: [
    {
      code: 'WELCOME100',
      label: 'Flat ₹100 OFF',
      minOrderRupees: 999,
      description: 'New customer welcome discount on orders ≥ ₹999'
    },
    {
      code: 'SPEED200',
      label: 'Flat ₹200 OFF',
      minOrderRupees: 1999,
      description: 'Exclusive discount on orders ≥ ₹1,999'
    },
    {
      code: 'DRIFT10',
      label: '10% OFF (Up to ₹500)',
      minOrderRupees: 1499,
      description: '10% discount on orders ≥ ₹1,499'
    }
  ],

  // Contact, Operational & Grievance Information
  contact: {
    email: import.meta.env.VITE_SUPPORT_EMAIL || 'support@toyvolt.com',
    hours: 'Mon – Sat • 10:00 AM to 7:00 PM IST',
    locationNote: 'Online Direct-to-Consumer Storefront (India)',
    country: 'India',
    phone: import.meta.env.VITE_SUPPORT_PHONE || '', // Kept empty if unverified to avoid fake numbers
    businessAddress: import.meta.env.VITE_BUSINESS_ADDRESS || '', // Configurable via environment if registered address is specified
    grievanceOfficer: {
      name: 'Customer Grievance Officer',
      designation: 'Nodal & Grievance Redressal Officer',
      email: import.meta.env.VITE_SUPPORT_EMAIL || 'support@toyvolt.com',
      responseTime: 'Acknowledgement within 48 hours, resolution within 1 month'
    }
  }
};
