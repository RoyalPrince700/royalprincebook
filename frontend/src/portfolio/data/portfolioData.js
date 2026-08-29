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
import flierStudioLogo from '../../assets/logo/flier-studio-logo-horizontal-on-paper-main-1788028063388-3240x3240.png';
import facityLogo from '../../assets/logo/facitylogo.png';
import { blogPosts } from '../../blog/data/posts';

export const portfolioMeta = {
  title: 'Royal Prince | Growth Officer, Product Builder & Leader',
  description:
    'Portfolio of Joseph Adesunkanmi (Royal Prince). Growth Officer, software engineer, and product builder who takes ownership, stays curious, and gets things done.',
  url: 'https://www.royalprincehub.com/',
  image: 'https://www.royalprincehub.com/og-portfolio.jpg',
  twitter: '@royalprincecube'
};

export const heroContent = {
  lines: ['Ownership.', 'Curiosity.', 'Execution.'],
  subheading:
    'Full-stack builder behind Flier Studio, TestMancer, Smartboard, and Taskboard. I think deeply, design clearly, and ship products people actually use.',
  portrait: royalPrinceImage,
  cvPath: '/resume/royal-prince-cv.pdf',
  cvFileName: 'Royal-Prince-CV.pdf',
  techIcons: ['React', 'Node', 'MongoDB', 'Tailwind', 'Full-Stack', 'Product'],
  actions: [
    { label: 'View My Work', href: '#projects', primary: true },
    { label: 'Get in Touch', href: '#contact', primary: false }
  ]
};

export const trustedBy = [
  {
    name: 'Accessible Publishers Limited',
    url: 'https://accessiblepublishers.com/',
    logo: accessibleLogo
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
  }
];

export const aboutContent = {
  portrait: royalPrinceImage,
  role: 'Executive Assistant, Growth & Strategy · Product Builder',
  title: 'Deep thinker. Relentless builder.',
  hook:
    'I sit with problems until I understand them — then I design and ship products that solve real ones.',
  highlights: [
    {
      id: 'flier-studio',
      eyebrow: 'Product',
      title: 'Flier Studio',
      text: 'A platform where users create professional fliers from ready-made templates — fast, flexible, and built for creators who need polish without the design overhead.',
      icon: 'code',
      url: 'https://www.flierstudio.com'
    },
    {
      id: 'testmancer',
      eyebrow: 'EdTech',
      title: 'TestMancer',
      text: 'An LMS and smart board for teaching and learning — quizzes, lessons, and classroom tools built for educators who need more than a basic assessment app.',
      icon: 'chart',
      url: 'https://www.testmancer.com'
    },
    {
      id: 'taskboard',
      eyebrow: 'This site',
      title: 'Taskboard & Noteboard',
      text: 'Productivity tools I built on this site — gamified task tracking and a flexible note workspace for people who think in systems, not scattered lists.',
      icon: 'flag',
      url: 'https://www.royalprincehub.com/taskboard'
    },
    {
      id: 'approach',
      eyebrow: 'Mindset',
      title: 'Think deep. Build clear.',
      text: 'I slow down to understand the user, the friction, and the outcome before I sketch a flow or write a line of code — then I execute until it ships.',
      icon: 'radio'
    }
  ],
  topics: [
    'Deep Thinking',
    'Product Building',
    'Full-Stack Development',
    'Growth Strategy',
    'EdTech',
    'Systems Design',
    'Strategy',
    'Execution'
  ],
  more: [
    'I am Executive Assistant for Growth and Strategy at Accessible Publishers Limited — supporting growth across publishing, edtech, fintech, and media. But the work I am most proud of is what I build: products that start as a clear idea and end up in people’s hands.',
    'Flier Studio, TestMancer, Taskboard, and Noteboard all came from the same place — noticing a gap, thinking it through properly, and building something that actually works. That is how I show up: curious, deliberate, and focused on getting things done.'
  ]
};

