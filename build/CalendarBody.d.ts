import dayjs from 'dayjs'
import * as React from 'react'
import { ViewStyle } from 'react-native'
import { DayJSConvertedEvent, Event, EventCellStyle, HorizontalDirection } from './interfaces'
interface CalendarBodyProps<T> {
  containerHeight: number
  cellHeight: number
  dateRange: dayjs.Dayjs[]
  dayJsConvertedEvents: DayJSConvertedEvent[]
  style: ViewStyle
  onPressEvent?: (event: Event<T>) => void
  onPressCell?: (date: Date) => void
  eventCellStyle?: EventCellStyle<T>
  scrollOffsetMinutes: number
  showTime: boolean
  scrollToNow?: boolean
  overwriteCellHeight?: number
  onSwipeHorizontal?: (d: HorizontalDirection) => void
  zoom?: number
}
export declare const CalendarBody: React.MemoExoticComponent<({
  containerHeight,
  cellHeight,
  dateRange,
  style,
  onPressCell,
  dayJsConvertedEvents,
  onPressEvent,
  eventCellStyle,
  showTime,
  scrollToNow,
  scrollOffsetMinutes,
  onSwipeHorizontal,
  zoom,
}: CalendarBodyProps<any>) => JSX.Element>
export {}
