import type { CardCategory, CardTemplate } from "@/types/cards";

/** Placeholder photo used by every image field until the user uploads one. */
export const DEFAULT_USER_IMAGE = "/assets/images/default-user.svg";

const WORK_ANNIVERSARY_IMAGES = "/assets/images/templates/work-anniversary";

export const cardCategories = [
  {
    name: "Birthdays",
    slug: "birthday",
    description:
      "Thoughtful birthday cards for celebrating people across your organisation.",
  },
  {
    name: "Work Anniversaries",
    slug: "work-anniversary",
    description:
      "Recognise dedication, growth, and the milestones that shape every career journey.",
  },
  {
    name: "Wedding Anniversaries",
    slug: "wedding-anniversary",
    description:
      "Elegant anniversary greetings for celebrating lasting partnership and togetherness.",
  },
] as const satisfies readonly CardCategory[];

/**
 * To add a template: add its images under `public/assets/images/templates/{category}/`,
 * add an entry here, then create a matching card component and register it in
 * `components/cards/index.ts` (the registry is typed against these ids).
 */
export const cardTemplates = [
  {
    id: "work-anniversary",
    title: "Work Anniversary",
    category: "work-anniversary",
    description:
      "A polished way to recognise dedication, growth, and another meaningful year with the team.",
    preview: `${WORK_ANNIVERSARY_IMAGES}/work-anniversary.svg`,
    fields: [
      {
        key: "sub_content",
        label: "Message",
        type: "textarea",
        default:
          "Congratulations on completing 1 year with us. As a graphic designer, you have brought creativity and a fresh visual perspective to your work. Your approach reflects a good sense of design and attention to detail, adding value to the overall output. Over this time, you have shown a willingness to learn and refine your skills with consistency. Your contributions continue to shape the visual identity in meaningful ways. We truly appreciate your efforts and look forward to your continued growth and many more creative milestones ahead.",
      },
      { key: "name", label: "Name", type: "text", default: "AKASH KUMAR" },
      {
        key: "designation",
        label: "Job Title",
        type: "text",
        default: "Graphic Designer",
      },
      { key: "date", label: "Date", type: "text", default: "2nd May" },
      {
        key: "main_image",
        label: "Anniversary Year",
        type: "select",
        default: `${WORK_ANNIVERSARY_IMAGES}/first-work-anniversary.svg`,
        options: [
          { value: `${WORK_ANNIVERSARY_IMAGES}/first-work-anniversary.svg`, label: "1st Work Anniversary" },
          { value: `${WORK_ANNIVERSARY_IMAGES}/second-work-anniversary.svg`, label: "2nd Work Anniversary" },
          { value: `${WORK_ANNIVERSARY_IMAGES}/third-work-anniversary.svg`, label: "3rd Work Anniversary" },
          { value: `${WORK_ANNIVERSARY_IMAGES}/fourth-work-anniversary.svg`, label: "4th Work Anniversary" },
          { value: `${WORK_ANNIVERSARY_IMAGES}/fifth-work-anniversary.svg`, label: "5th Work Anniversary" },
          { value: `${WORK_ANNIVERSARY_IMAGES}/sixth-work-anniversary.svg`, label: "6th Work Anniversary" },
          { value: `${WORK_ANNIVERSARY_IMAGES}/seventh-work-anniversary.svg`, label: "7th Work Anniversary" },
          { value: `${WORK_ANNIVERSARY_IMAGES}/eighth-work-anniversary.svg`, label: "8th Work Anniversary" },
          { value: `${WORK_ANNIVERSARY_IMAGES}/ninth-work-anniversary.svg`, label: "9th Work Anniversary" },
        ],
      },
      {
        key: "profile_image",
        label: "Profile Image",
        type: "image",
        default: DEFAULT_USER_IMAGE,
      },
    ],
  },
  {
    id: "birthday",
    title: "Birthday Celebration",
    category: "birthday",
    description:
      "A warm, personal design for celebrating a colleague and making their day feel special.",
    preview: "/assets/images/templates/birthday/birthday-card.svg",
    fields: [
      { key: "name", label: "Name", type: "text", default: "" },
      { key: "date", label: "Date", type: "text", default: "" },
      { key: "main_image", label: "Image", type: "image", default: DEFAULT_USER_IMAGE },
    ],
  },
  {
    id: "wedding-anniversary",
    title: "Wedding Anniversary",
    category: "wedding-anniversary",
    description:
      "An elegant layout for sharing heartfelt wishes and celebrating a lasting partnership.",
    preview: "/assets/images/templates/wedding-anniversary/wedding-anniversary.svg",
    fields: [
      { key: "male_name", label: "Male Name", type: "text", default: "Rahul" },
      { key: "female_name", label: "Female Name", type: "text", default: "Neha" },
      { key: "date", label: "Date", type: "text", default: "12th August" },
      {
        key: "wish",
        label: "Anniversary Message",
        type: "textarea",
        default:
          "Wishing you both a beautiful anniversary filled with cherished memories, lasting happiness, and many more wonderful years together.",
      },
      {
        key: "profile_image",
        label: "Couple Image",
        type: "image",
        default: DEFAULT_USER_IMAGE,
      },
    ],
  },
] as const satisfies readonly CardTemplate[];

/** A template as configured above; its `id` is one of the known `TemplateId` literals. */
export type TemplateConfig = (typeof cardTemplates)[number];

export type TemplateId = TemplateConfig["id"];
