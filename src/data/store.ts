export type StoreCategory = 'federal-govt' | 'military' | 'graduate' | 'medical' | 'oil-gas' | 'teaching' | 'private' | 'banking' | 'general' | 'engineering' | 'mentorship' | 'cv-service';

export interface StoreProduct {
  id: number;
  title: string;
  category: StoreCategory;
  subcategory?: string;
  description: string;
  price: string;
  originalPrice?: string;
  badge?: string;
  popular?: boolean;
  features: string[];
  delivery: string;
  format: string;
}

// Category display configuration
export const categoryConfig: Record<StoreCategory, { label: string; icon: string; color: string }> = {
  'federal-govt':  { label: 'Federal Government', icon: 'fa-landmark', color: '#22c55e' },
  'military':      { label: 'Military & Paramilitary', icon: 'fa-shield-halved', color: '#1d4ed8' },
  'graduate':      { label: 'Graduate & Internship', icon: 'fa-graduation-cap', color: '#7c3aed' },
  'medical':       { label: 'Healthcare & Medical', icon: 'fa-stethoscope', color: '#e11d48' },
  'oil-gas':       { label: 'Oil & Gas', icon: 'fa-oil-can', color: '#f59e0b' },
  'teaching':      { label: 'Teaching & Education', icon: 'fa-chalkboard-user', color: '#0891b2' },
  'private':       { label: 'Private Companies', icon: 'fa-building', color: '#6366f1' },
  'banking':       { label: 'Banking & Finance', icon: 'fa-coins', color: '#059669' },
  'general':       { label: 'General Tests', icon: 'fa-file-lines', color: '#d97706' },
  'engineering':   { label: 'Engineering & Technical', icon: 'fa-gear', color: '#dc2626' },
  'mentorship':    { label: 'Mentorship', icon: 'fa-user-graduate', color: '#f59e0b' },
  'cv-service':    { label: 'CV Services', icon: 'fa-file-pen', color: '#22c55e' },
};

