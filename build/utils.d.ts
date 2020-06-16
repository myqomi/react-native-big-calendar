import dayjs from 'dayjs'
import { DayJSConvertedEvent, Mode, WeekNum } from './interfaces'
export declare const DAY_MINUTES = 1440
export declare function getDatesInWeek(
  date?: Date | dayjs.Dayjs,
  weekStartsOn?: WeekNum,
  locale?: string,
): dayjs.Dayjs[]
export declare function getDatesInNextThreeDays(
  date?: Date | dayjs.Dayjs,
  locale?: string,
): dayjs.Dayjs[]
export declare const hours: number[]
export declare function formatHour(hour: number): string
export declare function isToday(date: dayjs.Dayjs): boolean
export declare function getRelativeTopInDay(date?: dayjs.Dayjs): number
export declare function todayInMinutes(): number
export declare function modeToNum(mode: Mode): 3 | 7
export declare function formatStartEnd(event: DayJSConvertedEvent): string
export declare function isAllDayEvent(event: DayJSConvertedEvent): boolean
