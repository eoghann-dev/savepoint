import SessionList from './session/SessionList.jsx'
import SessionForm from './session/SessionForm.jsx'
import SessionCard from './session/SessionCard.jsx'

import placeholderGame from './assets/placeholder-game.webp'

import { useEffect, useState } from 'react'

function App() {
  const defaultSessions = [
    {
      id: 'sample-minecraft',
      game: 'Minecraft',
      artwork: placeholderGame,
      currentGoal: 'Build an iron farm',
      subGoals: [
        { id: 'subgoal-1', text: 'Collect villagers', completed: true },
        { id: 'subgoal-2', text: 'Build the holding chamber', completed: false },
      ],
      notes: 'Need more rails and temporary blocks.',
      nextTask: 'Move the zombie into the holding chamber.',
      lastPlayed: '2026-10-31',
    },
  ]

  const [sessions, setSessions] = useState(() => {
    const savedSessions = localStorage.getItem('sessions')

    if (!savedSessions) {
      return defaultSessions
    }

    try {
      const parsedSessions = JSON.parse(savedSessions)

      if (!Array.isArray(parsedSessions)) {
        console.error('Saved sessions must be an array')
        return defaultSessions
      }

      return parsedSessions
    } catch (error) {
      console.error('Failed to parse saved sessions:', error)
      return defaultSessions
    }
  })

  useEffect(() => {
    localStorage.setItem('sessions', JSON.stringify(sessions))
  }, [sessions])

  const [selectedSessionId, setSelectedSessionId] = useState(null)

  const selectedSession = sessions.find(
    (session) => session.id === selectedSessionId,
  )

  const handleAddSession = (newSession) => {
    setSessions((previousSessions) => [
      ...previousSessions,
      newSession,
    ])
  }

  const handleDeleteSession = (sessionId) => {
    setSessions((previousSessions) =>
      previousSessions.filter((session) => session.id !== sessionId),
    )

    if (selectedSessionId === sessionId) {
      setSelectedSessionId(null)
    }
  }

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

  const latestSessionsByGame = sessions.reduce((games, session) => {
    const existingSession = games[session.game]

    if (
      !existingSession ||
      session.lastPlayed > existingSession.lastPlayed
    ) {
      games[session.game] = session
    }

    return games
  }, {})

  const latestSessions = Object.values(latestSessionsByGame)

  return (
    <main>
      <SessionForm onAddSession={handleAddSession}></SessionForm>
      <SessionList sessions={latestSessions} onSelect={setSelectedSessionId}/>

      {selectedSession && (
        <SessionCard
          session={selectedSession}
          onToggleSubGoal={updateSubGoal}
          onDelete={handleDeleteSession}
        />
      )}
    </main>
  )
}

export default App
