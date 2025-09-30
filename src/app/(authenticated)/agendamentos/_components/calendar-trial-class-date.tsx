"use client";
import React from "react";
import { TrialStudent } from "@/interfaces/trial-student";
import { format, isSameDay, isSameMonth, isToday } from "date-fns";
import { useSidebar } from "@/components/ui/sidebar";

const getEventsForDate = (events: TrialStudent[], date: Date) => {
  return events.filter((event) => isSameDay(new Date(event.date), date));
};

const formatTime = (timeString: string) => {
  if (!timeString) return "";
  return timeString.substring(0, 5);
};

export default function CalendarTrialClassDate({
  day,
  currentMonth,
  selectedDate,
  events,
  onDateClick,
  onEventClick,
}: {
  day: Date;
  currentMonth: Date;
  selectedDate: Date;
  events: TrialStudent[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: TrialStudent) => void;
}) {
  const dayEvents = getEventsForDate(events, day);
  const isCurrentMonth = isSameMonth(day, currentMonth);
  const isSelected = selectedDate && isSameDay(day, selectedDate);
  const isCurrentDay = isToday(day);
  const { toggleSidebar, open } = useSidebar();

  return (
    <div
      className={`
        min-h-[80px] md:min-h-[120px] p-1 md:p-2 border-r border-b 
        border-gray-200 dark:border-zinc-700 cursor-pointer transition-colors
        ${
          !isCurrentMonth
            ? "bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-600"
            : "bg-white hover:bg-gray-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-100"
        }
        ${isSelected ? "bg-purple-50 border-purple-300 dark:bg-purple-950 dark:border-purple-800" : ""}
        ${isCurrentDay ? "bg-blue-50 dark:bg-blue-950" : ""}
      `}
      onClick={() => {
        onDateClick(day);
        if (!open) {
          toggleSidebar();
        }
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <span
          className={`
            text-xs md:text-sm font-medium
            ${isCurrentDay ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-zinc-100"}
            ${!isCurrentMonth ? "text-gray-400 dark:text-zinc-600" : ""}
          `}
        >
          {format(day, "d")}
        </span>
        {isCurrentDay && (
          <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
        )}
      </div>

      <div className="space-y-0.5 md:space-y-1">
        {dayEvents.slice(0, 2).map((event, eventIndex) => {
          const getEventStyles = (status: string) => {
            switch (status) {
              case 'SCHEDULED':
                return 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-950 dark:text-purple-200 dark:hover:bg-purple-900';
              case 'PENDING_STATUS':
                return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-950 dark:text-yellow-200 dark:hover:bg-yellow-900';
              case 'CONVERTED':
                return 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-950 dark:text-green-200 dark:hover:bg-green-900';
              case 'NOT_CONVERTED':
                return 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-950 dark:text-red-200 dark:hover:bg-red-900';
              case 'CANCELLED':
                return 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700';
              default:
                return 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-950 dark:text-purple-200 dark:hover:bg-purple-900';
            }
          };

          const getTextColor = (status: string) => {
            switch (status) {
              case 'SCHEDULED':
                return 'text-purple-600 dark:text-purple-300';
              case 'PENDING_STATUS':
                return 'text-yellow-600 dark:text-yellow-300';
              case 'CONVERTED':
                return 'text-green-600 dark:text-green-300';
              case 'NOT_CONVERTED':
                return 'text-red-600 dark:text-red-300';
              case 'CANCELLED':
                return 'text-gray-600 dark:text-zinc-400';
              default:
                return 'text-purple-600 dark:text-purple-300';
            }
          };

          return (
            <button
              key={eventIndex}
              className={`text-xs p-1 w-full rounded cursor-pointer transition-colors ${getEventStyles(event.trialStatus || 'SCHEDULED')}`}
              onClick={(e) => {
                e.stopPropagation();
                onEventClick(event);
              }}
            >
              <div className="font-medium truncate">
                {event.lead?.firstName} {event.lead?.lastName}
              </div>
              <div className={`text-xs ${getTextColor(event.trialStatus || 'SCHEDULED')}`}>
                {formatTime(event?.gridItem?.startTime || "")} -{" "}
                {event.gridItem?.class?.modality?.name}
              </div>
            </button>
          );
        })}

        {dayEvents.length > 2 && (
          <div className="text-xs text-gray-500 dark:text-zinc-400 text-center">
            +{dayEvents.length - 2} mais
          </div>
        )}
      </div>
    </div>
  );
}
