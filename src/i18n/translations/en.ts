import type { Messages } from "../types";

export const en = {
  settings: {
    openMenu: "Open settings",
    closeMenu: "Close settings",
    button: "Settings",
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
    process: "Method",
    processAria: "Go to our work method",
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
    titleLine1: "We grow",
    titleAccent: "your business",
    description:
      "We build custom sites and systems to simplify your work and unlock new opportunities.",
    cta: "Tell us about your project",
    visualAria: "Services and main illustration",
    visualAlt: "3D illustration of a digital platform on a pedestal",
    services: {
      management: {
        title: "Organize your\nbusiness",
        description: "Centralize clients, payments, and processes.",
        imageAlt: "3D illustration of business management",
      },
      websites: {
        title: "Your business\non the web",
        description: "Show what you do and get more inquiries.",
        imageAlt: "3D illustration of a professional website",
      },
      invoicing: {
        title: "Invoice\nmore simply",
        description: "Issue and organize receipts online.",
        imageAlt: "3D illustration of digital invoicing",
      },
      ecommerce: {
        title: "Sell\nonline",
        description: "Showcase products and manage your sales.",
        imageAlt: "3D illustration of ecommerce",
      },
    },
  },
  workWithUs: {
    eyebrow: "What's it like working with us?",
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
    displayFull: "We create web solutions made for real growth",
    displayMobile: {
      line1a: "We create web ",
      line1b: "solutions",
      line2a: "made for real ",
      line2b: "growth",
    },
    displayDesktop: {
      line1: "We create",
      line2a: "web ",
      line2b: "solutions",
      line3: "made for",
      line4a: "real ",
      line4b: "growth",
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
    clientGrgTool: "GRG internal tool",
    showDetails: "Show project details",
    hideDetails: "Hide project details",
    lightboxGalleryLabel: "Image gallery: {{name}}",
    viewCaseStudy: "Project details",
    closeGallery: "Close gallery",
    close: "Close",
    prevImage: "Previous image",
    nextImage: "Next image",
    items: {
      "8": {
        description:
          "Web system for Rothamel Repuestos that centralizes catalogs of parts for trucks, heavy vehicles, and agricultural machinery. It replaces Excel and manual updates with search, organization, and orderly product updates.",
        caseStudyDescription:
          "Rothamel managed parts catalogs with Excel and manual updates, which made search and data maintenance difficult. We built a web platform that centralizes loading, organization, and product lookup for trucks, heavy vehicles, and agricultural machinery, cutting repetitive work and keeping information up to date more simply.",
      },
      "1": {
        description:
          "E-commerce built for an Argentine apparel brand focused on online clothing sales. The platform includes a product catalog, database, server, shopping cart, and online payments, offering a clear experience for customers and administrators.",
        caseStudyDescription:
          "The brand sold through social media and DMs without a owned channel that conveyed identity or streamlined checkout. We built an online store with catalog, cart, and integrated payments so the team manages stock and orders from one panel while keeping the brand look and feel.",
      },
      "2": {
        description:
          "Administrative web system built for an international financial organization based in the British Virgin Islands. The platform centralizes events, news, newsletters, memberships, members, legislation, and publications, offering a complete experience for users and administrators.",
        caseStudyDescription:
          "The organization published events, news, and documentation through manual workflows and disconnected tools. We centralized everything in a single admin panel with clear flows to edit content and keep member- and visitor-facing information up to date.",
      },
      "3": {
        description:
          "Online store and website built for an Argentine venture specialized in water filters for cultivation. The platform presents its products clearly and professionally, highlighting the importance of water quality in growing, caring for, and maintaining crops.",
        caseStudyDescription:
          "The venture needed to explain why water quality matters for cultivation and turn that message into online sales. We created a site and store that present filters clearly, guide buyers, and enable frictionless checkout for the Argentine team.",
      },
      "4": {
        description:
          "Educational platform with integrated artificial intelligence built for an institution linked to China and the United States. The system lets teachers create assignments and students upload videos speaking English to receive automatic feedback aimed at improving oral performance.",
        caseStudyDescription:
          "Teachers and students lacked a scalable way to practice spoken English with useful feedback across China and the United States. The platform lets them create assignments, upload videos, and receive AI-powered feedback aligned with each institution's educational workflow.",
      },
      "5": {
        description:
          "International educational platform built for a team with presence in China, Japan, and the United States. The system centralizes courses, webinars, seminars, and content on nutrition, fitness lifestyle, and professional training, offering an organized experience for users and administrators.",
        caseStudyDescription:
          "The team distributed nutrition and fitness training across formats without a coherent hub for audiences in different countries. We built a platform that organizes courses, seminars, and webinars in one place, with clear administration for teams in China, Japan, and the U.S.",
      },
      "6": {
        description:
          "E-commerce built for an Argentine venture dedicated to selling 3D-printed objects. The platform includes a product catalog, database, server, shopping cart, and online payments, enabling professional product management and sales.",
        caseStudyDescription:
          "The business sold 3D-printed pieces informally, without a digital catalog or structured online payments. We implemented e-commerce with catalog, inventory, and integrated payments to professionalize sales and free up time for the Argentine founder.",
      },
      "7": {
        description:
          "Internal tool developed by GRG to identify business opportunities and collect contact data from potential clients. The platform helps detect businesses, organize leads and centralize key information to optimize the commercial prospecting process.",
        caseStudyDescription:
          "GRG needed a more organized and efficient way to find potential clients without relying on scattered manual searches. We developed leadScope as an internal tool to detect businesses, collect contact data and manage commercial opportunities from one place.",
      },
    },
  },
  team: {
    headingLead: "Who ",
    headingAccent: "we are",
    originImageAlt: "Illustration of the founders working on the GRG letters",
    originStory:
      "GRG was born as a project among colleagues with the goal of offering quality web services in a market with high demand but also full of generic or half-finished products. We wanted something different: websites designed for each business, with real attention to detail. Our priority will always be quality, achieving a unique identity for each client, and creating a great experience when using any of our products.",
    role: "Fullstack Web Developer",
    coFounderBadge: "CO-FOUNDER",
    gael: {
      imageAlt: "Illustration of Gael Garcia",
      description: {
        full: "Focused on developing efficient and secure systems for storing and managing all data for each project.",
      },
    },
    manuel: {
      imageAlt: "Illustration of Manuel Rodriguez Garcia",
      description: {
        full: "In charge of designing and developing the visual style of all our projects. Detail-oriented and creator of tailored solutions for each client.",
      },
    },
  },
  contact: {
    heading: "Contact us to ",
    headingAccent: "get started",
    headingEnd: "",
    sublead: "Tell us your idea — we'll make it real.",
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
    errorTitle: "We couldn't send your message",
    errorText:
      "There was a problem submitting the form. Please try again in a few minutes.",
    retry: "Try again",
    validation: {
      nameMin: "Name must be at least 2 characters.",
      projectMin: "Describe your project in at least 10 characters.",
      noUrls: "Do not include links (http:// or https://) in this field.",
      emailInvalid: "Enter a valid email address.",
      serviceRequired: "Select a service.",
    },
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
    companyName: "Agencia Web GRG",
    logoAria: "{{company}}, go to home",
    description:
      "We are a web design and development agency: we turn ideas into fast, clear sites built to help your brand turn visits into customers.",
    contact: "Contact",
    email: "agencygrg@gmail.com",
    phone: "+54 11 5989 7869",
    phone2: "+54 11 3889 9722",
    address: "Autonomous City of Buenos Aires, Argentina",
    quickLinks: "Quick links",
    copyrightBefore: "Copyright © {{year}} ",
    copyrightAfter: ". All rights reserved.",
    privacy: "Privacy policy",
    terms: "Terms and conditions",
    cookies: "Cookies",
  },
  legal: {
    backHome: "Back to home",
    backProjects: "Back to projects",
    contactCta: "Contact us",
    privacy: {
      metaTitle: "Privacy policy",
      metaDescription:
        "How GRG Solutions collects, uses, and protects personal data on this website and contact forms.",
      title: "Privacy policy",
      updated: "Last updated: May 2026",
      intro:
        "At GRG Solutions we respect your privacy. This policy describes what data we may process when you visit our site or contact us.",
      s1Title: "Data controller",
      s1Body:
        "The controller is GRG Solutions. You can reach us at agencygrg@gmail.com for data-related requests.",
      s2Title: "Data we collect",
      s2Body:
        "We may receive your name, email, company, and message submitted through the contact form. We also store basic technical data (for example, cookies required for language and theme preferences).",
      s3Title: "Purpose and legal basis",
      s3Body:
        "We use your data to respond to business inquiries, prepare proposals, and improve our services. The basis is your consent when submitting the form and our legitimate interest in operating the site securely.",
      s4Title: "Retention and security",
      s4Body:
        "We keep data as long as needed to handle your request and meet legal obligations. We apply reasonable measures to protect information from unauthorized access.",
      s5Title: "Your rights",
      s5Body:
        "You may request access, correction, or deletion by writing to agencygrg@gmail.com. You may also file a complaint with your local data protection authority.",
    },
    terms: {
      metaTitle: "Terms and conditions",
      metaDescription:
        "Terms of use for the GRG Solutions website and web development services.",
      title: "Terms and conditions",
      updated: "Last updated: May 2026",
      intro:
        "By accessing this site you accept these terms. If you disagree, please do not use the site.",
      s1Title: "Use of the site",
      s1Body:
        "Content is informational about our design and web development services. You may not copy, distribute, or modify materials without prior written permission.",
      s2Title: "Services and proposals",
      s2Body:
        "Descriptions on the site are not a binding offer. Scope, timelines, and fees are confirmed in proposals or contracts signed with each client.",
      s3Title: "Intellectual property",
      s3Body:
        "Brands, copy, images, and code belong to GRG Solutions or their respective owners. Client projects are published in the portfolio under prior agreement.",
      s4Title: "Limitation of liability",
      s4Body:
        "The site is provided “as is”. We do not guarantee uninterrupted availability. To the extent permitted by law, we are not liable for indirect damages from use of the site.",
      s5Title: "Governing law",
      s5Body:
        "These terms are governed by the laws of Argentina. Disputes shall be submitted to the competent courts of the City of Buenos Aires.",
    },
    cookies: {
      metaTitle: "Cookie policy",
      metaDescription:
        "Information about cookies and local storage used on the GRG Solutions website.",
      title: "Cookie policy",
      updated: "Last updated: May 2026",
      intro:
        "This site uses cookies and local storage to remember preferences and keep a consistent experience.",
      s1Title: "What cookies are",
      s1Body:
        "Cookies are small files stored by your browser. We also use localStorage for language and visual theme.",
      s2Title: "Cookies we use",
      s2Body:
        "Language preference (agencia-web-gmg-locale) and theme (site-theme). These are functional and not used for behavioral advertising.",
      s3Title: "How to manage them",
      s3Body:
        "You can delete cookies in your browser settings. If you disable them, some preferences may not persist between visits.",
      s4Title: "Updates",
      s4Body:
        "We may update this policy to reflect technical or legal changes. We will publish the revision date on this page.",
      s5Title: "Contact",
      s5Body:
        "For cookie-related questions, email agencygrg@gmail.com.",
    },
  },
  projectPage: {
    grgToolPrefix: "Tool by",
    clientLabel: "Client",
    technologiesLabel: "Technologies",
    galleryLabel: "Project gallery",
    notFoundTitle: "Project not found",
    notFoundBody: "This link does not match a published case study.",
  },
} satisfies Messages;
