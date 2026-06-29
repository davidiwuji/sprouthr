export interface CvService {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  features: string[];
  delivery: string;
  popular?: boolean;
  premium?: boolean;
}

export interface CvTemplate {
  id: number;
  name: string;
  category: string;
  price: number;
  style: string;
  colorScheme: string;
  formats: string[];
}

export interface CareerPackage {
  id: number;
  name: string;
  items: string[];
  price: number;
  originalPrice: number;
  savings: number;
  badge?: string;
}

export const cvRevampServices: CvService[] = [
  {
    id: 1,
    name: "Basic Revamp",
    price: 5000,
    features: ["Resume restructuring", "Formatting fix", "Grammar check", "Delivery in 3 days", "One revision round"],
    delivery: "3 days",
  },
  {
    id: 2,
    name: "Professional Revamp",
    price: 15000,
    badge: "Most Popular",
    features: ["Complete rewrite", "ATS optimization", "Tailored to target role", "Cover letter included", "Delivery in 48 hours", "Two revision rounds"],
    delivery: "48 hours",
    popular: true,
  },
  {
    id: 3,
    name: "Executive Revamp",
    price: 35000,
    badge: "Premium",
    features: ["Senior-level rewrite", "LinkedIn profile optimization", "1-on-1 consultation", "Multiple format versions", "Priority delivery in 24 hours", "Unlimited revisions"],
    delivery: "24 hours",
    premium: true,
  },
];

export const cvTemplates: CvTemplate[] = [
  { id: 1, name: "Minimalist Pro", category: "Minimal", price: 3000, style: "Minimal", colorScheme: "Blue-Gray", formats: ["PDF", "Word"] },
  { id: 2, name: "Creative Edge", category: "Creative", price: 4000, style: "Creative", colorScheme: "Teal-Orange", formats: ["PDF", "Word", "Canva"] },
  { id: 3, name: "Corporate Classic", category: "Corporate", price: 3500, style: "Corporate", colorScheme: "Navy-White", formats: ["PDF", "Word"] },
  { id: 4, name: "Tech Modern", category: "Minimal", price: 4000, style: "Minimal", colorScheme: "Dark-Purple", formats: ["PDF", "Word", "LaTeX"] },
  { id: 5, name: "Academic CV", category: "Corporate", price: 3500, style: "Corporate", colorScheme: "Maroon-Gold", formats: ["PDF", "Word"] },
  { id: 6, name: "Creative Portfolio", category: "Creative", price: 5000, style: "Creative", colorScheme: "Multi-color", formats: ["PDF", "Canva", "Figma"] },
  { id: 7, name: "Executive Suite", category: "Corporate", price: 4500, style: "Corporate", colorScheme: "Dark Green", formats: ["PDF", "Word"] },
  { id: 8, name: "Startup Ready", category: "Minimal", price: 3000, style: "Minimal", colorScheme: "Orange-Black", formats: ["PDF", "Word"] },
  { id: 9, name: "Healthcare Professional", category: "Corporate", price: 3500, style: "Corporate", colorScheme: "White-Blue", formats: ["PDF", "Word"] },
  { id: 10, name: "Design System", category: "Creative", price: 5000, style: "Creative", colorScheme: "Pink-Purple", formats: ["PDF", "Canva", "Figma"] },
];

export const coverLetters = [
  { id: 1, title: "General Corporate", industry: "Corporate", price: 2000, preview: "A professional cover letter suitable for most corporate roles." },
  { id: 2, title: "Tech & Startup", industry: "Technology", price: 2500, preview: "Modern cover letter highlighting technical skills and innovation." },
  { id: 3, title: "Banking & Finance", industry: "Finance", price: 2500, preview: "Formal cover letter emphasizing analytical and financial skills." },
  { id: 4, title: "Healthcare & Medical", industry: "Healthcare", price: 2500, preview: "Compassionate tone focused on patient care and medical expertise." },
  { id: 5, title: "Non-Profit & NGO", industry: "Non-Profit", price: 2000, preview: "Passion-driven cover letter highlighting community impact experience." },
  { id: 6, title: "Academic & Research", industry: "Education", price: 2000, preview: "Academic-focused cover letter emphasizing research and publications." },
];

