import royalPrinceImage from '../../assets/royalprince.png';
import leadingFromWithinImage from '../../assets/leadershipfromwithin.jpg';
import leadingFromWithinCover from '../../assets/leadingfromwithin.png';
import adeyemiAvatar from '../../assets/adeyemi.jpg';
import francisAvatar from '../../assets/francis.jpg';
import favourAvatar from '../../assets/favour.png';
import accessibleLogo from '../../assets/logo/accessiblelogo.png';
import smartEduHubLogo from '../../assets/logo/smarteduhublogo.png';
import smipayLogo from '../../assets/logo/smipaylogo.jpeg';
import oxygenFmLogo from '../../assets/logo/oxygenfm.jpg';
import testMancerLogo from '../../assets/logo/testmancerlogo.png';
import facityLogo from '../../assets/logo/facitylogo.png';
import { blogPosts } from '../../blog/data/posts';

export const portfolioMeta = {
  title: 'Royal Prince | Growth Officer, Product Builder & Leader',
  description:
    'Portfolio of Joseph Adesunkanmi (Royal Prince). Growth Officer, software engineer, and product builder who takes ownership, stays curious, and gets things done.',
  url: 'https://www.royalprincehub.com/portfolio',
  image: 'https://www.royalprincehub.com/og-portfolio.jpg',
  twitter: '@royalprincecube'
};

export const heroContent = {
  lines: ['Ownership.', 'Curiosity.', 'Execution.'],
  subheading:
    'Growth Officer and product builder. I like fixing problems, building systems, and seeing real results.',
  portrait: royalPrinceImage,
  cvPath: '/resume/royal-prince-cv.pdf',
  cvFileName: 'Royal-Prince-CV.pdf',
  techIcons: ['React', 'Node', 'MongoDB', 'Tailwind', 'Growth', 'Product']
};

export const trustedBy = [
  {
    name: 'Accessible Publishers Limited',
    url: 'https://accessiblepublishers.com/',
    logo: accessibleLogo
  },
  {
    name: 'Accessible Knowledge Hub',
    url: 'https://www.accessibleknowledgehub.com/'
  },
  {
    name: 'Smart Edu Hub',
    url: 'https://www.smarteduhub.ng/',
    logo: smartEduHubLogo
  },
  {
    name: 'Smipay',
    url: 'https://www.smipay.ng/',
    logo: smipayLogo
  },
  {
    name: 'Facity',
    logo: facityLogo
  },
  {
    name: 'Oxygen FM',
    url: 'https://www.facebook.com/oxygen96.9fm',
    logo: oxygenFmLogo
  },
  {
    name: 'TestMancer',
    url: 'https://www.testmancer.com/',
    logo: testMancerLogo
  },
  {
    name: 'University of Ilorin',
    url: 'https://www.unilorin.edu.ng/'
  },
  {
    name: 'Student Union Government',
    url: 'https://www.unilorin.edu.ng/'
  },
  {
    name: 'WifMart',
    url: 'https://www.wifmart.com/'
  },
  {
    name: 'Royal Prince Hub',
    url: 'https://www.royalprincehub.com/'
  }
];

export const aboutContent = {
  portrait: royalPrinceImage,
  title: 'Ownership. Curiosity. Execution.',
  topics: [
    'Ownership',
    'Growth Strategy',
    'Product Building',
    'Partnerships',
    'Leadership',
    'Media',
    'Education',
    'Entrepreneurship'
  ],
  paragraphs: [
    'I rarely stick to just my job title. If something is broken or missing, I notice and try to fix it.',
    'As Growth Officer at Accessible Publishers Limited, I work across Accessible Publishers, Smart Edu Hub, Smipay, and Oxygen FM. That covers ambassador programmes, getting people to use our digital products, partnerships, and internal systems.',
    'I also build. TestMancer has 3,000+ users. I built WifMart and Accessible Knowledge Hub. When there is no obvious path, I try to create one, like the Smipay trade fair deal with University of Ibadan SUG or hosting The Compass on Oxygen FM.',
    'Before this, I was Student Union President at the University of Ilorin, representing 40,000+ students. It taught me to decide fast, work with different people, and own the outcome.',
    'I do my best work around people who build things. Places where ideas move quickly and titles matter less than getting the work done.'
  ]
};

