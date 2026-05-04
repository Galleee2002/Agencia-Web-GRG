export const HERO_TOOLS = [
  { name: "React", src: "/icons/react-svgrepo-com.svg" },
  { name: "Next.js", src: "/icons/nextjs-fill-svgrepo-com.svg" },
  { name: "TypeScript", src: "/icons/typescript-svgrepo-com.svg" },
  { name: "JavaScript", src: "/icons/javascript-155-svgrepo-com.svg" },
  { name: "Tailwind CSS", src: "/icons/tailwind-svgrepo-com.svg" },
  { name: "Prisma", src: "/icons/prisma-svgrepo-com.svg" },
] as const;

export type HeroTool = (typeof HERO_TOOLS)[number];
