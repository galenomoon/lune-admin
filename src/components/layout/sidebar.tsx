"use client";
import {
  Calendar,
  GraduationCap,
  LayoutDashboard,
  Grid2X2,
  DollarSign,
  List,
  UserStar,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  Settings,
} from "lucide-react";

import {
  Sidebar as SidebarUI,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import logoHeader from "@/assets/header-logo.svg";
import logoIcon from "@/assets/header-logo-icon.svg";

export function Sidebar() {
  const pathname = usePathname();
  const { toggleSidebar, open } = useSidebar();

  const sidebarGroups = [
    {
      label: "Principal",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      label: "Gestão",
      items: [
        {
          title: "Grade",
          url: "/grade",
          icon: Grid2X2,
        },
        {
          title: "Matrículas",
          url: "/matriculas",
          icon: GraduationCap,
        },
        {
          title: "Aulas Avulsas",
          url: "/agendamentos",
          icon: Calendar,
        },
      ],
    },
    {
      label: "Financeiro",
      items: [
        {
          title: "Planos",
          url: "/planos",
          icon: DollarSign,
        },
      ],
    },
    {
      label: "Informações",
      items: [
        {
          title: "Professores",
          url: "/professores",
          icon: UserStar,
        },

        // {
        //   title: "Turmas",
        //   url: "/turmas",
        //   icon: Users,
        // },
        {
          title: "Modalidades",
          url: "/modalidades",
          icon: List,
        },
        // {
        //   title: "Leads",
        //   url: "/leads",
        //   icon: Star,
        //   isBlocked: true,
        // },
      ],
    },
    {
      label: "Configurações",
      items: [
        {
          title: "Configurações",
          url: "/configuracoes",
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <SidebarUI collapsible="icon" variant="sidebar">
      <SidebarContent className="bg-purple-lune text-white overflow-y-auto">
        <SidebarHeader className="flex items-center gap-2 pt-6 pb-0 flex-row justify-center">
          {open ? (
            <Image src={logoHeader} alt="Logo" width={220} />
          ) : (
            <Image src={logoIcon} alt="Logo" width={220} />
          )}
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "mt-0 hover:text-yellow-500 bg-white/10 py-2 px-4 h-fit hover:bg-purple-lune transition-colors duration-300"
                  )}
                >
                  <button onClick={toggleSidebar} className="cursor-pointer">
                    {open ? <PanelLeftCloseIcon /> : <PanelLeftOpenIcon />}
                    <span>Fechar Menu</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {sidebarGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-white/60">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url;
                  const isBlocked = false;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          isBlocked ? "cursor-not-allowed !opacity-20" : "",
                          "hover:text-yellow-500 hover:bg-purple-lune transition-colors duration-300",
                          isActive &&
                            "text-yellow-500 bg-white/5 hover:text-white"
                        )}
                      >
                        {isBlocked ? (
                          <div className="cursor-not-allowed !opacity-20">
                            <item.icon />
                            <span>{item.title}</span>
                          </div>
                        ) : (
                          <a href={item.url} className="cursor-pointer">
                            <item.icon />
                            <span>{item.title}</span>
                          </a>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </SidebarUI>
  );
}
