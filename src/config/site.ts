export const siteConfig = {
  name: "Luzzia",
  description: "Plataforma inteligente para el ahorro energético en España. Consulta precios de electricidad en tiempo real y recibe alertas para reducir tu factura hasta un 30%.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://luzzia.es",
  ogImage: "/logo.webp",
  links: {
    twitter: "https://twitter.com/luzzia_es",
    github: "https://github.com/luzzia",
    linkedin: "https://linkedin.com/company/luzzia",
  },
  keywords: [
    "precio luz tiempo real",
    "ahorro factura eléctrica", 
    "mercado eléctrico español",
    "PVPC",
    "electricidad barata España",
    "tarifa eléctrica",
    "consumo inteligente",
    "Red Eléctrica España"
  ],
  authors: [
    {
      name: "Jander Gomez",
      url: "https://luzzia.es",
    },
  ],
  creator: "Jander Gomez",
  themeColor: "#1e40af",
  manifest: "/manifest.json",
}

export type SiteConfig = typeof siteConfig