export const impactStats = [
  {
    value: 40000,
    suffix: '+',
    label: 'Students represented as Student Union President'
  },
  {
    value: 3000,
    suffix: '+',
    label: 'Users on TestMancer'
  },
  {
    value: 1040,
    suffix: '+',
    label: 'Accessible Kids YouTube subscribers (144 to 1,040+ in three days)'
  },
  {
    value: 10,
    suffix: '+',
    label: 'Production websites built'
  },
  {
    value: null,
    display: 'Multiple',
    label: 'Partnerships secured'
  },
  {
    value: 4,
    suffix: '+',
    label: 'Business sectors: Growth, Education, Media, Fintech, Technology'
  }
];

export const whatIDo = [
  {
    title: 'Software Development',
    summary: 'Full-stack work with React, Node.js, and MongoDB. Built TestMancer, WifMart, and Accessible Knowledge Hub.',
    icon: 'code'
  },
  {
    title: 'Growth Strategy',
    summary: 'Growth work across publishing, edtech, fintech, and media. Ambassador programmes, product adoption, and internal systems.',
    icon: 'chart'
  },
  {
    title: 'Digital Marketing',
    summary: 'Grew Accessible Kids YouTube from 144 to 1,040+ subscribers in three days with a focused push on content and distribution.',
    icon: 'megaphone'
  },
  {
    title: 'Community Building',
    summary: 'Building communities that stick, from campus groups to product user bases.',
    icon: 'users'
  },
  {
    title: 'Leadership',
    summary: 'Led 40,000+ students as SUG President. Still carry that same energy into business, media, and education work.',
    icon: 'flag'
  },
  {
    title: 'Product Strategy',
    summary: 'Spot the problem, figure out the product, and get people to actually use it.',
    icon: 'compass'
  },
  {
    title: 'Public Speaking',
    summary: 'Host The Compass on Oxygen FM and bring business leaders onto the show for real conversations.',
    icon: 'mic'
  },
  {
    title: 'Business Development',
    summary: 'Closed partnerships like Smipay\'s monthly trade fair deal with University of Ibadan SUG.',
    icon: 'handshake'
  },
  {
    title: 'Operations',
    summary: 'Build systems that save time and catch problems early before they blow up.',
    icon: 'settings'
  }
];

