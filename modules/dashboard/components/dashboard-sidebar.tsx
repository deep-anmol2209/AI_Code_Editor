"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Code2,
  Compass,
  FolderPlus,
  History,
  Home,
  LayoutDashboard,
  Lightbulb,
  Plus,
  Settings,
  Star,
  Terminal,
  Zap,
  Database,
  FlameIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image"

// Define the interface for a single playground item, icon is now a string
interface PlaygroundData {
  id: string
  name: string
  icon: string
  starred: boolean
}

// Map icon names (strings) to their corresponding LucideIcon components
const lucideIconMap = {
  Zap,
  Lightbulb,
  Database,
  Compass,
  FlameIcon,
  Terminal,
  Code2,
}

export function DashboardSidebar({ initialPlaygroundData }: { initialPlaygroundData: PlaygroundData[] }) {
  const pathname = usePathname()
  const [starredPlaygrounds] = useState(initialPlaygroundData.filter((p) => p.starred))
  const [recentPlaygrounds] = useState(initialPlaygroundData)

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="
        border-r border-violet-600/30
        bg-gradient-to-b from-[#0f172a]/80 via-[#1e1b4b]/80 to-[#0f172a]/80
        dark:from-[#0f172a]/80 dark:via-[#1e1b4b]/80 dark:to-[#0f172a]/80
        backdrop-blur-xl
        shadow-[0_5px_25px_rgba(139,92,246,0.3),0_0_10px_rgba(236,72,153,0.15)]
        transition-all duration-500 ease-in-out
      "
    >
      <SidebarHeader>
        <div className="flex items-center justify-center px-4 py-3">
          <Image
            src="/logo.svg"
            alt="logo"
            height={60}
            width={60}
            className="drop-shadow-[0_0_15px_rgba(236,72,153,0.4)]"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/"}
                tooltip="Home"
                className="hover:text-fuchsia-400 text-gray-200"
              >
                <Link href="/">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/dashboard"}
                tooltip="Dashboard"
                className="hover:text-fuchsia-400 text-gray-200"
              >
                <Link href="/dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Starred Playgrounds */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center text-fuchsia-400">
            <Star className="h-4 w-4 mr-2 text-yellow-400" />
            Starred
          </SidebarGroupLabel>
          <SidebarGroupAction title="Add starred playground">
            <Plus className="h-4 w-4 text-gray-300 hover:text-fuchsia-400 transition-colors" />
          </SidebarGroupAction>

          <SidebarGroupContent>
            <SidebarMenu>
              {starredPlaygrounds.length === 0 ? (
                <div className="text-center text-gray-400 py-4 w-full">
                  Create your playground
                </div>
              ) : (
                starredPlaygrounds.map((playground) => {
                  const IconComponent = lucideIconMap[playground.icon as keyof typeof lucideIconMap] || Code2
                  return (
                    <SidebarMenuItem key={playground.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === `/playground/${playground.id}`}
                        tooltip={playground.name}
                        className="hover:text-fuchsia-400 text-gray-200"
                      >
                        <Link href={`/playground/${playground.id}`}>
                          <IconComponent className="h-4 w-4" />
                          <span>{playground.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Recent Playgrounds */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center text-fuchsia-400">
            <History className="h-4 w-4 mr-2 text-amber-400" />
            Recent
          </SidebarGroupLabel>
          <SidebarGroupAction title="Create new playground">
            <FolderPlus className="h-4 w-4 text-gray-300 hover:text-fuchsia-400 transition-colors" />
          </SidebarGroupAction>

          <SidebarGroupContent>
            <SidebarMenu>
              {recentPlaygrounds.map((playground) => {
                const IconComponent = lucideIconMap[playground.icon as keyof typeof lucideIconMap] || Code2
                return (
                  <SidebarMenuItem key={playground.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === `/playground/${playground.id}`}
                      tooltip={playground.name}
                      className="hover:text-fuchsia-400 text-gray-200"
                    >
                      <Link href={`/playground/${playground.id}`}>
                        <IconComponent className="h-4 w-4" />
                        <span>{playground.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="View all">
                  <Link
                    href="/playgrounds"
                    className="text-sm text-gray-400 hover:text-fuchsia-400 transition-colors"
                  >
                    View all playgrounds
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Settings"
              className="hover:text-fuchsia-400 text-gray-200"
            >
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
