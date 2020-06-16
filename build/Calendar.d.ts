import * as React from 'react'
import { ViewStyle } from 'react-native'
import { DateRangeHandler, Event, EventCellStyle, Mode, WeekNum } from './interfaces'
interface CalendarProps<T = {}> {
  events: Event<T>[]
  height: number
  mode?: Mode
  style?: ViewStyle
  eventCellStyle?: EventCellStyle<T>
  scrollOffsetMinutes?: number
  date?: Date
  swipeEnabled?: boolean
  showTime?: boolean
  weekStartsOn?: WeekNum
  locale?: string
  onChangeDate?: DateRangeHandler
  onPressEvent?: (event: Event<T>) => void
  onPressDateHeader?: (date: Date) => void
  onPressCell?: (date: Date) => void
  overwriteCellHeight?: number | undefined
  scrollToNow?: boolean | undefined
}
export declare const Calendar: React.MemoExoticComponent<({
  events,
  style,
  height,
  overwriteCellHeight,
  mode,
  locale,
  eventCellStyle,
  date,
  scrollOffsetMinutes,
  swipeEnabled,
  weekStartsOn,
  showTime,
  onPressEvent,
  scrollToNow,
  onPressDateHeader,
  onChangeDate,
  onPressCell,
}: CalendarProps<{}>) => JSX.Element>
export {}
