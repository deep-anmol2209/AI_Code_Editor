"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  ChevronRight,
  Search,
  Star,
  Code,
  Server,
  Globe,
  Zap,
  Clock,
  Check,
  Plus,
} from "lucide-react";
import Image from "next/image";

type TemplateSelectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
    description?: string;
  }) => void;
};

interface TemplateOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  popularity: number;
  tags: string[];
  features: string[];
  category: "frontend" | "backend" | "fullstack";
}

const templates: TemplateOption[] = [
  {
    id: "react",
    name: "React",
    description:
      "A JavaScript library for building user interfaces with component-based architecture",
    icon: "/react.svg",
    color: "#61DAFB",
    popularity: 5,
    tags: ["UI", "Frontend", "JavaScript"],
    features: ["Component-Based", "Virtual DOM", "JSX Support"],
    category: "frontend",
  },
  {
    id: "nextjs",
    name: "Next.js",
    description:
      "The React framework for production with server-side rendering and static site generation",
    icon: "/next.svg",
    color: "#000000",
    popularity: 4,
    tags: ["React", "SSR", "Fullstack"],
    features: ["Server Components", "API Routes", "File-based Routing"],
    category: "fullstack",
  },
  {
    id: "express",
    name: "Express",
    description:
      "Fast, unopinionated, minimalist web framework for Node.js to build APIs and web applications",
    icon: "/Express.svg",
    color: "#000000",
    popularity: 4,
    tags: ["Node.js", "API", "Backend"],
    features: ["Middleware", "Routing", "HTTP Utilities"],
    category: "backend",
  },
  {
    id: "vue",
    name: "Vue.js",
    description:
      "Progressive JavaScript framework for building user interfaces with an approachable learning curve",
    icon: "/vue.svg",
    color: "#4FC08D",
    popularity: 4,
    tags: ["UI", "Frontend", "JavaScript"],
    features: ["Reactive Data Binding", "Component System", "Virtual DOM"],
    category: "frontend",
  },
  {
    id: "hono",
    name: "Hono",
    description:
      "Fast, lightweight, built on Web Standards. Support for any JavaScript runtime.",
    icon: "/hono.svg",
    color: "#e36002",
    popularity: 3,
    tags: ["Node.js", "TypeScript", "Backend"],
    features: [
      "Dependency Injection",
      "TypeScript Support",
      "Modular Architecture",
    ],
    category: "backend",
  },
  {
    id: "angular",
    name: "Angular",
    description:
      "Angular is a web framework that empowers developers to build fast, reliable applications.",
    icon: "/Angular.svg",
    color: "#DD0031",
    popularity: 3,
    tags: ["React", "Fullstack", "JavaScript"],
    features: [
      "Reactive Data Binding",
      "Component System",
      "Virtual DOM",
      "Dependency Injection",
      "TypeScript Support",
    ],
    category: "fullstack",
  },
];