export const linkedInServices = [
  { id: 1, name: "Profile Rewrite", price: 20000, features: ["Full profile rewrite", "Keyword optimization", "Headline & summary rewrite", "Experience section revamp", "Recommendation strategy"] },
  { id: 2, name: "Summary Writing", price: 10000, features: ["Custom summary (150 words)", "SEO keywords", "3 revision rounds", "Brand voice alignment"] },
];

export const careerPackages: CareerPackage[] = [
  { id: 1, name: "Job Seeker Starter Pack", badge: "Best Value", items: ["CV Revamp (Basic)", "1 Premium Template", "Cover Letter"], price: 10000, originalPrice: 14000, savings: 4000 },
  { id: 2, name: "Fresh Graduate Package", badge: "Most Popular", items: ["Professional Revamp", "2 Premium Templates", "Cover Letter", "Interview Guide"], price: 22000, originalPrice: 35000, savings: 13000 },
  { id: 3, name: "Executive Career Package", badge: "Premium", items: ["Executive Revamp", "LinkedIn Makeover", "3 Premium Templates", "1-on-1 Career Coaching"], price: 55000, originalPrice: 80000, savings: 25000 },
];

// Combined flat list for CV Store browse page
export interface CvStoreItem {
  id: number;
  title: string;
  author: string;
  description: string;
  rating: number;
  price: string;
  tags: string[];
}

export const cvStoreItems: CvStoreItem[] = [
  { id: 1, title: "Minimalist Professional CV", author: "DesignStudio", description: "Clean, modern template with subtle accent colors.", rating: 4.8, price: "Free", tags: ["minimal", "professional", "modern"] },
  { id: 2, title: "Creative Portfolio Resume", author: "ArtisanCV", description: "Stand out with a creative layout perfect for design roles.", rating: 4.6, price: "₦18,000", tags: ["creative", "portfolio", "design"] },
  { id: 3, title: "Executive Corporate CV", author: "ProResume", description: "Command respect with this refined executive template.", rating: 4.9, price: "₦37,500", tags: ["executive", "corporate", "formal"] },
  { id: 4, title: "Tech-Ready Developer CV", author: "CodeCV", description: "Built for engineers — clean, ATS-friendly, skills-focused.", rating: 4.7, price: "Free", tags: ["tech", "developer", "ATS"] },
  { id: 5, title: "Academic Research CV", author: "ScholarPro", description: "Ideal for researchers and PhD applicants.", rating: 4.5, price: "₦22,500", tags: ["academic", "research", "publications"] },
  { id: 6, title: "Entry Level Graduate CV", author: "FreshGrad", description: "Highlight projects, internships and coursework effectively.", rating: 4.4, price: "Free", tags: ["entry-level", "graduate", "internship"] },
  { id: 7, title: "Healthcare Professional CV", author: "MedStaff", description: "Optimized for medical and healthcare roles.", rating: 4.6, price: "₦27,000", tags: ["healthcare", "medical", "professional"] },
  { id: 8, title: "Startup Founder Pitch CV", author: "FounderSuite", description: "Showcase entrepreneurial experience and impact.", rating: 4.7, price: "₦30,000", tags: ["startup", "founder", "impact"] },
  { id: 9, title: "Marketing & Creative CV", author: "BrandYou", description: "Visual-first template for marketing professionals.", rating: 4.5, price: "₦15,000", tags: ["marketing", "creative", "visual"] },
  { id: 10, title: "International CV (Europass)", author: "GlobalCV", description: "Compliant with European CV standards.", rating: 4.3, price: "Free", tags: ["international", "europass", "standard"] },
  { id: 11, title: "Data Science & Analytics CV", author: "DataPro", description: "Highlight technical skills and data projects.", rating: 4.8, price: "₦21,000", tags: ["data-science", "analytics", "technical"] },
  { id: 12, title: "Consulting Case-Ready CV", author: "McKinseyStyle", description: "Preferred format for top consulting firms.", rating: 4.9, price: "₦45,000", tags: ["consulting", "case", "professional"] },
];
