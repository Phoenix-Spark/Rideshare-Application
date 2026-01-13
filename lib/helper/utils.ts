export function getBaseUrl(): string {
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    const domain = process.env.VITE_DOMAIN || 'localhost';
    const port = process.env.VITE_DOMAIN_PORT || '3000';
    return `http://${domain}:${port}`;
  }
  
  const domain = process.env.WEBSITE_DOMAIN;
  if (!domain) {
    throw new Error('WEBSITE_DOMAIN is not set in production environment');
  }
  return `https://${domain}`;
}