export const impactStats = [
  {
    value: 3000,
    suffix: '+',
    label: 'Users on TestMancer — LMS and smart board for teaching and learning'
  },
  {
    value: null,
    display: 'Several',
    label: 'Ready-made templates on Flier Studio for creating professional fliers'
  },
  {
    value: null,
    display: 'Live',
    label: 'Taskboard & Noteboard — users are already recording tasks and notes on royalprincehub.com'
  },
  {
    value: 10,
    suffix: '+',
    label: 'Production websites and products shipped from idea to launch'
  }
];

export const whatIDo = [
  {
    title: 'Flier Studio',
    summary:
      'Template-first flier app — browse published boards, customize text, photos, and colors, then export print-ready PNG or JPG at native social sizes.',
    icon: 'compass'
  },
  {
    title: 'TestMancer',
    summary:
      'Gamified exam prep with courses, smart quizzes, gems, badges, and leaderboards. 3,000+ users learning through interactive study and friendly competition.',
    icon: 'chart'
  },
  {
    title: 'Smartboard',
    summary:
      'Interactive math teaching board inside TestMancer — dictate equations by voice, write by hand, and get solutions in real time while you teach.',
    icon: 'code'
  },
  {
    title: 'Taskboard',
    summary:
      'Gamified weekly planner built on royalprincehub.com — XP, streaks, focus mode, boss-battle projects, and shareable progress reports.',
    icon: 'settings'
  },
  {
    title: 'Noteboard',
    summary:
      'Freeform canvas with sticky notes and live collaborative share links — for mapping ideas when a task list is not enough.',
    icon: 'users'
  },
  {
    title: 'Royal Prince Hub',
    summary:
      'This site — portfolio, books, blog, and the productivity tools I ship. One platform where my writing and products live together.',
    icon: 'flag'
  }
];

