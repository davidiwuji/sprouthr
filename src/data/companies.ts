export interface Company {
  id: number;
  name: string;
  logo: string;
  industry: string;
  location: string;
  listings: number;
  verified: boolean;
  description: string;
}

export const companies: Company[] = [
  { id: 1, name: "Paystack", logo: "https://picsum.photos/seed/paystack/80/80.jpg", industry: "Technology", location: "Lagos, Nigeria", listings: 5, verified: true, description: "Payment infrastructure for Africa." },
  { id: 2, name: "GTBank", logo: "https://picsum.photos/seed/gtbank/80/80.jpg", industry: "Banking", location: "Lagos, Nigeria", listings: 8, verified: true, description: "Leading African financial institution." },
  { id: 3, name: "Flutterwave", logo: "https://picsum.photos/seed/flutterwave/80/80.jpg", industry: "Technology", location: "Lekki, Nigeria", listings: 6, verified: true, description: "Global payment technology company." },
  { id: 4, name: "Shell Nigeria", logo: "https://picsum.photos/seed/shell/80/80.jpg", industry: "Oil & Gas", location: "Port Harcourt, Nigeria", listings: 4, verified: true, description: "Major energy company in Nigeria." },
  { id: 5, name: "University of Oxford", logo: "https://picsum.photos/seed/oxford/80/80.jpg", industry: "Education", location: "Oxford, UK", listings: 7, verified: true, description: "World-leading university." },
  { id: 6, name: "Google", logo: "https://picsum.photos/seed/google/80/80.jpg", industry: "Technology", location: "Mountain View, USA", listings: 12, verified: true, description: "Global technology leader." },
  { id: 7, name: "Andela", logo: "https://picsum.photos/seed/andela/80/80.jpg", industry: "Technology", location: "Lagos, Nigeria", listings: 9, verified: true, description: "Global talent marketplace." },
  { id: 8, name: "TotalEnergies", logo: "https://picsum.photos/seed/total/80/80.jpg", industry: "Oil & Gas", location: "Abuja, Nigeria", listings: 3, verified: true, description: "Multi-energy company." },
  { id: 9, name: "MTN Nigeria", logo: "https://picsum.photos/seed/mtn/80/80.jpg", industry: "Telecommunications", location: "Lagos, Nigeria", listings: 10, verified: true, description: "Leading telecom provider." },
  { id: 10, name: "Mercy Corps", logo: "https://picsum.photos/seed/mercycorps/80/80.jpg", industry: "Non-Profit", location: "Abuja, Nigeria", listings: 4, verified: true, description: "Global humanitarian organization." },
  { id: 11, name: "Kuda Bank", logo: "https://picsum.photos/seed/kuda/80/80.jpg", industry: "Technology", location: "Lagos, Nigeria", listings: 6, verified: true, description: "Digital banking platform." },
  { id: 12, name: "African Development Bank", logo: "https://picsum.photos/seed/afdb/80/80.jpg", industry: "Finance", location: "Abidjan, Côte d'Ivoire", listings: 5, verified: true, description: "Multilateral development bank." },
  { id: 13, name: "Cisco Nigeria", logo: "https://picsum.photos/seed/cisco/80/80.jpg", industry: "Technology", location: "Lagos, Nigeria", listings: 4, verified: true, description: "IT and networking leader." },
  { id: 14, name: "UNESCO", logo: "https://picsum.photos/seed/unesco/80/80.jpg", industry: "Education", location: "Paris, France", listings: 6, verified: true, description: "United Nations agency for education and science." },
  { id: 15, name: "Médecins Sans Frontières", logo: "https://picsum.photos/seed/msf/80/80.jpg", industry: "Healthcare", location: "Geneva, Switzerland", listings: 5, verified: true, description: "International humanitarian medical organization." }
];
