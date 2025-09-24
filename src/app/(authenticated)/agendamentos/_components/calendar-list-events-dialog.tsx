import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TrialStudent } from "@/interfaces/trial-student";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function CalendarListEventsDialog({
  events,
  date,
  isOpen,
  onOpenChange,
}: {
  events: TrialStudent[];
  date: Date;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  // um dialog que lista os events de trialclasses de um dia
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Aulas Agendadas</DialogTitle>
          <DialogDescription>
            Aulas agendadas para o dia {format(date, "dd/MM/yyyy")},
            <span className="capitalize">
              {" "}
              {format(date, "EEEE", { locale: ptBR })}
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <div key={event.id}>
              {event.lead?.firstName} {event.lead?.lastName}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
