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
            Pesquisar
          </span>
          <span className="ml-2 flex items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </span>
        </div>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Digite um comando ou pesquise..." />
          <CommandList>
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

            <CommandGroup heading="Principal">
              <CommandItem onSelect={() => handleNavigation("/")}>
                <LayoutDashboard />
                <span>Dashboard</span>
                <CommandShortcut>⌘D</CommandShortcut>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Gestão">
              <CommandItem onSelect={() => handleNavigation("/grade")}>
                <Grid2X2 />
                <span>Grade</span>
                <CommandShortcut>⌘G</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => handleNavigation("/matriculas")}>
                <GraduationCap />
                <span>Matrículas</span>
                <CommandShortcut>⌘M</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => handleNavigation("/agendamentos")}>
                <Calendar />
                <span>Aulas Avulsas</span>
                <CommandShortcut>⌘A</CommandShortcut>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Financeiro">
              <CommandItem onSelect={() => handleNavigation("/planos")}>
                <DollarSign />
                <span>Planos</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Informações">
              <CommandItem onSelect={() => handleNavigation("/professores")}>
                <UserStar />
                <span>Professores</span>
                <CommandShortcut>⌘F</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => handleNavigation("/modalidades")}>
                <List />
                <span>Modalidades</span>
                <CommandShortcut>⌘O</CommandShortcut>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Configurações">
              <CommandItem onSelect={() => handleNavigation("/configuracoes")}>
                <Settings />
                <span>Configurações</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
    </>
  );
}