export const featuredProjects = [
  {
    id: 'flier-studio',
    title: 'Flier Studio',
    url: 'https://www.flierstudio.com/',
    logo: flierStudioLogo,
    logoScale: 'bold',
    description: 'Create professional fliers from ready-made templates.',
    problem: 'Creators and small teams needed a fast way to design polished fliers without starting from a blank canvas.',
    role: 'Founder & Lead Developer',
    technologies: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    impact: 'Several templates live — users can pick a design and customize it in minutes.',
    lessons: 'Design tools win when the first result looks good with minimal effort.',
    gradient: 'from-orange-500/20 via-amber-400/10 to-slate-900/5'
  },
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
    summary:
      'Growth Officer driving digital product adoption and managing social media growth for the edtech platform.'
  },
  {
    title: 'Smipay',
    url: 'https://www.smipay.ng/',
    logo: smipayLogo,
    sector: 'Fintech',
    summary:
      'Growth & Partnership Lead driving campus adoption, trade fair activations, and university partnerships.'
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
    id: 'flier-studio',
    title: 'Flier Studio',
    url: 'https://www.flierstudio.com/',
    urlLabel: 'Visit Flier Studio',
    challenge:
      'Event and promo graphics die in the gap between "we need a flier tonight" and "someone has time to design one."',
    strategy: [
      'A web app for making and exporting print-ready social fliers',
      'Browse team-published templates, open one in the Studio, edit words, photos, and colors',
      'Download PNG or JPG at the native size the board was built for — not a stretched default'
    ],
    execution:
      'Start with a template. Make it yours. Templates carry the layout craft — Signal accent, warm ink and paper, type that can shout when it should — so you spend energy on the message, not reinventing margins. Sign in with Google, pick a board, customize it, and export when it is ready to post.',
    result:
      'Designers skip rebuilding the same poster structure and ship variations fast. Non-designers get ready layouts with hierarchy, spacing, and export size already dialed in — without a blank artboard or a magic "AI does the whole poster" button.',
    highlights: ['Template system', 'Studio editor', 'Native export sizes', 'Instagram · Story · LinkedIn']
  },
  {
    id: 'taskboard-noteboard',
    title: 'Taskboard & Noteboard',
    url: 'https://www.royalprincehub.com/taskboard',
    urlLabel: 'Open Taskboard',
    challenge:
      'Most productivity tools feel like flat todo lists — they do not match how people who think in systems plan, execute, and capture ideas.',
    strategy: [
      'Taskboard — gamified weekly planner with XP, streaks, focus mode, and boss-battle projects',
      'Noteboard — infinite canvas with sticky notes and live collaborative share links',
      'Both built into royalprincehub.com alongside the portfolio, books, and blog'
    ],
    execution:
      'Taskboard turns daily work into a visual workflow: weekly calendar, task statuses, priority levels, focus-mode timers, achievement marks, and shareable progress reports. Noteboard is the freeform side — pannable canvas, colored sticky notes, multiple boards, and real-time editing when you share a link. Plan and execute on Taskboard; map loose ideas on Noteboard.',
    result:
      'Users are already recording tasks and notes on the platform. One sign-in, two surfaces — structured execution when you need momentum, open space when you need to think.',
    highlights: ['XP & streaks', 'Focus mode', 'Share links', 'Live collaboration']
  },
  {
    id: 'smartboard',
    title: 'Smartboard',
    url: 'https://www.testmancer.com/',
    urlLabel: 'Visit TestMancer',
    challenge:
      'Teaching mathematics needs more than static quizzes — educators and students need a board that responds to how math is actually spoken, written, and worked through.',
    strategy: [
      'Interactive smart board for teaching and learning mathematics',
      'Dictate an equation by voice and get it solved',
      'Write by hand — the board detects the equation and solves it'
    ],
    execution:
      'Built inside TestMancer alongside the LMS: lessons, quizzes, and classroom tools on one platform. The smart board reads handwritten math, listens to spoken equations, and works through solutions in real time — so teachers can teach on a surface that keeps up with the lesson.',
    result:
      '3,000+ users on TestMancer. Educators use it as a real teaching and learning surface — not just an assessment app — with voice, handwriting, and interactive problem-solving in one place.',
    highlights: ['Voice dictation', 'Handwriting detection', 'LMS', '3,000+ users']
  }
];

export const leadershipTimeline = [
  {
    title: 'Flier Studio',
    org: 'flierstudio.com',
    period: 'Live',
    logo: flierStudioLogo,
    summary:
      'A template-first web app for print-ready social fliers. Browse published boards, customize text, photos, and colors in the Studio, then export PNG or JPG at native platform sizes.',
    highlights: [
      'Several templates published — Instagram, story, LinkedIn, and more',
      'Studio editor with editable slots and export at native pixels',
      'Built for designers who want speed and non-designers who need ready layouts'
    ]
  },
  {
    title: 'Taskboard & Noteboard',
    org: 'royalprincehub.com',
    period: 'Live',
    summary:
      'Productivity tools built into this site — a gamified weekly taskboard for planning and execution, plus a freeform noteboard canvas for brainstorming and live collaboration.',
    highlights: [
      'Taskboard: XP, streaks, focus mode, boss-battle projects, and shareable reports',
      'Noteboard: infinite canvas, sticky notes, and real-time collaborative share links',
      'Users are already recording tasks and notes on the platform'
    ]
  },
  {
    title: 'TestMancer & Smartboard',
    org: 'testmancer.com',
    period: '3,000+ users',
    logo: testMancerLogo,
    summary:
      'Edtech platform with an LMS and interactive smart board for teaching mathematics — dictate equations by voice, write by hand and get solutions, plus lessons and classroom tools.',
    highlights: [
      'Smart board reads handwritten math and spoken equations',
      'LMS with quizzes, lessons, and teaching workflows',
      '3,000+ users on the platform'
    ]
  },
  {
    title: 'Royal Prince Hub',
    org: 'royalprincehub.com',
    period: 'Live',
    summary:
      'This site — portfolio, digital library, blog, and the productivity tools I build. One home for my writing, products, and experiments.',
    highlights: [
      'Portfolio, books, and blog in one place',
      'Taskboard and Noteboard integrated on the same platform',
      'Full-stack build with React, Node.js, and MongoDB'
    ]
  },
  {
    title: 'WifMart',
    org: 'wifmart.com',
    period: 'Live',
    summary:
      'E-commerce marketplace connecting local sellers with customers online — product listings, vendor flows, and a storefront built for trust.',
    highlights: [
      'Marketplace for vendors and buyers',
      'Full-stack product from idea to launch',
      'React, Node.js, Express, MongoDB, and Stripe'
    ]
  }
];

