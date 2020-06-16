'use strict'

Object.defineProperty(exports, '__esModule', { value: true })

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
}

var dayjs = _interopDefault(require('dayjs'))
var React = require('react')
var reactNative = require('react-native')

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function () {
  __assign =
    Object.assign ||
    function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i]
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p]
      }
      return t
    }
  return __assign.apply(this, arguments)
}

var MIN_HEIGHT = 1200
var PRIMARY_COLOR = 'rgb(66, 133, 244)'
var HOUR_GUIDE_WIDTH = 50
var commonStyles = reactNative.StyleSheet.create({
  dateCell: {
    borderWidth: 1,
    borderColor: '#eee',
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  guideText: {
    color: '#888',
    fontSize: 11,
    textAlign: 'center',
  },
  hourGuide: {
    backgroundColor: '#fff',
    zIndex: 1000,
    width: HOUR_GUIDE_WIDTH,
  },
  eventCell: {
    position: 'absolute',
    zIndex: 100,
    width: '96%',
    alignSelf: 'center',
    borderRadius: 3,
    padding: 4,
  },
  eventTitle: {
    color: '#fff',
    fontSize: 12,
  },
})

var DAY_MINUTES = 1440
function getDatesInWeek(date, weekStartsOn, locale) {
  if (date === void 0) {
    date = new Date()
  }
  if (weekStartsOn === void 0) {
    weekStartsOn = 0
  }
  if (locale === void 0) {
    locale = 'en'
  }
  var subject = dayjs(date)
  var subjectDOW = subject.day()
  var days = Array(7)
    .fill(0)
    .map(function (_, i) {
      return subject.add(i - subjectDOW + weekStartsOn, 'day').locale(locale)
    })
  return days
}
function getDatesInNextThreeDays(date, locale) {
  if (date === void 0) {
    date = new Date()
  }
  if (locale === void 0) {
    locale = 'en'
  }
  var subject = dayjs(date).locale(locale)
  var days = Array(3)
    .fill(0)
    .map(function (_, i) {
      return subject.add(i, 'day')
    })
  return days
}
var hours = Array(24)
  .fill(0)
  .map(function (_, i) {
    return i
  })
function formatHour(hour) {
  return hour + ':00'
}
function isToday(date) {
  var today = dayjs()
  return today.isSame(date, 'day')
}
function getRelativeTopInDay(date) {
  if (date === void 0) {
    date = dayjs()
  }
  return (100 * (date.hour() * 60 + date.minute())) / DAY_MINUTES
}
function modeToNum(mode) {
  switch (mode) {
    case '3days':
      return 3
    case 'week':
      return 7
    default:
      throw new Error('undefined mode')
  }
}
function formatStartEnd(event) {
  return event.start.format('HH:mm') + ' - ' + event.end.format('HH:mm')
}
function isAllDayEvent(event) {
  return (
    event.start.hour() === 0 &&
    event.start.minute() === 0 &&
    event.end.hour() === 0 &&
    event.end.minute() === 0
  )
}

function getEventCellPositionStyle(_a) {
  var end = _a.end,
    start = _a.start
  var relativeHeight = 100 * (1 / DAY_MINUTES) * end.diff(start, 'minute')
  var relativeTop = getRelativeTopInDay(start)
  return {
    height: relativeHeight + '%',
    top: relativeTop + '%',
  }
}
var CalendarEvent = React.memo(function (_a) {
  var event = _a.event,
    onPressEvent = _a.onPressEvent,
    eventCellStyle = _a.eventCellStyle,
    showTime = _a.showTime
  var getEventStyle = React.useMemo(
    function () {
      return typeof eventCellStyle === 'function'
        ? eventCellStyle
        : function (_) {
            return eventCellStyle
          }
    },
    [eventCellStyle],
  )
  var _onPress = React.useCallback(
    function (event) {
      onPressEvent && onPressEvent(event)
    },
    [event],
  )
  return React.createElement(
    reactNative.TouchableOpacity,
    {
      delayPressIn: 20,
      key: event.start.toString(),
      style: [
        commonStyles.eventCell,
        getEventCellPositionStyle(event),
        getEventStyle(event),
        event.widget ? { backgroundColor: 'transparent' } : { backgroundColor: PRIMARY_COLOR },
      ],
      onPress: function () {
        return _onPress(event)
      },
      disabled: !onPressEvent,
    },
    event.end.diff(event.start, 'minute') < 32 && showTime
      ? React.createElement(
          reactNative.Text,
          { style: commonStyles.eventTitle },
          event.title,
          ',',
          React.createElement(
            reactNative.Text,
            { style: styles.eventTime },
            event.start.format('HH:mm'),
          ),
        )
      : React.createElement(
          React.Fragment,
          null,
          event.widget
            ? event.widget(event)
            : React.createElement(
                reactNative.Text,
                { style: commonStyles.eventTitle },
                event.title,
              ),
          showTime &&
            !event.widget &&
            React.createElement(
              reactNative.Text,
              { style: styles.eventTime },
              formatStartEnd(event),
            ),
        ),
  )
})
var styles = reactNative.StyleSheet.create({
  eventTime: {
    color: '#fff',
    fontSize: 10,
  },
})

var SWIPE_THRESHOLD = 50
var HourGuideColumn = React.memo(
  function (_a) {
    var cellHeight = _a.cellHeight,
      hour = _a.hour,
      overwriteCellHeight = _a.overwriteCellHeight
    return React.createElement(
      reactNative.View,
      { style: { height: overwriteCellHeight || cellHeight } },
      React.createElement(reactNative.Text, { style: commonStyles.guideText }, formatHour(hour)),
    )
  },
  function () {
    return true
  },
)
function HourCell(_a) {
  var cellHeight = _a.cellHeight,
    onPress = _a.onPress,
    date = _a.date,
    hour = _a.hour,
    overwriteCellHeight = _a.overwriteCellHeight
  return React.createElement(
    reactNative.TouchableWithoutFeedback,
    {
      onPress: function () {
        return onPress(date.hour(hour).minute(0))
      },
    },
    React.createElement(reactNative.View, {
      style: [commonStyles.dateCell, { height: overwriteCellHeight || cellHeight }],
    }),
  )
}
var CalendarBody = React.memo(function (_a) {
  var containerHeight = _a.containerHeight,
    cellHeight = _a.cellHeight,
    dateRange = _a.dateRange,
    _b = _a.style,
    style = _b === void 0 ? {} : _b,
    onPressCell = _a.onPressCell,
    dayJsConvertedEvents = _a.dayJsConvertedEvents,
    overwriteCellHeight = _a.overwriteCellHeight,
    onPressEvent = _a.onPressEvent,
    eventCellStyle = _a.eventCellStyle,
    showTime = _a.showTime,
    scrollOffsetMinutes = _a.scrollOffsetMinutes,
    onSwipeHorizontal = _a.onSwipeHorizontal
  var scrollView = React.useRef(null)
  var _c = React.useState(dayjs()),
    now = _c[0],
    setNow = _c[1]
  var _d = React.useState(false),
    panHandled = _d[0],
    setPanHandled = _d[1]
  React.useEffect(
    function () {
      if (scrollView.current && scrollOffsetMinutes) {
        setTimeout(
          function () {
            scrollView.current.scrollTo({
              y: (cellHeight * scrollOffsetMinutes) / 60,
              animated: false,
            })
          },
          reactNative.Platform.OS === 'web' ? 0 : 10,
        )
      }
    },
    [scrollView.current],
  )
  React.useEffect(function () {
    var pid = setInterval(function () {
      return setNow(dayjs())
    }, 2 * 60 * 1000)
    return function () {
      return clearInterval(pid)
    }
  }, [])
  var panResponder = React.useMemo(
    function () {
      return reactNative.PanResponder.create({
        onMoveShouldSetPanResponder: function (_, _a) {
          var dx = _a.dx,
            dy = _a.dy
          return dx > 2 || dx < -2 || dy > 2 || dy < -2
        },
        onPanResponderMove: function (_, _a) {
          var dy = _a.dy,
            dx = _a.dx
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
        onPanResponderEnd: function () {
          setPanHandled(false)
        },
      })
    },
    [panHandled, onSwipeHorizontal],
  )
  var _onPressCell = React.useCallback(
    function (date) {
      onPressCell && onPressCell(date.toDate())
    },
    [onPressCell],
  )
  return React.createElement(
    reactNative.ScrollView,
    __assign(
      {
        style: [
          {
            height: containerHeight - cellHeight * 3,
          },
          style,
        ],
        ref: scrollView,
        scrollEventThrottle: 32,
      },
      reactNative.Platform.OS !== 'web' ? panResponder.panHandlers : {},
      { showsVerticalScrollIndicator: false },
    ),
    React.createElement(
      reactNative.View,
      __assign(
        { style: [styles$1.body] },
        reactNative.Platform.OS === 'web' ? panResponder.panHandlers : {},
      ),
      React.createElement(
        reactNative.View,
        { style: [commonStyles.hourGuide] },
        hours.map(function (hour) {
          return React.createElement(HourGuideColumn, {
            key: hour,
            cellHeight: cellHeight,
            hour: hour,
            overwriteCellHeight: overwriteCellHeight,
          })
        }),
      ),
      dateRange.map(function (date) {
        return React.createElement(
          reactNative.View,
          { style: [{ flex: 1 }], key: date.toString() },
          hours.map(function (hour) {
            return React.createElement(HourCell, {
              key: hour,
              cellHeight: cellHeight,
              date: date,
              hour: hour,
              overwriteCellHeight: overwriteCellHeight,
              onPress: _onPressCell,
            })
          }),
          dayJsConvertedEvents
            .filter(function (_a) {
              var start = _a.start,
                end = _a.end
              return start.isAfter(date.startOf('day')) && end.isBefore(date.endOf('day'))
            })
            .map(function (event) {
              return React.createElement(CalendarEvent, {
                key: event.start.toString(),
                event: event,
                onPressEvent: onPressEvent,
                eventCellStyle: eventCellStyle,
                showTime: showTime,
              })
            }),
          isToday(date) &&
            React.createElement(reactNative.View, {
              style: [styles$1.nowIndicator, { top: getRelativeTopInDay(now) + '%' }],
            }),
        )
      }),
    ),
  )
})
var styles$1 = reactNative.StyleSheet.create({
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

var CalendarHeader = React.memo(function (_a) {
  var dateRange = _a.dateRange,
    cellHeight = _a.cellHeight,
    _b = _a.style,
    style = _b === void 0 ? {} : _b,
    allDayEvents = _a.allDayEvents,
    onPressDateHeader = _a.onPressDateHeader
  var _onPress = React.useCallback(
    function (date) {
      onPressDateHeader && onPressDateHeader(date)
    },
    [onPressDateHeader],
  )
  return React.createElement(
    reactNative.View,
    { style: [styles$2.container, style] },
    React.createElement(reactNative.View, {
      style: [commonStyles.hourGuide, styles$2.hourGuideSpacer],
    }),
    dateRange.map(function (date) {
      var _isToday = isToday(date)
      return React.createElement(
        reactNative.TouchableOpacity,
        {
          style: { flex: 1, paddingTop: 2 },
          onPress: function () {
            return _onPress(date.toDate())
          },
          disabled: onPressDateHeader === undefined,
          key: date.toString(),
        },
        React.createElement(
          reactNative.View,
          { style: { height: cellHeight, justifyContent: 'space-between' } },
          React.createElement(
            reactNative.Text,
            { style: [commonStyles.guideText, _isToday && { color: PRIMARY_COLOR }] },
            date.format('ddd'),
          ),
          React.createElement(
            reactNative.View,
            { style: _isToday && styles$2.todayWrap },
            React.createElement(
              reactNative.Text,
              { style: [styles$2.dateText, _isToday && { color: '#fff' }] },
              date.format('D'),
            ),
          ),
        ),
        React.createElement(
          reactNative.View,
          { style: [commonStyles.dateCell, { height: cellHeight }] },
          allDayEvents.map(function (event) {
            if (!event.start.isSame(date, 'day')) {
              return null
            }
            return React.createElement(
              reactNative.View,
              { style: commonStyles.eventCell },
              React.createElement(
                reactNative.Text,
                { style: commonStyles.eventTitle },
                event.title,
              ),
            )
          }),
        ),
      )
    }),
  )
})
var styles$2 = reactNative.StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  dateText: {
    color: '#444',
    fontSize: 22,
    textAlign: 'center',
    marginTop: 6,
  },
  todayWrap: {
    backgroundColor: PRIMARY_COLOR,
    width: 36,
    height: 36,
    borderRadius: 50,
    marginTop: 6,
    paddingBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  hourGuideSpacer: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
})

var Calendar = React.memo(function (_a) {
  var events = _a.events,
    _b = _a.style,
    style = _b === void 0 ? {} : _b,
    height = _a.height,
    overwriteCellHeight = _a.overwriteCellHeight,
    _c = _a.mode,
    mode = _c === void 0 ? 'week' : _c,
    _d = _a.locale,
    locale = _d === void 0 ? 'en' : _d,
    eventCellStyle = _a.eventCellStyle,
    date = _a.date,
    _e = _a.scrollOffsetMinutes,
    scrollOffsetMinutes = _e === void 0 ? 0 : _e,
    _f = _a.swipeEnabled,
    swipeEnabled = _f === void 0 ? true : _f,
    _g = _a.weekStartsOn,
    weekStartsOn = _g === void 0 ? 0 : _g,
    _h = _a.showTime,
    showTime = _h === void 0 ? true : _h,
    onPressEvent = _a.onPressEvent,
    onPressDateHeader = _a.onPressDateHeader,
    onChangeDate = _a.onChangeDate,
    onPressCell = _a.onPressCell
  var _j = React.useState(dayjs(date)),
    targetDate = _j[0],
    setTargetDate = _j[1]
  React.useEffect(
    function () {
      if (date) {
        setTargetDate(dayjs(date))
      }
    },
    [date],
  )
  var dayJsConvertedEvents = React.useMemo(
    function () {
      return events.map(function (e) {
        return __assign(__assign({}, e), { start: dayjs(e.start), end: dayjs(e.end) })
      })
    },
    [events],
  )
  var allDayEvents = React.useMemo(
    function () {
      return dayJsConvertedEvents.filter(isAllDayEvent)
    },
    [dayJsConvertedEvents],
  )
  var daytimeEvents = React.useMemo(
    function () {
      return dayJsConvertedEvents.filter(function (x) {
        return !isAllDayEvent(x)
      })
    },
    [dayJsConvertedEvents],
  )
  var dateRange = React.useMemo(
    function () {
      switch (mode) {
        case '3days':
          return getDatesInNextThreeDays(targetDate, locale)
        case 'week':
          return getDatesInWeek(targetDate, weekStartsOn, locale)
        default:
          throw new Error('undefined mode')
      }
    },
    [mode, targetDate],
  )
  React.useEffect(
    function () {
      if (onChangeDate) {
        onChangeDate([dateRange[0].toDate(), dateRange.slice(-1)[0].toDate()])
      }
    },
    [dateRange, onChangeDate],
  )
  var cellHeight = React.useMemo(
    function () {
      return Math.max(height - 30, MIN_HEIGHT) / 24
    },
    [height],
  )
  var onSwipeHorizontal = React.useCallback(
    function (direction) {
      if (!swipeEnabled) {
        return
      }
      if (direction === 'LEFT') {
        setTargetDate(targetDate.add(modeToNum(mode), 'day'))
      } else {
        setTargetDate(targetDate.add(modeToNum(mode) * -1, 'day'))
      }
    },
    [swipeEnabled, targetDate],
  )
  var commonProps = {
    cellHeight: cellHeight,
    dateRange: dateRange,
    style: style,
  }
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      CalendarHeader,
      __assign({}, commonProps, {
        allDayEvents: allDayEvents,
        onPressDateHeader: onPressDateHeader,
      }),
    ),
    React.createElement(
      CalendarBody,
      __assign({}, commonProps, {
        overwriteCellHeight: overwriteCellHeight,
        dayJsConvertedEvents: daytimeEvents,
        containerHeight: height,
        onPressEvent: onPressEvent,
        onPressCell: onPressCell,
        eventCellStyle: eventCellStyle,
        scrollOffsetMinutes: scrollOffsetMinutes,
        showTime: showTime,
        onSwipeHorizontal: onSwipeHorizontal,
      }),
    ),
  )
})

exports.Calendar = Calendar
//# sourceMappingURL=index.js.map
