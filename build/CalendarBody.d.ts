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
  overwriteCellHeight?: number
  onSwipeHorizontal?: (d: HorizontalDirection) => void
}
export declare const CalendarBody: React.MemoExoticComponent<({
  containerHeight,
  cellHeight,
  dateRange,
  style,
  onPressCell,
  dayJsConvertedEvents,
  overwriteCellHeight,
  onPressEvent,
  eventCellStyle,
  showTime,
  scrollOffsetMinutes,
  onSwipeHorizontal,
}: CalendarBodyProps<any>) => JSX.Element>
export {}
