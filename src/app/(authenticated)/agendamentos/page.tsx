"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTrialStudents } from "@/api/trial-student";
import CalendarTrialClasses from "./_components/calendar-trial-classes";
import { TrialStudent } from "@/interfaces/trial-student";
import { SidebarProvider } from "@/components/ui/sidebar";
import CalendarListEventsSidebar from "./_components/calendar-list-events-sidebar";
import { UpdateTrialStudentDialog } from "./_components/update-trial-student-dialog";

export default function AgendamentosPage() {
  const [selectedDate, setSelectedDate] = useState(null as unknown as Date);
  const [editingEvent, setEditingEvent] = useState(
    null as unknown as TrialStudent
  );

  const { data: trialResults } = useQuery({
    queryKey: ["trial-students"],
    queryFn: getTrialStudents,
  });

  const calendarEvents = trialResults?.map((trial) => ({
    ...trial,
    date: new Date(trial.date),
    id: trial.id,
    lead: trial.lead,
    gridItem: trial.gridItem,
  }));

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEventClick = (event: TrialStudent) => {
    setEditingEvent(event);
  };

  return (
    <SidebarProvider>
      <div className="w-full flex flex-col gap-4">
        <section className="flex w-full justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Aulas Avulsas</h1>
            <p className="text-muted-foreground">
              Gerencie e agende aulas avulsas
            </p>
          </div>
        </section>
        <CalendarTrialClasses
          events={calendarEvents as unknown as TrialStudent[]}
          onDateClick={handleDateClick}
          selectedDate={selectedDate as unknown as Date}
          onEventClick={handleEventClick}
        />
      </div>
      <CalendarListEventsSidebar
        events={calendarEvents as unknown as TrialStudent[]}
        date={selectedDate as unknown as Date}
        onEventClick={handleEventClick}
      />
      <UpdateTrialStudentDialog
        trialStudent={editingEvent}
        onClose={() => setEditingEvent(null as unknown as TrialStudent)}
      />
    </SidebarProvider>
  );
}
