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
        {dayEvents.slice(0, 2).map((event, eventIndex) => {

          const getEventStyles = (status: string) => {
            switch (status) {
              case 'SCHEDULED':
                return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
              case 'PENDING_STATUS':
                return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
              case 'CONVERTED':
                return 'bg-green-100 text-green-800 hover:bg-green-200';
              case 'NOT_CONVERTED':
                return 'bg-red-100 text-red-800 hover:bg-red-200';
              case 'CANCELLED':
                return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
              default:
                return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
            }
          };

          const getTextColor = (status: string) => {
            switch (status) {
              case 'SCHEDULED':
                return 'text-purple-600';
              case 'PENDING_STATUS':
                return 'text-yellow-600';
              case 'CONVERTED':
                return 'text-green-600';
              case 'NOT_CONVERTED':
                return 'text-red-600';
              case 'CANCELLED':
                return 'text-gray-600';
              default:
                return 'text-purple-600';
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
          <div className="text-xs text-gray-500 text-center">
            +{dayEvents.length - 2} mais
          </div>
        )}
      </div>
    </div>
  );
}
