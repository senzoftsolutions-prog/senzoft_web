import { Braces, Cloud, Database, GitBranch, Layers3 } from "lucide-react";
const technologies = [
  { name: "React", Icon: Braces },
  { name: "TypeScript", Icon: Braces },
  { name: "Python", Icon: Braces },
  { name: "Cloud platforms", Icon: Cloud },
  { name: "Data engineering", Icon: Database },
  { name: "DevSecOps", Icon: GitBranch },
  { name: "API ecosystems", Icon: Layers3 },
];
export function TechnologyRibbon() {
  return (
    <section
      className="technology-section"
      aria-label="Technology capabilities"
    >
      <div className="container-shell">
        <p className="micro-label text-center">
          Built on modern foundations. Selected for your context.
        </p>
      </div>
      <div className="technology-mask">
        <div className="technology-track">
          {[0, 1].map((copy) => (
            <div
              className="technology-group"
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
            >
              {technologies.map(({ name, Icon }) => (
                <span key={name}>
                  <Icon size={21} />
                  {name}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