export const featuredProjects = [
  {
    id: 'testmancer',
    title: 'TestMancer',
    url: 'https://www.testmancer.com/',
    logo: testMancerLogo,
    description: 'Edtech platform with 3,000+ users.',
    problem: 'Students needed a simple way to prepare for exams and track progress.',
    role: 'Founder & Lead Developer',
    technologies: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    impact: '3,000+ users and a community that keeps growing.',
    lessons: 'You have to talk to users constantly. Edtech only works when people actually use it.',
    gradient: 'from-violet-600/20 via-indigo-500/10 to-slate-900/5'
  },
  {
    id: 'wifmart',
    title: 'WifMart',
    url: 'https://www.wifmart.com/',
    description: 'E-commerce marketplace.',
    problem: 'Local sellers needed a place online that people could trust.',
    role: 'Product Builder & Growth Lead',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe'],
    impact: 'Full marketplace where vendors sell to customers online.',
    lessons: 'People buy from marketplaces they trust. Keep the UX simple.',
    gradient: 'from-amber-500/20 via-orange-400/10 to-slate-900/5'
  },
  {
    id: 'accessible-knowledge-hub',
    title: 'Accessible Knowledge Hub',
    url: 'https://www.accessibleknowledgehub.com/',
    logo: accessibleLogo,
    description: 'CRM and CSR platform for Accessible Publishers Limited.',
    problem: 'The team needed one place to manage relationships, CSR work, and day-to-day operations.',
    role: 'Lead Developer & Product Strategist',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
    impact: 'Made CRM and CSR work simpler for the publishing team.',
    lessons: 'Internal tools only work if non-technical people can use them without stress.',
    gradient: 'from-emerald-500/20 via-teal-400/10 to-slate-900/5'
  },
  {
    id: 'smipay',
    title: 'Smipay',
    url: 'https://www.smipay.ng/',
    logo: smipayLogo,
    description: 'Fintech app for airtime, data, bills, and everyday payments.',
    problem: 'People wanted one app for daily payments without jumping between services.',
    role: 'Growth Officer & Partnership Lead',
    technologies: ['React', 'Node.js', 'MongoDB', 'Payments'],
    impact: 'Campus activations, trade fair partnerships, and user growth across universities.',
    lessons: 'Fintech grows when people trust you and the product is fast.',
    gradient: 'from-sky-500/20 via-blue-400/10 to-slate-900/5'
  },
  {
    id: 'royal-prince-hub',
    title: 'Royal Prince Hub',
    url: 'https://www.royalprincehub.com/',
    description: 'Book platform, blog, and personal site.',
    problem: 'I wanted one home for my books, writing, and leadership content.',
    role: 'Founder, Author & Full-Stack Developer',
    technologies: ['React', 'Node.js', 'MongoDB', 'Tailwind', 'Vercel'],
    impact: 'Digital library, blog, and book sales in one place.',
    lessons: 'Your personal brand works better when everything lives in one spot.',
    image: leadingFromWithinCover,
    imageVariant: 'cover',
    internalLink: '/',
    gradient: 'from-amber-600/25 via-yellow-500/10 to-slate-900/5'
  }
];

export const clientProjects = [
  {
    title: 'Smart Edu Hub',
    url: 'https://www.smarteduhub.ng/',
    logo: smartEduHubLogo,
    sector: 'Education',
    summary: 'School management platform with admin tools and analytics.'
  },
  {
    title: 'Smipay',
    url: 'https://www.smipay.ng/',
    logo: smipayLogo,
    sector: 'Fintech',
    summary: 'Payments and campus activations.'
  },
  {
    title: 'Facity',
    logo: facityLogo,
    sector: 'FinTech',
    summary: 'Campus activations, student ambassadors, and onboarding.'
  },
  {
    title: 'Oxygen FM',
    url: 'https://www.facebook.com/oxygen96.9fm',
    logo: oxygenFmLogo,
    sector: 'Media',
    summary: 'Radio and audience growth through The Compass.'
  },
  {
    title: 'Accessible Publishers',
    url: 'https://accessiblepublishers.com/',
    logo: accessibleLogo,
    sector: 'Publishing',
    summary: 'Digital tools and growth for publishing.'
  }
];

export const caseStudies = [
  {
    id: 'accessible-kids',
    title: 'Accessible Kids',
    challenge: 'Only 144 YouTube subscribers. Low reach and little engagement.',
    strategy: ['Better content', 'Community push', 'Targeted promotion', 'Consistent posting'],
    execution: 'Reworked the content plan, fixed thumbnails and titles, and pushed it through community channels.',
    result: 'Over 1,040 subscribers in three days.',
    before: 144,
    after: 1040,
    metric: 'Subscribers'
  },
  {
    id: 'smipay',
    title: 'Smipay',
    challenge: 'Needed a way into the university market with something that could repeat every month.',
    strategy: ['Build relationships with student leaders', 'Campus trade fairs', 'Student union partnerships'],
    execution: 'Met with University of Ibadan SUG executives and landed a monthly trade fair partnership.',
    result: 'Monthly trade fair partnership with University of Ibadan SUG.',
    timeline: ['First outreach', 'Meetings with executives', 'Partnership proposal', 'Monthly trade fair locked in']
  },
  {
    id: 'oxygen-fm',
    title: 'Oxygen FM: The Compass',
    challenge: 'Grow the audience and bring good guests to a leadership radio show.',
    strategy: ['Book strong guests', 'Keep listeners engaged', 'Build media partnerships'],
    execution: 'Hosted The Compass, brought on business leaders, and built relationships across media and leadership circles.',
    result: 'Audience is growing and the show has a stronger presence.',
    highlights: ['Host of The Compass', 'Guest interviews', 'Media partnerships']
  }
];

