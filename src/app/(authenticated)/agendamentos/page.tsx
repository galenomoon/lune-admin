"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTrialStudents, getPendingTrialStudents } from "@/api/trial-student";
import CalendarTrialClasses from "./_components/calendar-trial-classes";
import { TrialStudent } from "@/interfaces/trial-student";
import { SidebarProvider } from "@/components/ui/sidebar";
import CalendarListEventsSidebar from "./_components/calendar-list-events-sidebar";
import { UpdateTrialStudentDialog } from "./_components/update-trial-student-dialog";
import { CreateTrialStudentDialog } from "./_components/create-trial-student-dialog";
import PendingTrialStudentsTable from "./_components/pending-trial-students-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AgendamentosPage() {
  const [selectedDate, setSelectedDate] = useState(null as unknown as Date);
  const [editingEvent, setEditingEvent] = useState(
    null as unknown as TrialStudent
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("calendar");

  const { data: trialResults } = useQuery({
    queryKey: ["trial-students"],
    queryFn: getTrialStudents,
  });

  const { data: pendingData } = useQuery({
    queryKey: ["pending-trial-students"],
    queryFn: getPendingTrialStudents,
  });

  const calendarEvents = trialResults?.map((trial) => ({
    ...trial,
    date: new Date(trial.date),
    id: trial.id,
    lead: trial.lead,
    gridItem: trial.gridItem,
  }));

  const pendingCount = pendingData?.count || 0;

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEventClick = (event: TrialStudent) => {
    setEditingEvent(event);
  };

  const handleCreateEvent = () => {
    setIsCreateDialogOpen(true);
  };

  return (
    <SidebarProvider defaultOpen={false} cookieName="lune-sidebar-trial-students">
      <div className="w-full flex flex-col gap-4">
        <section className="flex w-full justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Aulas Avulsas</h1>
            <p className="text-muted-foreground">
              Gerencie e agende aulas avulsas
            </p>
          </div>
        </section>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              Pendências
              {pendingCount > 0 && (
                <div className="relative">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping"></div>
                  <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-500 rounded-full"></div>
                </div>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar">
            <CalendarTrialClasses
              events={calendarEvents as unknown as TrialStudent[]}
              onDateClick={handleDateClick}
              selectedDate={selectedDate as unknown as Date}
              onEventClick={handleEventClick}
            />
          </TabsContent>
          
          <TabsContent value="pending">
            <PendingTrialStudentsTable />
          </TabsContent>
        </Tabs>
      </div>

      {/* Sidebar apenas para a tab de calendário */}
      {activeTab === "calendar" && (
        <CalendarListEventsSidebar
          events={calendarEvents as unknown as TrialStudent[]}
          date={selectedDate as unknown as Date}
          onEventClick={handleEventClick}
          onCreateEvent={handleCreateEvent}
        />
      )}

      <UpdateTrialStudentDialog
        trialStudent={editingEvent}
        onClose={() => setEditingEvent(null as unknown as TrialStudent)}
      />
      <CreateTrialStudentDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        selectedDate={selectedDate as unknown as Date}
      />
    </SidebarProvider>
  );
}
