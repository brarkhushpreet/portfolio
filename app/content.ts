export type Shot = {
  /** The capture shown by default, and in the dark theme when `light` is set. */
  src: string;
  /** The same screen captured in the app's light theme, shown when the page is light. */
  light?: string;
  video?: string;
  alt: string;
  label: string;
  caption: string;
  format?: "mobile";
};

export type Project = {
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  year: string;
  status: string;
  discipline: string;
  description: string;
  built: string;
  decision: string;
  highlights: string[];
  stack: string[];
  liveUrl: string;
  repoUrl?: string;
  /** Index of the shot that leads the project panel. */
  lead: number;
  /** Index of the shot that plays in the hero reel. */
  reel: number;
  shots: Shot[];
};

export const links = {
  github: "https://github.com/brarkhushpreet/",
  resume: "/Khushpreet_Singh_Resume.pdf",
};

export const projects: Project[] = [
  {
    id: "echopass",
    title: "EchoPass / ClassPulse",
    shortTitle: "EchoPass",
    subtitle: "Verifiable classroom presence, without roll-call friction",
    year: "2025—26",
    status: "Capstone",
    discipline: "Full-stack · Audio systems",
    description:
      "A teacher-owned attendance platform that verifies the room through rotating ultrasound or fresh geolocation evidence.",
    built: "Teacher and student workflows, audio and location checks, classroom analytics, and signed attendance evidence.",
    decision:
      "Presence needs fresh evidence. A rotating room signal or a new location check ties verification to the current session.",
    highlights: ["Rotating acoustic challenges", "Live classroom analytics", "Signed attendance evidence"],
    stack: ["Next.js", "Web Audio", "PostgreSQL", "Prisma", "Redis", "WebSockets"],
    liveUrl: "https://classpulse.khushpreet.dev",
    repoUrl: "https://github.com/brarkhushpreet/AMS",
    lead: 0,
    reel: 4,
    shots: [
      { src: "/projects/echopass-current-dark.jpg", light: "/projects/echopass-current-light.jpg", alt: "EchoPass teacher overview with classroom, student, session, and attendance totals", label: "Teacher overview", caption: "Classrooms, students, sessions, and attendance at a glance. This capture follows the page theme: switch it and the screenshot switches too." },
      { src: "/projects/echopass-theme-motion.webp", video: "/projects/echopass-theme-motion.mp4", alt: "Switching the EchoPass teacher workspace from light to dark mode", label: "Light → dark", caption: "One workspace, two themes. A real light-to-dark switch keeps the dashboard in context." },
      { src: "/projects/echopass-classrooms-dark.jpg", alt: "EchoPass classroom directory and attendance summaries in dark mode", label: "Classroom directory", caption: "The classroom directory brings rosters, session counts, and attendance summaries into a single view." },
      { src: "/projects/echopass-filter-motion.webp", video: "/projects/echopass-filter-motion.mp4", alt: "Filtering EchoPass attendance by verification method", label: "Filter attendance", caption: "A real interaction in the attendance archive: narrow sessions by verification method." },
      { src: "/projects/echopass-method-motion.webp", video: "/projects/echopass-method-motion.mp4", alt: "Switching between location and ultrasound classroom controls", label: "Choose a presence check", caption: "Switch between location and ultrasound before opening a check-in window. No session is started in this clip." },
      { src: "/projects/echopass-current-mobile-dark.jpg", light: "/projects/echopass-current-mobile-light.jpg", alt: "Updated EchoPass teacher dashboard on mobile", label: "Responsive dashboard", caption: "The updated teacher overview at phone width.", format: "mobile" },
      { src: "/projects/echopass-classrooms-mobile.jpg", alt: "EchoPass classroom directory on a phone in dark mode", label: "Mobile classrooms", caption: "Classroom cards reflow into a focused, single-column directory on a phone.", format: "mobile" },
    ],
  },
  {
    id: "chat",
    title: "Nexus Realtime Chat",
    shortTitle: "Nexus Chat",
    subtitle: "Persistent conversations and lightweight team huddles",
    year: "2024—26",
    status: "Built",
    discipline: "Realtime · Collaboration",
    description:
      "A realtime collaboration workspace with authenticated rooms, persistent messages, presence, and browser-native huddles.",
    built: "Authenticated spaces and rooms, a persistent message history, realtime events, and browser-native huddles.",
    decision:
      "A persistent Node server handles authenticated Socket.IO events. WebRTC handles small group calls in the browser.",
    highlights: ["Authenticated Socket.IO rooms", "Persistent message history", "Native WebRTC huddles"],
    stack: ["Next.js", "Socket.IO", "WebRTC", "PostgreSQL", "Prisma", "Auth.js"],
    liveUrl: "https://nexus.khushpreet.dev",
    repoUrl: "https://github.com/brarkhushpreet/Chat-Application-nextjs",
    lead: 0,
    reel: 3,
    shots: [
      { src: "/projects/chat-current-dark.jpg", light: "/projects/chat-current-light.jpg", alt: "Nexus conversation workspace with spaces, rooms, direct messages, and a shared room thread", label: "Conversation view", caption: "Spaces, rooms, and direct messages around a shared thread. This capture follows the page theme: switch it and the screenshot switches too." },
      { src: "/projects/chat-theme-motion.webp", video: "/projects/chat-theme-motion.mp4", alt: "Switching the Nexus conversation workspace from light to dark mode", label: "Light → dark", caption: "Switch from light to dark without leaving the conversation, recorded in the real demo workspace." },
      { src: "/projects/chat-people-dark.jpg", alt: "Nexus people directory in dark mode with fictional demo members", label: "People directory", caption: "A dedicated people directory keeps workspace membership easy to review." },
      { src: "/projects/chat-compose-motion.webp", video: "/projects/chat-compose-motion.mp4", alt: "Composing a draft in the updated Nexus light workspace", label: "Compose in context", caption: "A short recording of drafting a message in the real composer. No message is sent." },
      { src: "/projects/chat-search-motion.webp", video: "/projects/chat-search-motion.mp4", alt: "Searching rooms in Nexus’s dark-mode command palette", label: "Quick navigation", caption: "Open quick navigation and narrow the room list without leaving the conversation." },
      { src: "/projects/chat-current-mobile-dark.jpg", light: "/projects/chat-current-mobile-light.jpg", alt: "Updated Nexus conversation on mobile", label: "Responsive workspace", caption: "The refreshed conversation view at phone width.", format: "mobile" },
      { src: "/projects/chat-navigation-mobile.jpg", alt: "Nexus mobile navigation showing rooms and direct messages in dark mode", label: "Mobile navigation", caption: "The mobile navigation drawer brings rooms, direct messages, and huddles within reach.", format: "mobile" },
    ],
  },
  {
    id: "movies",
    title: "Vanta Movie Explorer",
    shortTitle: "Movie Explorer",
    subtitle: "A cinematic, profile-aware streaming discovery experience",
    year: "2024—26",
    status: "Live",
    discipline: "Product · Discovery",
    description:
      "A polished streaming-discovery product with member accounts, profiles, search, watchlists, title details, and trailer flows.",
    built: "A responsive discovery interface with title details, search, member profiles, and a persistent watchlist.",
    decision:
      "TMDB supplies metadata with a curated fallback for dependable browsing. PostgreSQL stores profiles and each profile’s My List.",
    highlights: ["Profile-aware discovery", "Live TMDB metadata", "Persistent My List"],
    stack: ["Next.js", "React", "TMDB", "PostgreSQL", "Tailwind CSS"],
    liveUrl: "https://movies.khushpreet.dev",
    lead: 0,
    reel: 1,
    shots: [
      { src: "/projects/movie-discover-motion.webp", video: "/projects/movie-discover-motion.mp4", alt: "Opening Inception from Vanta’s discovery screen", label: "Discover a title", caption: "A cinematic lead and content rails give the catalogue a clear starting point." },
      { src: "/projects/movie-save-motion.webp", video: "/projects/movie-save-motion.mp4", alt: "Saving Inception and opening My List in Vanta", label: "Save to My List", caption: "Save a title from its detail view and find it again in My List." },
      { src: "/projects/movie-catalog.png", alt: "Vanta movie catalog screen", label: "Movie catalog", caption: "Catalogue rows support browsing beyond the featured title." },
      { src: "/projects/movie-profiles.png", alt: "Vanta profile selection screen", label: "Profile selection", caption: "Separate profiles give each viewer their own collection." },
      { src: "/projects/movie-profile-menu.png", alt: "Vanta profile controls over the cinematic home screen", label: "Profile controls", caption: "Profile controls stay accessible while browsing." },
      { src: "/projects/movie-mobile.png", alt: "Vanta cinematic discovery home on a mobile viewport", label: "Responsive discovery", caption: "Discovery rails and title context adapt to a narrow screen.", format: "mobile" },
    ],
  },
  {
    id: "blog",
    title: "Developer Blog",
    shortTitle: "Developer Blog",
    subtitle: "First-principles notes on software systems",
    year: "2024—26",
    status: "Published",
    discipline: "Publishing · Full-stack",
    description:
      "A focused technical publication covering JavaScript, React, Node.js, realtime systems, Docker, AWS, and architecture.",
    built: "A technical publication with topic filters, search, Markdown reading views, and an independent content API.",
    decision:
      "The Express content API is separate from the Next.js reader. Structured Markdown keeps publishing and presentation independent.",
    highlights: ["Ten technical deep dives", "Search and topic filters", "Independent content API"],
    stack: ["Next.js", "Express", "MongoDB", "Markdown", "Cloudflare"],
    liveUrl: "https://blog.khushpreet.dev",
    repoUrl: "https://github.com/brarkhushpreet/blog",
    lead: 2,
    reel: 1,
    shots: [
      { src: "/projects/blog-home.png", alt: "Developer blog home page", label: "Publication home", caption: "The publication home introduces the latest writing with a clear reading hierarchy." },
      { src: "/projects/blog-filter-motion.webp", video: "/projects/blog-filter-motion.mp4", alt: "Filtering the developer blog archive by React", label: "Filter the archive", caption: "Topic filters make the technical archive easier to browse." },
      { src: "/projects/blog-read-motion.webp", video: "/projects/blog-read-motion.mp4", alt: "Opening a React article from the filtered archive", label: "Open an article", caption: "The reading view gives long-form explanations room to breathe." },
      { src: "/projects/blog-about.png", alt: "Developer blog about page", label: "About the publication", caption: "The about page explains the publication’s focus and perspective." },
      { src: "/projects/blog-search.png", alt: "Developer blog search results for WebSocket articles", label: "Search and filters", caption: "Search narrows the archive to articles relevant to the current question." },
      { src: "/projects/blog-mobile.png", alt: "Developer blog home page on a mobile viewport", label: "Responsive reading", caption: "Responsive typography keeps technical writing readable on a phone.", format: "mobile" },
    ],
  },
];