export const leadershipTimeline = [
  {
    title: 'Growth Officer',
    org: 'Accessible Publishers Limited',
    period: 'Present',
    logo: accessibleLogo,
    summary:
      'Growth work across publishing, edtech, fintech, and media. Ambassador programmes, product adoption, partnerships, and internal systems.',
    highlights: [
      'Growth across Accessible Publishers, Smart Edu Hub, Smipay, and Oxygen FM',
      'Set up ambassador programmes and internal tools',
      'Helped teams adopt digital products and close partnerships'
    ]
  },
  {
    title: 'Radio Host',
    org: 'Oxygen FM, The Compass',
    period: 'Present',
    logo: oxygenFmLogo,
    summary:
      'Host The Compass on Oxygen FM. I bring business leaders onto the show and work on growing the audience.'
  },
  {
    title: 'Product Builder',
    period: '2023 to Present',
    summary: 'Built TestMancer (3,000+ users), WifMart, and Accessible Knowledge Hub.',
    highlights: [
      'TestMancer, an edtech platform with 3,000+ users',
      'WifMart e-commerce and Accessible Knowledge Hub CRM',
      'Full-stack products from idea to live product'
    ]
  },
  {
    title: 'Student Activation Officer',
    org: 'Facity (FinTech)',
    period: '2023 to Present',
    logo: facityLogo,
    summary: 'Campus activation and ambassador programmes for a fintech platform.',
    highlights: [
      'Ran campus campaigns that onboarded thousands of students',
      'Trained student ambassadors across different campuses',
      'Built onboarding flows that helped people stay on the app',
      'Worked with university teams during orientation periods'
    ]
  },
  {
    title: 'Student Union President',
    org: 'University of Ilorin',
    period: '2022 to 2023',
    summary:
      'Represented 40,000+ students. Made tough calls, worked with different groups, and owned the results.'
  },
  {
    title: 'General Secretary',
    org: 'Student Union Government',
    period: 'Student Leadership',
    summary: 'Executive role in student government.'
  },
  {
    title: 'Student Leader',
    org: 'University of Ilorin',
    period: '2019 to 2023',
    summary: 'Built a 30,000+ member online teaching community.'
  },
  {
    title: 'Founder & Entrepreneur',
    period: 'Ongoing',
    summary: 'Started ventures in tech, education, and media. I like creating things from scratch.'
  }
];

export const skills = {
  'Software Engineering': ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'Tailwind', 'Git'],
  Growth: ['SEO', 'Google Analytics', 'Growth Strategy', 'Community Building', 'Digital Marketing'],
  Leadership: ['Public Speaking', 'People Management', 'Operations'],
  Photography: ['Adobe Lightroom', 'Camera Operation', 'Editing'],
  'Soft Skills': [
    'Ownership',
    'Execution',
    'Curiosity',
    'Time Management',
    'Organization',
    'Clear Thinking',
    'Problem Solving',
    'Communication'
  ]
};

export const mediaContent = {
  show: 'The Compass',
  station: 'Oxygen FM',
  url: 'https://www.facebook.com/oxygen96.9fm',
  logo: oxygenFmLogo,
  description:
    'I host The Compass on Oxygen FM. I bring business leaders onto the show and work on growing the audience week by week.',
  highlights: ['Guest interviews', 'Leadership talks', 'Audience growth', 'Media partnerships']
};

export const philosophy = [
  'Take ownership.',
  'Fix problems before someone has to ask.',
  'Build before you talk.',
  'Good systems beat hard work alone.',
  'Titles matter less than results.',
  'Stay curious. Learn what the work needs.',
  'Leadership is service.',
  'Do work you are proud of.'
];