export const storeProducts: StoreProduct[] = [
  // ════════════════════════════════════════════════════════════
  // FEDERAL GOVERNMENT RECRUITMENT EXAMS
  // ════════════════════════════════════════════════════════════
  {
    id: 1,
    title: 'Nigeria Police Force Recruitment Past Questions',
    category: 'federal-govt',
    subcategory: 'Nigeria Police Force',
    description: 'Prepare effectively for Nigeria Police Force recruitment with verified past questions and answers. CBT format with detailed explanations.',
    price: '₦2,000',
    features: ['Latest updated questions', 'CBT practice format', 'Detailed answer explanations', 'Previous exam patterns', 'Time management tips', 'Instant PDF download'],
    delivery: 'Instant Download',
    format: 'PDF',
  },
  {
    id: 2,
    title: 'Nigeria Immigration Service (NIS) Past Questions',
    category: 'federal-govt',
    subcategory: 'Nigeria Immigration Service',
    description: 'Complete preparation pack for NIS recruitment exam with past questions, current affairs, and immigration-specific topics.',
    price: '₦2,500',
    originalPrice: '₦3,000',
    badge: 'Sale',
    features: ['NIS-specific exam questions', 'Current affairs section', 'Immigration laws overview', 'Essay & objective formats', 'Previous year papers', 'Answer key included'],
    delivery: 'Instant Download',
    format: 'PDF',
  },
  {
    id: 3,
    title: 'Civil Defence (NSCDC) Past Questions',
    category: 'federal-govt',
    subcategory: 'Civil Defence (NSCDC)',
    description: 'Comprehensive NSCDC past questions and answers covering all sections of the recruitment exam including general knowledge and numerical reasoning.',
    price: '₦2,500',
    features: ['NSCDC exam structure guide', 'General knowledge questions', 'Numerical reasoning tests', 'Verbal reasoning section', 'Security-related topics', 'Latest update 2025/2026'],
    delivery: 'Instant Download',
    format: 'PDF',
  },
  {
    id: 4,
    title: 'DSS / SSS Past Questions and Answers',
    category: 'federal-govt',
    subcategory: 'DSS / SSS',
    description: 'Expertly compiled past questions for State Security Service and Department of State Services recruitment exams.',
    price: '₦2,500',
    features: ['DSS/SSS exam format', 'Intelligence & reasoning tests', 'Current affairs questions', 'National security topics', 'Essay questions guide', 'Comprehensive answer key'],
    delivery: 'Instant Download',
    format: 'PDF',
  },
  {
    id: 5,
    title: 'NDLEA Recruitment Past Questions',
    category: 'federal-govt',
    subcategory: 'NDLEA',
    description: 'Targeted preparation for National Drug Law Enforcement Agency recruitment with past exam patterns and drug-related topics.',
    price: '₦2,500',
    features: ['NDLEA exam pattern', 'Drug law questions', 'Aptitude test section', 'General paper section', 'Professional questions', 'Practice tests included'],
    delivery: 'Instant Download',
    format: 'PDF',
  },
  {
    id: 6,
    title: 'Correctional Service Past Questions',
    category: 'federal-govt',
    subcategory: 'Correctional Service',
    description: 'Complete past questions pack for Nigerian Correctional Service recruitment exam preparation.',
    price: '₦2,500',
    originalPrice: '₦3,500',
    badge: 'Sale',
    features: ['Service-specific questions', 'Criminal justice topics', 'Aptitude test papers', 'Essay & objective formats', 'Previous exam patterns', 'Answer explanations'],
    delivery: 'Instant Download',
    format: 'PDF',
  },
  {
    id: 7,
    title: 'Federal Fire Service Past Questions',
    category: 'federal-govt',
    subcategory: 'Federal Fire Service',
    description: 'Prepare for Federal Fire Service recruitment with comprehensive past questions covering fire safety, aptitude, and general knowledge.',
    price: '₦2,000',
    originalPrice: '₦3,000',
    badge: 'Sale',
    features: ['Fire service exam guide', 'Fire safety knowledge', 'Numerical reasoning tests', 'General paper section', 'Previous exam questions', 'Answer key provided'],
    delivery: 'Instant Download',
    format: 'PDF',
  },
  {
    id: 8,
    title: 'CDCFIB Past Questions — Customs, Immigration & Prisons',
    category: 'federal-govt',
    subcategory: 'CDCFIB',
    description: 'Comprehensive past questions for the combined CDCFIB exam covering Customs, Immigration, and Prisons recruitment boards.',
    price: '₦4,500',
    originalPrice: '₦5,000',
    badge: 'Combo',
    features: ['All three services covered', 'CDCFIB exam format', 'Extensive question bank', 'Multiple practice tests', 'Detailed explanations', 'Updated for current year'],
    delivery: 'Instant Download',
    format: 'PDF',
  },

  // ════════════════════════════════════════════════════════════
  // MILITARY & PARAMILITARY
  // ════════════════════════════════════════════════════════════
  {
    id: 9,
    title: 'Nigerian Army Recruitment Past Questions',
    category: 'military',
    subcategory: 'Nigerian Army',
    description: 'Comprehensive preparation material for Nigerian Army recruitment exam with past questions and aptitude tests.',
    price: '₦2,500',
    features: ['Army exam structure', 'Aptitude test questions', 'General knowledge section', 'Numerical reasoning', 'Verbal reasoning', 'Physical fitness guide'],
    delivery: 'Instant Download',
    format: 'PDF',
  },
  {
    id: 10,
    title: 'Nigerian Navy Past Questions and Answers',
    category: 'military',
    subcategory: 'Nigerian Navy',
    description: 'Complete Nigerian Navy recruitment past questions with detailed answers and exam preparation guides.',
    price: '₦2,500',
    originalPrice: '₦4,000',
    badge: 'Popular',
    features: ['Navy-specific questions', 'Mathematics & science topics', 'General knowledge section', 'Current affairs', 'Previous year papers', 'Physical/dental requirements guide'],
    delivery: 'Instant Download',
    format: 'PDF',
  },
  {
    id: 11,
    title: 'Nigerian Air Force Past Questions',
    category: 'military',
    subcategory: 'Nigerian Air Force',
    description: 'Prepare for Nigerian Air Force recruitment with comprehensive past questions covering all exam sections.',
    price: '₦2,500',
    features: ['Air Force exam pattern', 'Aptitude test pack', 'Technical knowledge section', 'General paper', 'Interview preparation tips', 'Latest updates'],
    delivery: 'Instant Download',
    format: 'PDF',
  },
  {
    id: 12,
    title: 'NDA (Nigerian Defence Academy) Past Questions',
    category: 'military',
    subcategory: 'NDA',
    description: 'Comprehensive past questions pack for Nigerian Defence Academy entrance examination. Includes all subjects.',
    price: '₦2,500',
    features: ['NDA entrance exam pattern', 'Mathematics questions', 'English language section', 'Current affairs', 'Science questions', 'Interview preparation guide'],
    delivery: 'Instant Download',
    format: 'PDF',
  },
  {
    id: 13,
    title: 'FRSC (Federal Road Safety Corps) Past Questions',
    category: 'military',
    subcategory: 'FRSC',
    description: 'Complete preparation pack for FRSC recruitment exam with past questions and road safety-specific topics.',
    price: '₦2,500',
    features: ['FRSC exam structure', 'Road safety regulations', 'Highway code questions', 'Aptitude test section', 'General knowledge', 'Answer explanations'],
    delivery: 'Instant Download',
    format: 'PDF',
  },

  // ════════════════════════════════════════════════════════════
  // OIL & GAS SECTOR
  // ════════════════════════════════════════════════════════════
  {
    id: 14,
    title: 'NNPC Recruitment Past Questions and Answers',
    category: 'oil-gas',
    subcategory: 'NNPC',
    description: 'Comprehensive NNPC recruitment past questions covering aptitude tests, technical knowledge, and interview preparation.',
    price: '₦4,000',
    originalPrice: '₦5,000',
    badge: 'Popular',
    popular: true,
    features: ['NNPC exam format', 'Technical & professional tests', 'Aptitude & numerical reasoning', 'Oil & gas industry knowledge', 'Interview preparation', 'Updated for current recruitment'],
    delivery: 'Instant Download',
    format: 'PDF',
  },
  {
    id: 15,
    title: 'Chevron Nigeria Past Questions',
    category: 'oil-gas',
    subcategory: 'Chevron',
    description: 'Prepare for Chevron Nigeria recruitment and assessment tests with comprehensive past questions and practice materials.',
    price: '₦3,500',
    features: ['Chevron test format', 'Technical knowledge section', 'Aptitude test practice', 'Industry-specific topics', 'Interview questions', 'Assessment centre guide'],
    delivery: 'Instant Download',
    format: 'PDF',
  },
  {
    id: 16,
    title: 'Total Nigeria Past Questions',
    category: 'oil-gas',
    subcategory: 'Total Nigeria',
    description: 'Complete preparation material for Total Nigeria recruitment exams and graduate trainee assessments.',
    price: '₦3,500',
    originalPrice: '₦5,000',
    badge: 'Sale',
    features: ['Total recruitment format', 'Graduate trainee test pack', 'Technical questions', 'Aptitude tests', 'Interview preparation', 'Industry knowledge section'],
    delivery: 'Instant Download',
    format: 'PDF',
  },

  // ════════════════════════════════════════════════════════════
  // TEACHING & EDUCATION
  // ════════════════════════════════════════════════════════════
  {
    id: 17,
    title: 'TRCN Past Questions and Answers',
    category: 'teaching',
    subcategory: 'TRCN',
    description: 'Complete TRCN (Teachers Registration Council of Nigeria) past questions for professional qualifying examination.',
    price: '₦3,000',
    originalPrice: '₦3,500',
    badge: 'Popular',
    features: ['TRCN exam format', 'Professional education questions', 'Teaching methodology', 'Educational psychology', 'Curriculum studies', 'Answer explanations'],
    delivery: 'Instant Download',
    format: 'PDF',
  },
  {
    id: 18,
    title: 'UBEC / SUBEB Past Questions',
    category: 'teaching',
    subcategory: 'UBEC / SUBEB',
    description: 'Comprehensive past questions for Universal Basic Education Commission and State Universal Basic Education Board recruitment.',
    price: '₦3,000',
    features: ['UBEC/SUBEB exam pattern', 'Teaching aptitude questions', 'English proficiency tests', 'Numerical reasoning', 'Education topics', 'Practice tests included'],
    delivery: 'Instant Download',
    format: 'PDF',
  },

  // ════════════════════════════════════════════════════════════
  // BANKING & FINANCE
  // ════════════════════════════════════════════════════════════
  {
    id: 19,
    title: 'Zenith Bank Past Questions and Answers',
    category: 'banking',
    subcategory: 'Zenith Bank',
    description: 'Updated Zenith Bank recruitment past questions and answers for graduate trainee and experienced hire roles.',
    price: '₦4,000',
    popular: true,
    features: ['Zenith Bank test format', 'Numerical reasoning tests', 'Verbal reasoning section', 'Banking knowledge questions', 'Current financial affairs', 'Interview questions included'],
    delivery: 'Instant Download',
    format: 'PDF',
  },
  {
    id: 20,
    title: 'UBA GMAP Past Questions and Answers',
    category: 'banking',
    subcategory: 'UBA',
    description: 'Complete UBA Graduate Management Acceleration Programme (GMAP) past questions and preparation materials.',
    price: '₦3,500',
    originalPrice: '₦4,000',
    badge: 'Sale',
    features: ['UBA GMAP test format', 'Aptitude test practice', 'Management case studies', 'Banking operations knowledge', 'Current affairs section', 'Interview preparation guide'],
    delivery: 'Instant Download',
    format: 'PDF',
  },
  {
    id: 21,
    title: 'Sterling Bank Past Questions',
    category: 'banking',
    subcategory: 'Sterling Bank',
    description: 'Comprehensive Sterling Bank recruitment past questions and practice tests for graduate trainees.',
    price: '₦3,500',
    features: ['Sterling Bank exam format', 'Numerical reasoning tests', 'Verbal reasoning section', 'Banking knowledge', 'Current affairs', 'Practice tests included'],
    delivery: 'Instant Download',
    format: 'PDF',
  },

  // ════════════════════════════════════════════════════════════
  // OTHER CATEGORIES (representative products)
  // ════════════════════════════════════════════════════════════
  {
    id: 22,
    title: 'Graduate Trainee Aptitude Test Pack',
    category: 'graduate',
    subcategory: 'Graduate Trainee',
    description: 'Comprehensive aptitude test pack for graduate trainee programmes across all sectors. Includes numerical, verbal, and abstract reasoning.',
    price: '₦3,000',
    badge: 'Popular',
    features: ['Numerical reasoning tests', 'Verbal reasoning section', 'Abstract reasoning questions', 'Situational judgement tests', 'Personality assessments', 'Multiple test formats'],
    delivery: 'Instant Download',
    format: 'PDF',
  },
  {
    id: 23,
    title: 'Health Sector Recruitment Past Questions',
    category: 'medical',
    subcategory: 'Health Sector',
    description: 'Past questions for healthcare and medical job recruitment in Nigeria covering nursing, pharmacy, lab science and more.',
    price: '₦3,000',
    features: ['Medical knowledge questions', 'Nursing-specific topics', 'Pharmacy questions', 'Lab science tests', 'Healthcare administration', 'Ethics & professionalism'],
    delivery: 'Instant Download',
    format: 'PDF',
  },
  {
    id: 24,
    title: 'Private Company Recruitment Tests Pack',
    category: 'private',
    subcategory: 'Private Sector',
    description: 'Comprehensive past questions pack for private sector recruitment including Dangote, MTN, Airtel, and top Nigerian companies.',
    price: '₦3,500',
    features: ['Multiple company formats', 'Aptitude test practice', 'Industry-specific questions', 'Technical knowledge tests', 'Interview preparation', 'Latest recruitment updates'],
    delivery: 'Instant Download',
    format: 'PDF',
  },
  {
    id: 25,
    title: 'Engineering Recruitment Past Questions',
    category: 'engineering',
    subcategory: 'Engineering',
    description: 'Past questions for engineering job recruitment in Nigeria covering civil, mechanical, electrical, and other engineering disciplines.',
    price: '₦3,500',
    features: ['Engineering maths questions', 'Technical drawing tests', 'Discipline-specific topics', 'Aptitude test section', 'Interview preparation', 'Practical knowledge tests'],
    delivery: 'Instant Download',
    format: 'PDF',
  },
  {
    id: 26,
    title: 'General Recruitment Aptitude Test Pack',
    category: 'general',
    subcategory: 'General Tests',
    description: 'All-purpose recruitment aptitude test pack with numerical, verbal, abstract reasoning and general knowledge sections.',
    price: '₦2,500',
    features: ['Comprehensive aptitude tests', 'Numerical reasoning drills', 'Verbal reasoning section', 'Abstract reasoning tests', 'General knowledge questions', 'Timed practice tests'],
    delivery: 'Instant Download',
    format: 'PDF',
  },

  // ════════════════════════════════════════════════════════════
  // CV SERVICES
  // ════════════════════════════════════════════════════════════
  {
    id: 27,
    title: 'Professional CV Revamping',
    category: 'cv-service',
    description: 'Get the CV that works for you. Professional rewriting with ATS optimization and modern formatting that gets you noticed by recruiters.',
    price: '₦8,000',
    originalPrice: '₦15,000',
    badge: 'Popular',
    popular: true,
    features: ['ATS-compliant formatting', 'Professional rewrite', 'Content optimization', 'Keyword targeting', 'Modern templates', '48-hour delivery'],
    delivery: '48 hours',
    format: 'PDF + DOCX',
  },
  {
    id: 28,
    title: 'CV + LinkedIn Profile Overhaul',
    category: 'cv-service',
    description: 'Complete professional transformation: CV rewrite plus LinkedIn profile optimization for maximum recruiter visibility.',
    price: '₦18,000',
    originalPrice: '₦30,000',
    badge: 'Best Value',
    features: ['Full CV rewrite', 'LinkedIn profile overhaul', 'Headline optimization', 'Keyword strategy', '2 revision rounds', '30-min strategy call'],
    delivery: '72 hours',
    format: 'PDF + DOCX + LinkedIn Draft',
  },

  // ════════════════════════════════════════════════════════════
  // MENTORSHIP
  // ════════════════════════════════════════════════════════════
  {
    id: 29,
    title: '1-on-1 Career Mentorship Session',
    category: 'mentorship',
    description: 'Connect with industry experts who guide you through your career journey with personalised advice, interview prep, and career planning.',
    price: '₦20,000',
    originalPrice: '₦35,000',
    badge: 'Top Rated',
    features: ['60-min video session', 'Career path mapping', 'Skill gap analysis', 'Personalized action plan', 'Follow-up resources', '30-day email support'],
    delivery: 'Scheduled within 48 hours',
    format: 'Video Call',
  },
  {
    id: 30,
    title: 'Complete Career Accelerator Bundle',
    category: 'cv-service',
    description: 'All-in-one career package: past questions pack + CV revamping + mentorship session for complete job search support.',
    price: '₦35,000',
    originalPrice: '₦60,000',
    badge: '🔥 Best Deal',
    popular: true,
    features: ['Any past questions pack', 'Professional CV revamping', '1 career mentorship session', 'LinkedIn profile review', 'Priority support', '6-month access'],
    delivery: 'All services within 1 week',
    format: 'Mixed (PDF + Video + Calls)',
  },
];
