import React, { ReactChild, ReactChildren, useCallback, useState } from 'react'
import { LayoutRectangle, Text, View } from 'react-native'
import { styles } from './valveCalenderWidgetStyles'

type ValveType = {
  children: ReactChildren | ReactChild
  flex: number
}

type ValvesCalenderWidgetType<
  T = {
    value: string
    amount: number
  }
> = {
  event: any
  amount: T[]
  measurementType: 0 | 1
}

export default function ValvesCalenderWidget({
  event,
  amount,
  measurementType,
}: ValvesCalenderWidgetType) {
  const [containerRectangle, setContainerRectangle] = useState<LayoutRectangle>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  })
  // const denominator = amount.reduce((accumulator, currentValue) => {
  //   return accumulator + currentValue.amount;
  // }, 0);
  const proportions = useCallback(
    (amount) => {
      console.log({ amount })
      return Number((amount / containerRectangle.height).toPrecision(2))
    },
    [containerRectangle.height],
  )

  console.log(
    '%c',
    'background: green; color: #fff;font-size:15px',
    proportions,
    containerRectangle,
  )
  const Valve = ({ children, flex }: ValveType) => {
    return <View style={[styles.valve, { flex }]}>{children}</View>
  }

  return (
    <View
      style={[styles.container]}
      onLayout={(event) => {
        setContainerRectangle(event?.nativeEvent?.layout)
      }}
    >
      <Text>{'Title'}</Text>
      {amount.map(({ amount, value }, index) => {
        return (
          <Valve flex={proportions(amount)} key={index}>
            <Text>{'V' + index}</Text>
          </Valve>
        )
      })}
    </View>
  )
}
