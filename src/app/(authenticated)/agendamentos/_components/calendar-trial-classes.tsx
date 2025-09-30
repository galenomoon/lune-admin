import React, { useState, useMemo } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TrialStudent } from "@/interfaces/trial-student";
import CalendarTrialClassDate from "./calendar-trial-class-date";

export default function Calendar({
  events = [],
  onDateClick,
  selectedDate,
  onEventClick,
}: {
  events: TrialStudent[];
  onDateClick: (date: Date) => void;
  selectedDate: Date;
  onEventClick: (event: TrialStudent) => void;
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Navegar entre meses
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Voltar para o mês atual
  const goToToday = () => setCurrentMonth(new Date());

  // Gerar dias do mês
  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });

    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  // Agrupar dias por semana
  const weeks = useMemo(() => {
    const weeks = [];
    for (let i = 0; i < monthDays.length; i += 7) {
      weeks.push(monthDays.slice(i, i + 7));
    }
    return weeks;
  }, [monthDays]);

  // Nomes dos dias da semana
  const dayNames = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
      {/* Header do Calendário */}
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-2 md:gap-4">
          <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
            {format(currentMonth, "MMMM 'de' yyyy", { locale: ptBR })}
          </h2>
          <button
            onClick={goToToday}
            className="px-2 md:px-3 py-1 text-xs md:text-sm font-medium text-purple-600 dark:text-yellow-400 bg-purple-50 dark:bg-zinc-800 rounded-lg hover:bg-purple-100 dark:hover:bg-zinc-700 transition-colors"
          >
            Hoje
          </button>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={prevMonth}
            className="p-1 md:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronLeft size={18} className="md:w-5 md:h-5 text-gray-700 dark:text-zinc-200" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1 md:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronRight size={18} className="md:w-5 md:h-5 text-gray-700 dark:text-zinc-200" />
          </button>
        </div>
      </div>

      {/* Nomes dos dias da semana */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-zinc-700">
        {dayNames.map((dayName, index) => {
          const isSunday = dayName === "DOM";
          return (
            <div
              key={index}
              className={`p-2 md:p-3 text-center text-xs md:text-sm font-semibold text-gray-600 dark:text-zinc-300 bg-gray-50 dark:bg-zinc-800 ${
                isSunday
                  ? "bg-gray-100 dark:bg-zinc-900 text-red-500 dark:text-red-400"
                  : ""
              }`}
            >
              {dayName}
            </div>
          );
        })}
      </div>

      {/* Grade do calendário */}
      <div className="grid grid-cols-7 bg-white dark:bg-zinc-900">
        {weeks.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {week.map((day, dayIndex) => {
              return (
                <CalendarTrialClassDate
                  key={dayIndex}
                  day={day}
                  currentMonth={currentMonth}
                  selectedDate={selectedDate}
                  events={events}
                  onDateClick={onDateClick}
                  onEventClick={onEventClick}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