export const experience = [
  {
    date: "Jun 2026 — Present",
    role: "Software Development Engineer II",
    copy: "Deliver full-stack features from UI to infrastructure, building React and Next.js interfaces, Node.js and TypeScript APIs, realtime workflows, and AWS deployments; maintain them in production.",
    tech: ["React", "Next.js", "TypeScript", "Node.js", "AWS", "Realtime"],
  },
  {
    date: "May 2025 — May 2026",
    role: "Software Development Engineer I",
    copy: "Built React and Next.js features, integrated REST APIs, and improved rendering and bundle size through profiling and code splitting. Took on selected backend and realtime work alongside AWS deployments.",
    tech: ["React", "Next.js", "REST APIs", "React Profiler", "Node.js", "AWS"],
  },
  {
    date: "Jul 2024 — Apr 2025",
    role: "Software Development Engineer Intern",
    copy: "Modernized legacy React interfaces with shadcn/ui, integrated Stream Chat using Redux and custom hooks, and automated deployments with GitHub Actions on AWS EC2 while working with RDS.",
    tech: ["React", "shadcn/ui", "Redux", "Stream Chat", "GitHub Actions", "AWS"],
  },
];

export const tools = ["React", "Next.js", "TypeScript", "Node.js", "Python", "PostgreSQL", "Redis", "AWS"];
