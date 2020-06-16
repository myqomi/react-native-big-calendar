import { boolean, number, text, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { Text } from 'react-native'
import { CenteredView } from '../CenterdView'
import ValvesCalenderWidget from './ValvesCalenderWidget'

const stories = storiesOf('Components|ValvesCalenderWidget', module)
stories.addDecorator(withKnobs)

stories.add('base', () => {
  const amount = [
    {
      valve: 'ck9morhbuayhy0934p1nk1k7k',
      amount: 60,
    },
    {
      valve: 'ck9morhbuayhy0934p1nk1k7c',
      amount: 160,
    },
    {
      valve: 'ck9morhbuayhy0934p1nk1k7c',
      amount: 560,
    },
  ]

  return (
    <CenteredView customStyle={{ backgroundColor: '#fff' }}>
      <ValvesCalenderWidget amount={amount} measurementType={0} />
    </CenteredView>
  )
})