const TemplateSelectionModal = ({
  isOpen,
  onClose,
  onSubmit,
}: TemplateSelectionModalProps) => {
  const [step, setStep] = useState<"select" | "configure">("select");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<
    "all" | "frontend" | "backend" | "fullstack"
  >("all");
  const [projectName, setProjectName] = useState("");

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchCategory = category === "all" || template.category === category;
    return matchCategory && matchesSearch;
  });

  const handleContinue = () => selectedTemplate && setStep("configure");
  const handleBack = () => setStep("select");

  const handleCreateProject = () => {
    if (!selectedTemplate) return;

    const map: Record<string, any> = {
      react: "REACT",
      nextjs: "NEXTJS",
      express: "EXPRESS",
      vue: "VUE",
      hono: "HONO",
      angular: "ANGULAR",
    };

    const template = templates.find((t) => t.id === selectedTemplate);
    if (template) {
      onSubmit({
        title: projectName,
        template: map[template.id],
        description: template.description,
      });
    }
    onClose();
    setStep("select");
    setSelectedTemplate(null);
    setProjectName("");
  };

  const renderStars = (count: number) =>
    Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < count ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }
        />
      ));

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          setStep("select");
          setSelectedTemplate(null);
          setProjectName("");
        }
      }}
    >
      <DialogContent className="sm:max-w-[850px] max-h-[90vh] overflow-y-auto bg-gradient-to-b from-white to-gray-50 dark:from-[#0e0e0e] dark:to-black border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl transition-all">
        {step === "select" ? (
          <>
            <DialogHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-[#E93F3F]">
                <Plus className="text-[#E93F3F]" size={22} />
                Create New Project
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Select a template to start building your playground
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-6 py-5">
              {/* Search + Tabs */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-1/2">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 shadow-sm focus:ring-2 focus:ring-[#E93F3F]"
                  />
                </div>

                <Tabs
                  defaultValue="all"
                  className="w-full sm:w-auto"
                  onValueChange={(value) => setCategory(value as any)}
                >
                  <TabsList className="grid grid-cols-4 sm:w-[420px]">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="frontend">Frontend</TabsTrigger>
                    <TabsTrigger value="backend">Backend</TabsTrigger>
                    <TabsTrigger value="fullstack">Fullstack</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Templates */}
              <RadioGroup
                value={selectedTemplate || ""}
                onValueChange={(v) => setSelectedTemplate(v)}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredTemplates.length ? (
                    filteredTemplates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`relative p-5 rounded-xl border transition-all cursor-pointer bg-white/70 dark:bg-zinc-900 hover:shadow-md hover:scale-[1.01]
                          ${
                            selectedTemplate === template.id
                              ? "border-[#E93F3F] shadow-[0_0_10px_rgba(233,63,63,0.25)]"
                              : "border-gray-200 dark:border-gray-800"
                          }`}
                      >
                        {selectedTemplate === template.id && (
                          <div className="absolute top-3 left-3 bg-[#E93F3F] text-white rounded-full p-1 shadow-sm">
                            <Check size={14} />
                          </div>
                        )}

                        <div className="absolute top-3 right-3 flex gap-1">
                          {renderStars(template.popularity)}
                        </div>

                        <div className="flex gap-4">
                          <div
                            className="w-16 h-16 flex items-center justify-center rounded-full"
                            style={{
                              backgroundColor: `${template.color}22`,
                            }}
                          >
                            <Image
                              src={template.icon}
                              alt={template.name}
                              width={40}
                              height={40}
                              className="object-contain"
                            />
                          </div>
                          <div className="flex flex-col">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                              {template.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {template.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-auto">
                              {template.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs px-2 py-1 rounded-full border bg-gray-50 dark:bg-zinc-800"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <RadioGroupItem
                          value={template.id}
                          id={template.id}
                          className="sr-only"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 flex flex-col items-center justify-center py-12 text-center">
                      <Search size={48} className="text-gray-300 mb-3" />
                      <h3 className="text-lg font-medium">No templates found</h3>
                      <p className="text-sm text-muted-foreground">
                        Try changing your search or filters.
                      </p>
                    </div>
                  )}
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-between items-center pt-5 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock size={14} className="mr-1" />
                {selectedTemplate
                  ? "Estimated setup time: 2–5 minutes"
                  : "Select a template to continue"}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  disabled={!selectedTemplate}
                  onClick={handleContinue}
                  className="bg-[#E93F3F] hover:bg-[#d73636] text-white shadow-sm"
                >
                  Continue <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
              <DialogTitle className="text-2xl font-bold text-[#E93F3F]">
                Configure Your Project
              </DialogTitle>
              <DialogDescription>
                Customize your{" "}
                {
                  templates.find((t) => t.id === selectedTemplate)?.name
                }{" "}
                setup
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-6 py-5">
              <div>
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  placeholder="my-awesome-project"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="mt-1 shadow-sm focus:ring-2 focus:ring-[#E93F3F]"
                />
              </div>

              <div className="p-5 border border-[#E93F3F]/30 rounded-lg bg-[#fff8f8] dark:bg-zinc-900">
                <h3 className="font-semibold mb-3 text-[#E93F3F]">
                  Template Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {templates
                    .find((t) => t.id === selectedTemplate)
                    ?.features.map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <Zap size={14} className="text-[#E93F3F]" />
                        <span className="text-sm">{f}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button
                onClick={handleCreateProject}
                className="bg-[#E93F3F] hover:bg-[#d73636] text-white"
              >
                Create Project
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSelectionModal;
