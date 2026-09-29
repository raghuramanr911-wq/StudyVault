export type Subject = {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  accentColor: string;
};

export type Document = {
  id: string;
  name: string;
  subjectId: string;
  categoryId: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
  uploadedAt: string;
  updatedAt: string;
  unit: string;
  topic: string;
  tags: string[];
  description: string;
  favorite: boolean;
  lastOpenedAt: string | null;
  storagePath?: string;
  progress?: number;
  pages?: number;
};

export type Category = {
  id: string;
  name: string;
};

export const subjects: Subject[] = [
  {
    id: "sub-1",
    name: "Artificial Intelligence",
    slug: "artificial-intelligence",
    description: "Notes, question papers and study materials",
    iconName: "BrainCircuit",
    accentColor: "blue",
  },
  {
    id: "sub-2",
    name: "Object-Oriented Programming",
    slug: "oops",
    description: "Java, C++, and object concepts",
    iconName: "Code2",
    accentColor: "violet",
  },
  {
    id: "sub-3",
    name: "Data Structures",
    slug: "data-structures",
    description: "Trees, graphs, and algorithmic materials",
    iconName: "Network",
    accentColor: "teal",
  },
  {
    id: "sub-4",
    name: "Discrete Mathematics",
    slug: "discrete-mathematics",
    description: "Logic, set theory, and combinatorics",
    iconName: "Calculator",
    accentColor: "indigo",
  },
  {
    id: "sub-5",
    name: "DPCO",
    slug: "dpco",
    description: "Digital principles and computer organization",
    iconName: "Cpu",
    accentColor: "amber",
  },
  {
    id: "sub-6",
    name: "Environmental Science",
    slug: "environmental-science",
    description: "Ecology, sustainability, and environmental studies",
    iconName: "Leaf",
    accentColor: "green",
  },
];

export const categories: Category[] = [
  { id: "cat-1", name: "Notes" },
  { id: "cat-2", name: "Question Papers" },
  { id: "cat-3", name: "Important Questions" },
  { id: "cat-4", name: "Study Materials" },
  { id: "cat-5", name: "Assignments" },
  { id: "cat-6", name: "Practical / Lab" },
  { id: "cat-7", name: "Other Documents" },
];
