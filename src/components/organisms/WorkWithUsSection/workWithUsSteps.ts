export type WorkWithUsStep = {
  id: string;
  number: string;
  title: string;
  text: string;
  imageSrc: string;
  imageAlt: string;
  /** image left on desktop */
  imageFirst: boolean;
};

export const WORK_WITH_US_STEPS: WorkWithUsStep[] = [
  {
    id: "paso-1",
    number: "01",
    title: "Recibimos tu idea",
    text: "Convertimos tu idea en un plan claro de diseño y desarrollo. Creamos un presupuesto y te damos un plazo de entrega.",
    imageSrc: "/work-with-us/idea.png",
    imageAlt: "Ilustración del primer paso: recibir y planificar una idea",
    imageFirst: true,
  },
  {
    id: "paso-2",
    number: "02",
    title: "Creamos tu proyecto",
    text: "Desarrollamos tu proyecto con precisión, objetivos claros y tiempos definidos para entregar una solución sólida y de calidad.",
    imageSrc: "/work-with-us/plan.png",
    imageAlt: "Ilustración del segundo paso: desarrollo del proyecto",
    imageFirst: false,
  },
  {
    id: "paso-3",
    number: "03",
    title: "Lo hacemos realidad",
    text: "Entregamos una solución terminada, cuidada en cada detalle y preparada para acompañar el crecimiento de tu negocio.",
    imageSrc: "/work-with-us/entrega.png",
    imageAlt: "Ilustración del tercer paso: entrega de la solución",
    imageFirst: true,
  },
];
