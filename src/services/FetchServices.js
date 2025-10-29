// src/services/servicesApi.js
const ALL_SERVICES = [
  {
    id: 1,
    icon: "FaCode",
    title: "Web Development",
    description: "Master HTML, CSS, JavaScript, React & Node.js. Build responsive websites.",
    duration: "8 weeks",
    price: "XAF 15,000",
    isOnline: true,
  },
  {
    id: 2,
    icon: "FaChartBar",
    title: "Data Science",
    description: "Learn Python, SQL, Machine Learning & Data Visualization. Analyze real datasets.",
    duration: "12 weeks",
    price: "XAF 15,000",
    isOnline: true,
  },
  {
    id: 3,
    icon: "FaMobileAlt",
    title: "Digital Marketing",
    description: "SEO, Social Media, Google Ads & Analytics. Drive traffic and conversions.",
    duration: "6 weeks",
    price: "XAF 15,000",
    isOnline: false, // offline
  },
  {
    id: 4,
    icon: "FaServicestack",
    title: "Backend Development",
    description: "Node.js, Express, Fastapi, Django & Flask. Build scalable backend applications.",
    duration: "10 weeks",
    price: "XAF 15,000",
    isOnline: true,
  },
  {
    id: 5,
    icon: "FaDatabase",
    title: "Database Administration",
    description: "SQL, NoSQL, PostgreSQL & MongoDB. Design and manage enterprise databases.",
    duration: "10 weeks",
    price: "XAF 15,000",
    isOnline: true,
  },
  {
    id: 6,
    icon: "FaMobileAlt",
    title: "Frontend Development",
    description: "HTML, CSS, JavaScript, React & Node.js. Build responsive websites.",
    duration: "8 weeks",
    price: "XAF 15,000",
    isOnline: false,
  },
  {
    id: 7,
    icon: "FaMobileAlt",
    title: "Full Stack Development",
    description: "Node.js, Express, MongoDB & PostgreSQL. Build scalable backend applications.",
    duration: "10 weeks",
    price: "XAF 15,000",
    isOnline: true,
  },
  {
    id: 8,
    icon: "FaMobileAlt",
    title: "Mobile App Dev",
    description: "iOS & Android development with React Native & Flutter. Build cross-platform apps.",
    duration: "10 weeks",
    price: "XAF 15,000",
    isOnline: true,
  },
  {
    id: 9,
    icon: "FaDatabase",
    title: "Database Management",
    description: "SQL, NoSQL, PostgreSQL & MongoDB. Design and manage enterprise databases.",
    duration: "8 weeks",
    price: "XAF 15,000",
    isOnline: false,
  },
  {
    id: 10,
    icon: "FaMicrosoft",
    title: "Microsoft Office Skills",
    description: "Excel, Word, PowerPoint & Access. Master essential Microsoft Office skills.",
    duration: "6 weeks",
    price: "XAF 15,000",
    isOnline: true,
  },
  {
    id: 11,
    icon: "FaBug",
    title: "Test Automation",
    description: "Learn test manual and automated testing skills using Selenium, Cypress, Playwright, Appium, Python and more. Ensure software quality.",
    duration: "10 weeks",
    price: "XAF 15,000",
    isOnline: true,
  },
  {
    id: 12,
    icon: "FaCloud",
    title: "Cloud Computing",
    description: "AWS, Azure & Google Cloud. Deploy scalable applications in the cloud.",
    duration: "10 weeks",
    price: "XAF 15,000",
    isOnline: false,
  },
];

// Simulate network delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const fetchServices = async (status = "online") => {
  await delay(500); // mock latency

  let filtered = ALL_SERVICES;

  if (status === "online") {
    filtered = ALL_SERVICES.filter((s) => s.isOnline);
  } else if (status === "offline") {
    filtered = ALL_SERVICES.filter((s) => !s.isOnline);
  }
  // else: return all

  return filtered;
};

// Only export online fetch for public view
export const fetchOnlineServices = async () => {
  const response = await fetch('http://localhost:8000/api/services?status=online');
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
};