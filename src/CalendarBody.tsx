import dayjs from 'dayjs'
import * as React from 'react'
import {
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native'
import { CalendarEvent } from './CalendarEvent'
import { commonStyles } from './commonStyles'
import { DayJSConvertedEvent, Event, EventCellStyle, HorizontalDirection } from './interfaces'
import { formatHour, getRelativeTopInDay, hours, isToday } from './utils'

const SWIPE_THRESHOLD = 50

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

interface WithCellHeight {
  cellHeight: number
  zoom?: number
  scrollView: ScrollView
  scrollToNow?: boolean
}

const HourGuideColumn = React.memo(
  ({ cellHeight, hour, zoom, scrollView, scrollToNow }: WithCellHeight & { hour: number }) => {
    return (
      <View
        style={[{ height: zoom || cellHeight }]}
        onLayout={(event) => {
          const { y } = event.nativeEvent.layout
          //@ts-ignore
          if (dayjs().$H === hour && scrollToNow) {
            //@ts-ignore
            scrollView!.current?.scrollTo({
              y,
              animated: true,
            })
          }
        }}
      >
        <Text style={commonStyles.guideText}>{formatHour(hour)}</Text>
      </View>
    )
  },
)

interface HourCellProps extends WithCellHeight {
  onPress: (d: dayjs.Dayjs) => void
  date: dayjs.Dayjs
  hour: number
  zoom?: number
}

function HourCell({ cellHeight, onPress, date, hour, zoom }: HourCellProps) {
  return (
    <TouchableWithoutFeedback onPress={() => onPress(date.hour(hour).minute(0))}>
      <View style={[commonStyles.dateCell, { height: zoom || cellHeight }]} />
    </TouchableWithoutFeedback>
  )
}

export const CalendarBody = React.memo(
  ({
    containerHeight,
    cellHeight,
    dateRange,
    style = {},
    onPressCell,
    dayJsConvertedEvents,
    onPressEvent,
    eventCellStyle,
    showTime,
    scrollToNow,
    scrollOffsetMinutes,
    onSwipeHorizontal,
    zoom,
  }: CalendarBodyProps<any>) => {
    const scrollView = React.useRef<ScrollView>(null)
    const [now, setNow] = React.useState(dayjs())
    const [panHandled, setPanHandled] = React.useState(false)
    React.useEffect(() => {
      if (scrollView.current && scrollOffsetMinutes) {
        // We add delay here to work correct on React Native
        // see: https://stackoverflow.com/questions/33208477/react-native-android-scrollview-scrollto-not-working
        setTimeout(
          () => {
            scrollView.current!.scrollTo({
              y: (cellHeight * scrollOffsetMinutes) / 60,
              animated: false,
            })
          },
          Platform.OS === 'web' ? 0 : 10,
        )
      }
    }, [scrollView.current, zoom])

    React.useEffect(() => {
      const pid = setInterval(() => setNow(dayjs()), 2 * 60 * 1000)
      return () => clearInterval(pid)
    }, [])

    const panResponder = React.useMemo(
      () =>
        PanResponder.create({
          // see https://stackoverflow.com/questions/47568850/touchableopacity-with-parent-panresponder
          onMoveShouldSetPanResponder: (_, { dx, dy }) => {
            return dx > 2 || dx < -2 || dy > 2 || dy < -2
          },
          onPanResponderMove: (_, { dy, dx }) => {
            if (dy < -1 * SWIPE_THRESHOLD || SWIPE_THRESHOLD < dy || panHandled) {
              return
            }
            if (dx < -1 * SWIPE_THRESHOLD) {
              onSwipeHorizontal && onSwipeHorizontal('LEFT')
              setPanHandled(true)
              return
            }
            if (dx > SWIPE_THRESHOLD) {
              onSwipeHorizontal && onSwipeHorizontal('RIGHT')
              setPanHandled(true)
              return
            }
          },
          onPanResponderEnd: () => {
            setPanHandled(false)
          },
        }),
      [panHandled, onSwipeHorizontal],
    )

    const _onPressCell = React.useCallback(
      (date: dayjs.Dayjs) => {
        onPressCell && onPressCell(date.toDate())
      },
      [onPressCell],
    )

    return (
      <>
        <ScrollView
          style={[
            {
              height: containerHeight - cellHeight * 3,
            },
            style,
          ]}
          ref={scrollView}
          scrollEventThrottle={32}
          {...(Platform.OS !== 'web' ? panResponder.panHandlers : {})}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.body]} {...(Platform.OS === 'web' ? panResponder.panHandlers : {})}>
            <View style={[commonStyles.hourGuide]}>
              {hours.map((hour) => (
                //@ts-ignore
                <HourGuideColumn
                  key={hour}
                  cellHeight={cellHeight}
                  hour={hour}
                  zoom={zoom}
                  scrollView={scrollView}
                  scrollToNow={scrollToNow}
                />
              ))}
            </View>
            {dateRange.map((date) => (
              <View style={[{ flex: 1 }]} key={date.toString()}>
                {hours.map((hour) => (
                  //@ts-ignore
                  <HourCell
                    key={hour}
                    cellHeight={cellHeight}
                    date={date}
                    hour={hour}
                    zoom={zoom}
                    onPress={_onPressCell}
                  />
                ))}
                {dayJsConvertedEvents
                  .filter(
                    ({ start, end }) =>
                      start.isAfter(date.startOf('day')) && end.isBefore(date.endOf('day')),
                  )
                  .map((event) => (
                    <CalendarEvent
                      key={event.start.toString()}
                      event={event}
                      onPressEvent={onPressEvent}
                      eventCellStyle={eventCellStyle}
                      showTime={showTime}
                    />
                  ))}
                {isToday(date) && (
                  <View style={[styles.nowIndicator, { top: `${getRelativeTopInDay(now)}%` }]} />
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </>
    )
  },
)

const styles = StyleSheet.create({
  body: {
    flexDirection: 'row',
    flex: 1,
  },
  nowIndicator: {
    position: 'absolute',
    zIndex: 10000,
    backgroundColor: 'red',
    height: 2,
    width: '100%',
  },
})
