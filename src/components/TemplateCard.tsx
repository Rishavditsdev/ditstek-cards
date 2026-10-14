import Image from "next/image";
import Link from "next/link";
import { editorPath } from "@/lib/site";
import type { CardTemplate } from "@/types/cards";
import { ArrowIcon } from "./icons";

interface TemplateCardProps {
  template: CardTemplate;
  /** Load the preview immediately; set for cards that are visible on arrival. */
  eager?: boolean;
}

export function TemplateCard({ template, eager = false }: TemplateCardProps) {
  return (
    <article className="template-card">
      <div className="template-card-preview">
        <Image
          src={template.preview}
          alt={`${template.title} preview`}
          width={1600}
          height={900}
          loading={eager ? "eager" : "lazy"}
        />
      </div>
      <div className="template-card-body">
        <h2>{template.title}</h2>
        <p className="template-card-description">{template.description}</p>
        {/* The link's ::after stretches over the whole card, so the preview opens the editor too. */}
        <Link className="btn btn-primary template-card-link" href={editorPath(template.id)}>
          Use Template
          <ArrowIcon />
        </Link>
      </div>
    </article>
  );
}
