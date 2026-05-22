import type { Messages } from "../types";

export const en = {
  settings: {
    openMenu: "Open settings",
    closeMenu: "Close settings",
    language: "Language",
    theme: "Theme",
    langEs: "Español",
    langEn: "English",
    themeLight: "Light mode",
    themeDark: "Dark mode",
  },
  nav: {
    home: "Home",
    homeAria: "Go to home",
    process: "Process",
    processAria: "Go to our work process",
    projects: "Projects",
    projectsAria: "Go to projects",
    team: "About us",
    teamAria: "Go to about us",
    contact: "Contact",
    contactAria: "Go to contact",
    cta: "Contact us",
    menu: "Menu",
    close: "Close",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menuOpen: "Menu open",
  },
  hero: {
    ariaLabel: "Home",
    titleDevelop: "We build",
    titleExperiences: "Digital",
    titleDigital: "Experiences",
    description:
      "A solid, modern digital presence designed to turn visits into customers.",
    cta: "Learn More",
    bannerAlt: "GRG three-dimensional logo",
  },
  workWithUs: {
    eyebrow: "Work with us",
    steps: {
      step1: {
        title: "We receive your idea",
        text: "We turn your idea into a clear design and development plan. We prepare a budget and give you a delivery timeline.",
        imageAlt:
          "Illustration of step one: receiving and planning an idea",
      },
      step2: {
        title: "We build your project",
        text: "We develop your project with precision, clear goals, and defined timelines to deliver a solid, high-quality solution.",
        imageAlt: "Illustration of step two: project development",
      },
      step3: {
        title: "We make it real",
        text: "We deliver a finished solution, refined in every detail and ready to support your business growth.",
        imageAlt: "Illustration of step three: solution delivery",
      },
    },
  },
  projects: {
    eyebrow: "Projects",
    displayFull: "We turn your ideas into successful projects",
    displayMobile: {
      line1a: "We turn your ",
      line1b: "ideas",
      line2a: "into successful ",
      line2b: "projects",
    },
    displayDesktop: {
      line1: "We turn",
      line2a: "your ",
      line2b: "ideas",
      line3: "into successful",
      line4: "projects",
    },
    carouselLabel: "Featured projects",
    carouselRole: "carousel",
    prevProject: "View previous project",
    nextProject: "View next project",
    screenshotAlt: "Screenshot of project {{name}}",
    viewMain: "main view",
    detail1: "detail 1",
    detail2: "detail 2",
    imageFallback: "image",
    enlarge: "Enlarge: {{alt}}",
    clientType: "Client type: {{type}}",
    clientNational: "National",
    clientInternational: "International",
    showDetails: "Show project details",
    hideDetails: "Hide project details",
    lightboxGalleryLabel: "Image gallery: {{name}}",
    closeGallery: "Close gallery",
    close: "Close",
    prevImage: "Previous image",
    nextImage: "Next image",
    items: {
      "1": {
        description:
          "E-commerce built for an Argentine apparel brand focused on online clothing sales. The platform includes a product catalog, database, server, shopping cart, and online payments, offering a clear experience for customers and administrators.",
      },
      "2": {
        description:
          "Administrative web system built for an international financial organization based in the British Virgin Islands. The platform centralizes events, news, newsletters, memberships, members, legislation, and publications, offering a complete experience for users and administrators.",
      },
      "3": {
        description:
          "Online store and website built for an Argentine venture specialized in water filters for cultivation. The platform presents its products clearly and professionally, highlighting the importance of water quality in growing, caring for, and maintaining crops.",
      },
      "4": {
        description:
          "Educational platform with integrated artificial intelligence built for an institution linked to China and the United States. The system lets teachers create assignments and students upload videos speaking English to receive automatic feedback aimed at improving oral performance.",
      },
      "5": {
        description:
          "International educational platform built for a team with presence in China, Japan, and the United States. The system centralizes courses, webinars, seminars, and content on nutrition, fitness lifestyle, and professional training, offering an organized experience for users and administrators.",
      },
      "6": {
        description:
          "E-commerce built for an Argentine venture dedicated to selling 3D-printed objects. The platform includes a product catalog, database, server, shopping cart, and online payments, enabling professional product management and sales.",
      },
    },
  },
  team: {
    headingLead: "Who ",
    headingAccent: "we are",
    role: "Fullstack Web Developer",
    gael: {
      imageAlt: "Illustration of Gael Garcia",
      description: {
        part1: "Focused on ",
        emphasize: "web solutions",
        part2:
          ", performance, and experiences that convert. Combines product judgment with flawless technical execution.",
      },
    },
    manuel: {
      imageAlt: "Illustration of Manuel Rodriguez Garcia",
      description: {
        part1:
          "Translates each brand's identity into clear, memorable interfaces. ",
        emphasize: "Design and narrative",
        part2:
          " aligned with business goals, without losing sight of visual detail.",
      },
    },
  },
  contact: {
    heading: "We build websites that ",
    headingAccent: "grow",
    headingEnd: " your business.",
    sublead: "Tell us about your project and we will reply with a clear proposal.",
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "you@email.com",
    company: "Company",
    optional: "(optional)",
    companyPlaceholder: "Your company name",
    service: "What service do you need?",
    servicePlaceholder: "Select a service",
    project: "Tell us about your project",
    projectPlaceholder: "Describe your idea, goals, and references...",
    submit: "Send message",
    submitting: "Sending…",
    successTitle: "Message sent!",
    successText:
      "We will contact you soon. We review every request with care.",
    sendAnother: "Send another message",
    services: {
      corporate: "Corporate website",
      ecommerce: "E-commerce",
      landing: "Landing page",
      redesign: "Redesign",
      maintenance: "Maintenance",
      other: "Other",
    },
  },
  footer: {
    ariaLabel: "Footer",
    companyName: "Agencia Web GMG",
    logoAria: "{{company}}, go to home",
    description:
      "We are your trusted digital partner: web design and development with judgment, performance, and a clear identity so your brand stands out with confidence.",
    quickLinks: "Quick links",
    copyright: "© {{year}} {{company}}. All rights reserved.",
    privacy: "Privacy policy",
    terms: "Terms and conditions",
    cookies: "Cookies",
  },
} satisfies Messages;
