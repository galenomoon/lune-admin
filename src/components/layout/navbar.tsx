"use client";

import React, { useContext } from "react";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavigationCommand } from "@/components/ui/navigation-command";
import { ThemeButtonToggle } from "@/components/theme-toggle-button";
import { AuthContext } from "@/contexts/auth-context";

export function Navbar() {
  const { currentUser, signOut } = useContext(AuthContext);
  const router = useRouter();

  const handleSettingsClick = () => {
    router.push("/configuracoes");
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 flex h-14 items-center">
        {/* Search bar */}
        <div className="flex flex-1 items-center space-x-2">
          <NavigationCommand />
        </div>

        {/* Right side icons */}
        <div className="flex items-center space-x-2">

          {/* Theme toggle */}
          <ThemeButtonToggle />

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSettingsClick}
            title="Configurações (⌘S)"
          >
            <Settings className="h-4 w-4" />
            <span className="sr-only">Configurações</span>
          </Button>

          {/* User profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/user-avatar.png" alt="Usuário" />
                  <AvatarFallback>{currentUser?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {currentUser?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
