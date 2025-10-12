import { SidebarProvider } from "@/components/ui/sidebar";
import { getAllPlaygroundsForUser } from "@/modules/dashboard/actions";
import { ReactNode } from "react";
import { DashboardSidebar } from "@/modules/dashboard/components/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const playgroundData = await getAllPlaygroundsForUser();

  const iconMap: Record<string, string> = {
    REACT: "Zap",
    NEXTJS: "Lightbulb",
    EXPRESS: "Database",
    VUE: "Compass",
    NODE: "FlameIcon",
    ANGULAR: "Terminal",
  };

  const FormattedPlaygroundData = playgroundData?.map((item) => ({
    id: item.id,
    name: item.title,
    icon: iconMap[item.template] || "Code2",
    starred: item.Starmark?.[0]?.isMarked || false,
  }));

  return (
    <SidebarProvider>
      <div
        className="
          flex min-h-screen w-full
          bg-gradient-to-br from-white via-violet-50 to-fuchsia-100
          dark:from-black dark:via-zinc-900 dark:to-fuchsia-950
          transition-all duration-700 ease-in-out
        "
      >
        {/* Sidebar with soft blur & glow */}
        <div className="shadow-xl border-r border-white/30 dark:border-zinc-700/50 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl">
          {/*@ts-expect-error DashboardSidebar expects specific prop type */}
          <DashboardSidebar initialPlaygroundData={FormattedPlaygroundData} />
        </div>

        {/* Main Content Area */}
        <main
          className="
            flex-1 relative overflow-y-auto z-10
            backdrop-blur-md bg-transparent
          "
        >
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