export const skills = {
  'Software Engineering': ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'Tailwind', 'Git'],
  Growth: ['SEO', 'Google Analytics', 'Growth Strategy', 'Community Building', 'Growth Systems'],
  Leadership: ['Public Speaking', 'People Management', 'Operational Excellence'],
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
    title: 'Smartboard',
    url: 'https://www.testmancer.com/',
    summary:
      'A big focus right now. Interactive math teaching surface — dictate an equation by voice, write by hand and the board detects and solves it. Built inside TestMancer so educators can teach on a board that keeps up with the lesson.'
  },
  {
    title: 'TestMancer',
    url: 'https://www.testmancer.com/',
    summary:
      'Making exam preparation exciting with gamified learning and friendly competition. Interactive courses, smart quizzes tailored to progress, gems, badges, leaderboards, and instant feedback — study time that feels like play. 3,000+ users and growing.'
  },
  {
    title: 'Flier Studio',
    url: 'https://www.flierstudio.com/',
    summary:
      'Expanding the template library right now. A web app for print-ready social fliers — browse published boards, customize in the Studio, export at native sizes. Designers get speed; non-designers get layouts that already look intentional.'
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

export const footerNavLinks = [
  { label: 'Home', to: '/' },
  { label: 'Books', to: '/all-books' },
  { label: 'Blog', to: '/blog' },
  { label: 'Taskboard', to: '/taskboard' },
  { label: 'Noteboard', to: '/noteboard' },
  { label: 'TestMancer', href: 'https://www.testmancer.com/' },
  { label: 'Flier Studio', href: 'https://www.flierstudio.com/' }
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
      'The book is so practical and relatable, they are principles/actions point which when engaged have one desire output which is Results. You have lived it and now you are putting it in a book for those that want to have the same results as yours. This is a book I can recommend to anyone struggling and be certain that they will find their feet.'
  },
  {
    name: 'Adeboye Francis',
    role: 'SU, Senate President, University of Ilorin.',
    avatar: francisAvatar,
    quote:
      'I expected inspiration, but what stayed with me was the clarity. Each chapter pushed me toward discipline and real action. The practical lessons and the focus on mindset set this book apart. If you’re ready to grow as a leader and see actual results, this book will challenge and help you to do just that. I highly recommend this book to all aspiring leaders.'
  },
  {
    name: 'Oladipo Favour',
    role: 'Entrepreneur',
    avatar: favourAvatar,
    quote:
      'This is the kind of book you return to when you need to reset and lead well. What I appreciate most is that it goes beyond leadership theory; it gives you simple, practical steps that anyone regardless of experience can apply and see real change. Whether you feel lost, discouraged, this book gives you the focus and courage to try again.'
  }
];

export const portfolioNavSections = [
  { id: 'hero', label: 'Home', icon: 'home' },
  { id: 'about', label: 'About', icon: 'user' },
  { id: 'impact', label: 'Impact', icon: 'chart' },
  { id: 'services', label: 'Services', icon: 'grid' },
  { id: 'projects', label: 'Projects', icon: 'layers' },
  { id: 'case-studies', label: 'Case Studies', icon: 'trending' },
  { id: 'leadership', label: 'Timeline', icon: 'layers' },
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
