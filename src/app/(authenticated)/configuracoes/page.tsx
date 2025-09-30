"use client";
import React from "react";

export default function Settings() {
  return (
    <div className="w-full flex flex-col gap-4">
      <section className="flex w-full justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações do sistema
          </p>
        </div>
      </section>
    </div>
  );
}
