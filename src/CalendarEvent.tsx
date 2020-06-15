import dayjs from 'dayjs'
import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { commonStyles } from './commonStyles'
import { DayJSConvertedEvent, Event, EventCellStyle } from './interfaces'
import { DAY_MINUTES, formatStartEnd, getRelativeTopInDay } from './utils'

function getEventCellPositionStyle({ end, start }: { end: dayjs.Dayjs; start: dayjs.Dayjs }) {
  const relativeHeight = 100 * (1 / DAY_MINUTES) * end.diff(start, 'minute')
  const relativeTop = getRelativeTopInDay(start)
  return {
    height: `${relativeHeight}%`,
    top: `${relativeTop}%`,
  }
}

interface CalendarBodyProps<T> {
  event: DayJSConvertedEvent
  onPressEvent?: (event: Event<T>) => void
  eventCellStyle?: EventCellStyle<T>
  showTime: boolean
}

export const CalendarEvent = React.memo(
  ({ event, onPressEvent, eventCellStyle, showTime }: CalendarBodyProps<any>) => {
    const getEventStyle = React.useMemo(
      () => (typeof eventCellStyle === 'function' ? eventCellStyle : (_: any) => eventCellStyle),
      [eventCellStyle],
    )

    const _onPress = React.useCallback(
      (event: DayJSConvertedEvent) => {
        onPressEvent && onPressEvent(event)
      },
      [event],
    )
    return (
      <TouchableOpacity
        delayPressIn={20}
        key={event.start.toString()}
        style={[commonStyles.eventCell, getEventCellPositionStyle(event), getEventStyle(event)]}
        onPress={() => _onPress(event)}
        disabled={!onPressEvent}
      >
        {event.end.diff(event.start, 'minute') < 32 && showTime ? (
          <Text style={commonStyles.eventTitle}>
            {event.title},<Text style={styles.eventTime}>{event.start.format('HH:mm')}</Text>
          </Text>
        ) : (
          <>
            {event.widget ? (
              event.widget(event)
            ) : (
              <Text style={commonStyles.eventTitle}>{event.title}</Text>
            )}
            {showTime && !event.widget && (
              <Text style={styles.eventTime}>{formatStartEnd(event)}</Text>
            )}
          </>
        )}
      </TouchableOpacity>
    )
  },
)

const styles = StyleSheet.create({
  eventTime: {
    color: '#fff',
    fontSize: 10,
  },
})
