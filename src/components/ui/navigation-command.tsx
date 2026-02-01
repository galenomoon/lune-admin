"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Grid2X2,
  GraduationCap,
  Calendar,
  DollarSign,
  UserStar,
  List,
  Settings,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export function NavigationCommand() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleNavigation = (url: string) => {
    router.push(url);
    setOpen(false);
  };

  const commandSections = [
    {
      heading: "Principal",
      items: [
        {
          icon: <LayoutDashboard />,
          label: "Dashboard",
          shortcut: "⌘D",
          url: "/",
        },
      ],
    },
    {
      separator: true,
    },
    {
      heading: "Gestão",
      items: [
        {
          icon: <Grid2X2 />,
          label: "Grade",
          shortcut: "⌘G",
          url: "/grade",
        },
        {
          icon: <GraduationCap />,
          label: "Matrículas",
          shortcut: "⌘M",
          url: "/matriculas",
        },
        {
          icon: <Calendar />,
          label: "Aulas Avulsas",
          shortcut: "⌘A",
          url: "/agendamentos",
        },
      ],
    },
    {
      separator: true,
    },
    {
      heading: "Financeiro",
      items: [
        {
          icon: <DollarSign />,
          label: "Planos",
          shortcut: "⌘P",
          url: "/planos",
          admin_required: true
        },
      ],
    },
    {
      separator: true,
    },
    {
      heading: "Informações",
      items: [
        {
          icon: <UserStar />,
          label: "Professores",
          shortcut: "⌘F",
          url: "/professores",
          admin_required: true
        },
        {
          icon: <List />,
          label: "Modalidades",
          shortcut: "⌘O",
          url: "/modalidades",
          admin_required: true
        },
      ],
    },
    {
      separator: true,
    },
    {
      heading: "Configurações",
      items: [
        {
          icon: <Settings />,
          label: "Configurações",
          shortcut: "⌘S",
          url: "/configuracoes",
          admin_required: true
        },
      ],
    },
  ];

  return (
    <>
      <div
        className="relative flex-1 max-w-sm"
        tabIndex={0}
        role="button"
        aria-label="Abrir busca de comandos"
      >
        <div
          onClick={() => setOpen(true)}
          className={`
            flex items-center h-10 rounded-md border bg-background px-3 py-2 text-sm
            cursor-pointer transition-colors hover:bg-muted
            focus:outline-none focus:ring-2 focus:ring-ring
            w-full
          `}
        >
          <Search className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="flex-1 text-muted-foreground select-none text-left">
            Menu
          </span>
          <span className="ml-2 flex items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </span>
        </div>
        {/*
          Transformação dos comandos em um array para renderizar via map
        */}
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Digite um comando ou pesquise..." />
          <CommandList>
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            {commandSections.map((section, idx) => {
              if (section.separator) {
                return <CommandSeparator key={`separator-${idx}`} />;
              }
              return (
                <CommandGroup heading={section.heading} key={section.heading}>
                  {section.items?.map((item) => (
                    <CommandItem
                      key={item.label}
                      onSelect={() => handleNavigation(item.url)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      <CommandShortcut>{item.shortcut}</CommandShortcut>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </CommandDialog>
      </div>
    </>
  );
}