export const currentFocus = [
  {
    title: 'Accessible Publishers',
    url: 'https://accessiblepublishers.com/',
    summary: 'Growth across publishing, edtech, fintech, and media.'
  },
  {
    title: 'Smart Edu Hub',
    url: 'https://www.smarteduhub.ng/',
    summary: 'Edtech growth and getting more schools on the platform.'
  },
  { title: 'Smipay', url: 'https://www.smipay.ng/', summary: 'Campus partnerships and trade fair activations.' },
  {
    title: 'Oxygen FM',
    url: 'https://www.facebook.com/oxygen96.9fm',
    summary: 'Hosting The Compass and building relationships with business leaders.'
  },
  { title: 'Facity', summary: 'Campus activations and student ambassador programmes.' },
  {
    title: 'Personal Products',
    url: 'https://www.testmancer.com/',
    summary: 'TestMancer, WifMart, Royal Prince Hub, and new ideas in progress.'
  }
];

export const techStack = [
  'React',
  'Node',
  'Express',
  'MongoDB',
  'TypeScript',
  'Tailwind',
  'Supabase',
  'Vercel',
  'Cloudinary',
  'Stripe',
  'Google Analytics',
  'GitHub'
];

export const contactLinks = [
  { label: 'Email', href: 'mailto:joseph.adesunkanmi@gmail.com', icon: 'mail' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/ologundudu-joseph-adesukanmi-2172a1135/',
    icon: 'linkedin'
  },
  { label: 'GitHub', href: 'https://github.com/RoyalPrince700', icon: 'github' },
  { label: 'X (Twitter)', href: 'https://twitter.com/royalprincecube', icon: 'twitter' },
  { label: 'WhatsApp', href: 'https://wa.me/2348160881705', icon: 'whatsapp' }
];

export const testimonials = [
  {
    name: 'Adeyemi Favour',
    role: 'Mobile Developer',
    avatar: adeyemiAvatar,
    quote:
      'The book is so practical and relatable. The principles work when you actually use them. I recommend it to anyone who feels stuck and needs direction.'
  },
  {
    name: 'Adeboye Francis',
    role: 'SU Senate President, University of Ilorin',
    avatar: francisAvatar,
    quote:
      'I expected inspiration, but what stayed with me was the clarity. Each chapter pushed me toward discipline and real action. If you are ready to grow as a leader, this book will challenge and help you.'
  },
  {
    name: 'Oladipo Favour',
    role: 'Entrepreneur',
    avatar: favourAvatar,
    quote:
      'This is the kind of book you return to when you need to reset and lead well. It gives simple, practical steps that anyone can apply and see real change.'
  }
];

export const portfolioNavSections = [
  { id: 'hero', label: 'Home', icon: 'home' },
  { id: 'about', label: 'About', icon: 'user' },
  { id: 'impact', label: 'Impact', icon: 'chart' },
  { id: 'services', label: 'Services', icon: 'grid' },
  { id: 'projects', label: 'Projects', icon: 'layers' },
  { id: 'case-studies', label: 'Case Studies', icon: 'trending' },
  { id: 'leadership', label: 'Leadership', icon: 'flag' },
  { id: 'skills', label: 'Skills', icon: 'cpu' },
  { id: 'media', label: 'Media', icon: 'radio' },
  { id: 'writing', label: 'Writing', icon: 'book' },
  { id: 'testimonials', label: 'Testimonials', icon: 'quote' },
  { id: 'philosophy', label: 'Philosophy', icon: 'spark' },
  { id: 'focus', label: 'Focus', icon: 'target' },
  { id: 'tech-stack', label: 'Tech Stack', icon: 'code' },
  { id: 'contact', label: 'Contact', icon: 'mail' }
];

export const writingContent = {
  book: {
    title: 'Leadership From Within',
    link: '/all-books',
    image: leadingFromWithinImage
  },
  posts: blogPosts.slice(0, 4)
};
