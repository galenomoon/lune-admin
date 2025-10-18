import React, { useMemo } from "react";

import { TrialStudent } from "@/interfaces/trial-student";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, X, Plus, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function CalendarListEventsSidebar({
  events = [],
  date,
  onEventClick,
  onCreateEvent,
}: {
  events: TrialStudent[];
  date: Date;
  onEventClick: (event: TrialStudent) => void;
  onCreateEvent?: () => void;
}) {
  const dayEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate.toDateString() === date?.toDateString();
  });

  // Agrupar eventos por classe
  const groupedEvents = useMemo(() => {
    const groups: Record<string, TrialStudent[]> = {};
    
    dayEvents.forEach((event) => {
      const classId = event.gridItem?.class?.id || 'sem-classe';
      if (!groups[classId]) {
        groups[classId] = [];
      }
      groups[classId].push(event);
    });
    
    return groups;
  }, [dayEvents]);

  return (
    <Sidebar collapsible="offcanvas" side="right" variant="sidebar">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup className="flex flex-row justify-between items-center">
          <SidebarGroupLabel className="text-lg items-start capitalize flex flex-col gap-0">
            <CardTitle>
              {format(date, "dd 'de' MMMM", { locale: ptBR })}
            </CardTitle>
            <CardDescription>
              {format(date, "EEEE", { locale: ptBR })}
            </CardDescription>
          </SidebarGroupLabel>
          <SidebarTrigger Icon={X} />
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <Button className="w-full" onClick={onCreateEvent}>
              <Plus className="w-4 h-4" />
              Novo Agendamento
            </Button>

            {Object.entries(groupedEvents).map(([classId, classEvents], index) => {
              const firstEvent = classEvents[0];
              const modality = firstEvent?.gridItem?.class?.modality?.name;
              const classLevel = firstEvent?.gridItem?.class?.classLevel?.name;
              const classDescription = firstEvent?.gridItem?.class?.description;

              return (
                <div key={classId} className="flex flex-col gap-2">
                  {index > 0 && <SidebarSeparator className="my-2" />}
                  
                  <div className="px-2 py-1">
                    <p className="text-sm font-semibold text-muted-foreground capitalize">
                      {modality} {classLevel && `• ${classDescription}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {classEvents.length} {classEvents.length === 1 ? 'agendamento' : 'agendamentos'}
                    </p>
                  </div>

                  {classEvents.map((event) => (
                    <EventItem
                      key={event.id}
                      event={event}
                      onEventClick={onEventClick}
                    />
                  ))}
                </div>
              );
            })}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

export const EventItem = ({
  event,
  onEventClick,
}: {
  event: TrialStudent;
  onEventClick: (event: TrialStudent) => void;
}) => {
  const { startTime, endTime, modality, classLevel, lead, classDescription } = useMemo(() => {
    return {
      startTime: event?.gridItem?.startTime,
      endTime: event?.gridItem?.endTime,
      modality: event?.gridItem?.class?.modality?.name,
      classLevel: event?.gridItem?.class?.classLevel?.name,
      classDescription: event?.gridItem?.class?.description,
      lead: event?.lead,
    };
  }, [event]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-purple-500';
      case 'PENDING_STATUS':
        return 'bg-yellow-500';
      case 'CONVERTED':
        return 'bg-green-500';
      case 'NOT_CONVERTED':
        return 'bg-red-500';
      case 'CANCELLED':
        return 'bg-gray-500';
      default:
        return 'bg-purple-500';
    }
  };

  return (
    <Card
      key={event.id}
      className="flex flex-row w-full justify-between gap-2 pl-0 pr-4 py-2 cursor-pointer transition-colors duration-200"
      onClick={() => onEventClick(event)}
    >
      <section className="flex flex-col gap-1 w-full px-3">
        <CardHeader className="flex items-center px-0">
          <div className={`w-2 h-2 ${getStatusColor(event.trialStatus || 'SCHEDULED')} rounded-full`} />
          <CardTitle className="capitalize text-sm">
            {lead?.firstName} {lead?.lastName.split(' ')[1]}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 flex-col">
          <CardDescription className="text-xs capitalize flex-row flex items-center gap-2">
            <User className="w-3 h-3" />
            {modality} {classLevel && `• ${classDescription}`}
          </CardDescription>
          <CardDescription className="text-xs capitalize flex-row flex items-center gap-2">
            <Clock className="w-3 h-3" />
            {startTime} - {endTime}
          </CardDescription>
        </CardContent>
      </section>
    </Card>
  );
};
