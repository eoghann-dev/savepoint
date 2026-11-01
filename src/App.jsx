import SessionCard from './session/SessionCard.jsx'

import { useState } from 'react'

function App() {
  const [sessions, setSessions] = useState([
    {
      id: 1,
      game: 'Minecraft',
      currentGoal: 'Build an iron farm',
      subGoals: [
        { id: 1, text: 'Collect villagers', completed: true },
        { id: 2, text: 'Build the holding chamber', completed: false },
      ],
      notes: 'Need more rails and temporary blocks.',
      nextTask: 'Move the zombie into the holding chamber.',
      lastPlayed: '2026-10-31'
    },
])

  const updateSubGoal = (sessionId, subGoalId) => {
    setSessions((previousSessions) =>
      previousSessions.map((session) => {
        if (session.id !== sessionId) return session;

        return {
          ...session,
          subGoals: session.subGoals.map((subGoal) => {
            if (subGoal.id !== subGoalId) return subGoal;

            return {
              ...subGoal,
              completed: !subGoal.completed,
            }
          }),
        }
      }),
    )
  }

  return (
    <main>
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} onToggleSubGoal={updateSubGoal}/>
      ))}
    </main>
  )
}

export default App
