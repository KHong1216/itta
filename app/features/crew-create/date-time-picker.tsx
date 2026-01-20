"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
}

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * ✅ KST(yyyy-mm-dd + HH:mm)을 "로컬 datetime-local 문자열"로 변환
 * - 핵심: KST 시간을 UTC timestamp로 만든 뒤, 그 순간을 로컬로 표시
 */
function convertKSTToLocal(date: Date, time: string): string {
  const [hours, minutes] = time.split(":").map(Number);

  // KST = UTC+9 → UTC로 바꾸려면 hours에서 9를 빼서 Date.UTC에 넣는다
  const utcMs = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours - 9,
    minutes,
    0,
    0
  );

  const local = new Date(utcMs);

  return `${local.getFullYear()}-${pad(local.getMonth() + 1)}-${pad(
    local.getDate()
  )}T${pad(local.getHours())}:${pad(local.getMinutes())}`;
}

/**
 * ✅ 로컬 datetime-local 문자열을 KST 기준 {date,time}으로 복원
 */
function parseLocalToKST(value: string): { date: Date; time: string } | null {
  if (!value) return null;

  try {
    const local = new Date(value);
    const kstMs = local.getTime() + KST_OFFSET_MS;

    // kstMs를 "UTC getter"로 읽으면 그 값이 곧 KST 구성요소가 됨
    const kst = new Date(kstMs);

    const y = kst.getUTCFullYear();
    const m = kst.getUTCMonth();
    const d = kst.getUTCDate();

    const hh = pad(kst.getUTCHours());

    // 10분 단위 유지(기존 로직 유지)
    const mmRaw = kst.getUTCMinutes();
    const mm = pad(Math.floor(mmRaw / 10) * 10);

    return {
      date: new Date(y, m, d),
      time: `${hh}:${mm}`,
    };
  } catch {
    return null;
  }
}

function generateTimeOptions(): string[] {
  const options: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 10) {
      options.push(`${pad(hour)}:${pad(minute)}`);
    }
  }
  return options;
}

const timeOptions = generateTimeOptions();

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [open, setOpen] = useState(false);

  /** ✅ value 바뀌면 UI state도 따라가게 */
  useEffect(() => {
    const parsed = value ? parseLocalToKST(value) : null;
    setSelectedDate(parsed?.date);
    setSelectedTime(parsed?.time ?? "");
  }, [value]);

  function handleDateSelect(date: Date | undefined) {
    setSelectedDate(date);

    if (date && selectedTime) {
      onChange?.(convertKSTToLocal(date, selectedTime));
    }

    if (date) setOpen(false);
  }

  function handleTimeSelect(time: string) {
    setSelectedTime(time);

    if (selectedDate && time) {
      onChange?.(convertKSTToLocal(selectedDate, time));
    }
  }

  const displayValue = selectedDate
    ? format(selectedDate, "yyyy년 M월 d일 (EEE)", { locale: ko })
    : "날짜 선택";

  /** ✅ (원하면) KST 기준 오늘 이전 막기 */
  const minDate = useMemo(() => {
    const now = new Date();
    const kstNow = new Date(now.getTime() + KST_OFFSET_MS);
    return new Date(kstNow.getUTCFullYear(), kstNow.getUTCMonth(), kstNow.getUTCDate());
  }, []);

  return (
    <div className="flex flex-col gap-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-medium bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 hover:border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayValue}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-white shadow-2xl z-[110] border border-slate-200 rounded-2xl"
          align="start"
          side="bottom"
          sideOffset={10}
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => date < minDate}
            initialFocus
            locale={ko}
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>

      <Select value={selectedTime} onValueChange={handleTimeSelect}>
        <SelectTrigger
          className={cn(
            "w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-medium h-auto hover:border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all",
            !selectedTime && "text-muted-foreground"
          )}
        >
          <SelectValue placeholder="시간 선택" />
        </SelectTrigger>

        <SelectContent className="max-h-[300px] bg-white z-[120] rounded-xl border border-slate-200 shadow-xl">
          {timeOptions.map((time) => (
            <SelectItem key={time} value={time} className="cursor-pointer hover:bg-slate-100">
              {time}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
