const get = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) {
    console.warn(`[config] Chýba env premenná: ${key}`);
    return '';
  }
  return value as string;
};

export const config = {
  emailjs: {
    publicKey:          get('VITE_EMAILJS_PUBLIC_KEY'),
    serviceId:          get('VITE_EMAILJS_SERVICE_ID'),
    ownerTemplateId:    get('VITE_EMAILJS_OWNER_TEMPLATE_ID'),
    customerTemplateId: get('VITE_EMAILJS_CUSTOMER_TEMPLATE_ID'),
  },
  store: {
    iban:       get('VITE_STORE_IBAN'),
    ownerEmail: get('VITE_OWNER_EMAIL'),
  },
  packeta: {
    apiKey: get('VITE_PACKETA_API_KEY'),
  },
  contact: {
    phone: get('VITE_CONTACT_PHONE'),
    email: get('VITE_CONTACT_EMAIL'),
  },
  social: {
    instagram: get('VITE_INSTAGRAM_URL'),
    facebook:  get('VITE_FACEBOOK_URL'),
  },
} as const;
