import * as React from 'react'
import { DayJSConvertedEvent, Event, EventCellStyle } from './interfaces'
interface CalendarBodyProps<T> {
  event: DayJSConvertedEvent
  onPressEvent?: (event: Event<T>) => void
  eventCellStyle?: EventCellStyle<T>
  showTime: boolean
}
export declare const CalendarEvent: React.MemoExoticComponent<({
  event,
  onPressEvent,
  eventCellStyle,
  showTime,
}: CalendarBodyProps<any>) => JSX.Element>
export {}
