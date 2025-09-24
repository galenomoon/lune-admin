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
      min-h-[80px] md:min-h-[120px] p-1 md:p-2 border-r border-b border-gray-200 cursor-pointer transition-colors
      ${
        !isCurrentMonth
          ? "bg-gray-100 text-gray-400"
          : "bg-white hover:bg-gray-50"
      }
      ${isSelected ? "bg-purple-50 border-purple-300" : ""}
      ${isCurrentDay ? "bg-blue-50" : ""}
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
        ${isCurrentDay ? "text-blue-600" : "text-gray-900"}
        ${!isCurrentMonth ? "text-gray-400" : ""}
      `}
        >
          {format(day, "d")}
        </span>
        {isCurrentDay && (
          <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-600 rounded-full"></span>
        )}
      </div>

      <div className="space-y-0.5 md:space-y-1">
        {dayEvents.slice(0, 2).map((event, eventIndex) => (
          <button
            key={eventIndex}
            className="text-xs p-1 w-full rounded bg-purple-100 text-purple-800 cursor-pointer hover:bg-purple-200 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onEventClick(event);
            }}
          >
            <div className="font-medium truncate">
              {event.lead?.firstName} {event.lead?.lastName}
            </div>
            <div className="text-purple-600 text-xs">
              {formatTime(event?.gridItem?.startTime || "")} -{" "}
              {event.gridItem?.class?.modality?.name}
            </div>
          </button>
        ))}

        {dayEvents.length > 2 && (
          <div className="text-xs text-gray-500 text-center">
            +{dayEvents.length - 2} mais
          </div>
        )}
      </div>
    </div>
  );
}
