export type JobCategory = "early-career" | "experienced" | "internship";

export const categories: { label: string; value: "all" | JobCategory }[] = [
  { label: "All", value: "all" },
  { label: "Early Career", value: "early-career" },
  { label: "Experienced", value: "experienced" },
  { label: "Internships", value: "internship" },
];

export type CareerJob = {
  id: string;
  title: string;
  category: JobCategory;
  department: string;
  location: string;
  type: string;
  experience: string;
  postedDate: string;
  summary: string;
  description: string;
  skills: string[];
};

// Illustrative roles for the frontend experience. These are not advertised vacancies.
export const jobs: CareerJob[] = [
  { id: "sys-eng-01", title: "System Engineer", category: "experienced", department: "Engineering", location: "Bengaluru, India", type: "Full-time", experience: "3–5 years", postedDate: "2026-09-01", summary: "Design reliable systems that make complex work feel simple.", description: "Work with a cross-functional team to design, build and improve dependable software systems. You would review technical tradeoffs, document decisions and support delivery from discovery through release.", skills: ["Node.js", "System design", "AWS"] },
  { id: "frontend-01", title: "Frontend Engineer", category: "early-career", department: "Engineering", location: "Bengaluru, India", type: "Full-time", experience: "0–2 years", postedDate: "2026-09-03", summary: "Turn thoughtful design into accessible digital experiences.", description: "Build responsive interfaces with a focus on performance, accessibility and maintainable code. Collaborate with designers and engineers, test your work and learn through feedback.", skills: ["React", "TypeScript", "Accessibility"] },
  { id: "data-eng-01", title: "Data Engineer", category: "experienced", department: "Data & AI", location: "Bengaluru, India", type: "Full-time", experience: "3–6 years", postedDate: "2026-09-04", summary: "Build data pipelines that teams can trust and use.", description: "Design and maintain data workflows, improve data quality and work with stakeholders to turn business questions into dependable datasets and practical solutions.", skills: ["Python", "SQL", "Data pipelines"] },
  { id: "qa-01", title: "QA Engineer", category: "early-career", department: "Quality", location: "Bengaluru, India", type: "Full-time", experience: "0–2 years", postedDate: "2026-09-05", summary: "Help teams ship with confidence through careful testing.", description: "Plan and execute meaningful tests, investigate defects and contribute to automation that improves product quality. Work closely with engineers to make quality part of the delivery process.", skills: ["Test design", "Automation", "API testing"] },
  { id: "cloud-01", title: "Cloud Engineer", category: "experienced", department: "Cloud", location: "Bengaluru, India", type: "Full-time", experience: "4–7 years", postedDate: "2026-09-06", summary: "Shape secure, resilient cloud foundations for digital products.", description: "Help plan cloud architecture, automate infrastructure and improve observability and reliability. Share clear guidance with the teams building on these platforms.", skills: ["AWS", "Terraform", "CI/CD"] },
  { id: "design-intern-01", title: "Product Design Intern", category: "internship", department: "Design", location: "Bengaluru, India", type: "Internship", experience: "Student / graduate", postedDate: "2026-09-07", summary: "Explore research, prototyping and visual design with a team.", description: "Support research, map user journeys and prototype interface ideas. Present your thinking clearly, seek feedback and contribute to practical design work.", skills: ["Figma", "User research", "Prototyping"] },
  { id: "software-intern-01", title: "Software Engineering Intern", category: "internship", department: "Engineering", location: "Bengaluru, India", type: "Internship", experience: "Student / graduate", postedDate: "2026-09-08", summary: "Grow your engineering craft through guided product work.", description: "Contribute to small, well-scoped software tasks, learn team development practices and pair with engineers to understand how production systems are built and maintained.", skills: ["JavaScript", "Git", "Problem solving"] },
  { id: "analyst-01", title: "Business Analyst", category: "early-career", department: "Consulting", location: "Bengaluru, India", type: "Full-time", experience: "1–3 years", postedDate: "2026-09-09", summary: "Connect business needs with clear, useful technology plans.", description: "Listen to stakeholders, clarify requirements and help teams define outcomes. Document workflows and make sure the delivered solution addresses the original need.", skills: ["Requirements", "Communication", "Process mapping"] },
];

export const findCareerJob = (slug: string) => jobs.find((job) =>
  job.id === slug || job.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") === slug,
);
