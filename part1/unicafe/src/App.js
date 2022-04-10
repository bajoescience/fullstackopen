import { useState } from 'react'

const StatisticLine = ({text, value}) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const Statistics = ({good, neutral, bad}) => {
  let all = good + neutral + bad
  let average = all / 3
  let positive = `${(good / all) * 100}%` 

  if (all === 0) {
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }

  return (
    <div>
      <h1>statistics</h1>
     <table>
      <tbody>
        <StatisticLine text='good' value={good} />
        <StatisticLine text='neutral' value={neutral} />
        <StatisticLine text='bad' value={bad} />
        <StatisticLine text='all' value={all} />
        <StatisticLine text='average' value={average} />
        <StatisticLine text='positive' value={positive} />
      </tbody>
     </table>
    </div>
  )
}

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodFeedback = () => setGood(good + 1)
  const handleNeutralFeedback = () => {setNeutral(neutral + 1)}
  const handleBadFeedback = () => {setBad(bad + 1)}

  return (
    <div>
      <div>
        <h1>give feedback</h1>
        <Button onClick={handleGoodFeedback} text='good' />
        <Button onClick={handleNeutralFeedback} text='neutral'/>
        <Button onClick={handleBadFeedback} text='bad' />
      </div>    
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}


export default App;
