import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CardEditor } from "@/components/editor/CardEditor";
import { editorPath } from "@/lib/site";
import { getTemplate, getTemplates } from "@/lib/templates";

type Props = PageProps<"/card-generator/editor/[template]">;

// Only the configured templates exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getTemplates().map((template) => ({ template: template.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const template = getTemplate((await params).template);
  if (!template) {
    return {};
  }

  return {
    title: `Edit ${template.title}`,
    description: template.description,
    alternates: { canonical: editorPath(template.id) },
  };
}

export default async function EditorPage({ params }: Props) {
  const template = getTemplate((await params).template);
  if (!template) {
    notFound();
  }

  return <CardEditor template={template} />;
}
