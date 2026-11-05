import { useEffect, useState } from "react";

export default function SessionForm({ onAddSession }) {
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [gameName, setGameName] = useState('');
    const [selectedGame, setSelectedGame] = useState(null);
    const [selectedGameDetails, setSelectedGameDetails] = useState(null);
    const [currentGoal, setCurrentGoal] = useState('');
    const [subGoals, setSubGoals] = useState([]);
    const [subGoal, setSubGoal] = useState('');
    const [notes, setNotes] = useState('');
    const [nextTask, setNextTask] = useState('');
    
    useEffect(() => {
        if (gameName.trim().length < 2) {
            return
        }

        const timeoutId = setTimeout(async () => {
            const bucket = gameName.trim().slice(0, 2).toLowerCase()
            const url = `https://app.lizardbyte.dev/GameDB/buckets/${bucket}.json`
            try {
                setIsLoading(true);
                setError('');
                const response = await fetch(url);
                if(!response.ok) {
                    throw new Error(`Response status: ${response.status}`)
                }

                const result = await response.json();
                const games = Object.entries(result).map(([id, game]) => ({
                    id: Number(id),
                    ...game,
                }))
                setSuggestions(games)
                console.log(result);
            } catch (error) {
                console.error(error.message);
                setError(error.message)
            } finally {
                setIsLoading(false);
            }
        }, 2000)

        return () => {
            clearTimeout(timeoutId)
        }
    }, [gameName])

    useEffect(() => {
        if (!selectedGame) return

        const fetchGameDetails = async () => {
            try {
                const response = await fetch(
                    `https://app.lizardbyte.dev/GameDB/games/${selectedGame.id}.json`,
                )

                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`)
                }

                const details = await response.json()

                setSelectedGameDetails({
                    id: details.id,
                    name: details.name,
                    artwork: details.cover?.url
                    ? `https:${details.cover.url.replace('t_thumb', 't_cover_big')}`
                    : null,
                })
            } catch (error) {
                console.error(error.message)
                setError(error.message)
            }
        }

        fetchGameDetails()
    }, [selectedGame])

    const handleAddSubGoal = () => {
        const trimmedSubGoal = subGoal.trim();

        if (!trimmedSubGoal) return;

        setSubGoals((previousSubGoals) => [
            ...previousSubGoals,
            {
                id: crypto.randomUUID(),
                text: trimmedSubGoal,
            },
        ])

        setSubGoal('')
    }

    const handleDeleteSubGoal = (subGoalId) => {
        setSubGoals((previousSubGoals) => 
            previousSubGoals.filter((subGoal) => subGoal.id !== subGoalId)
        )
    }

    const handleGameNameChange = (event) => {
        setGameName(event.target.value)
        setSelectedGame(null)
        setSelectedGameDetails(null)
        setSuggestions([])
        setError('')
    }

    const handleSelectGame = (suggestion) => {
        setSelectedGame(suggestion)
        setGameName(suggestion.name)
        setSuggestions([])
        setError('')
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        if (!selectedGame) {
            setError('Please select a game from the suggestions.')
            return
        }

        if (!selectedGameDetails) {
            setError('Game details are still loading. Please wait and try again.')
            return
        }

        const newSession = {
            id: crypto.randomUUID(),
            game: selectedGame.name,
            gameApiId: selectedGameDetails.id,
            artwork: selectedGameDetails.artwork,
            currentGoal,
            subGoals: subGoals.map((item) => ({
                ...item,
                completed: false,
            })),
            notes,
            nextTask,
            lastPlayed: new Date().toISOString().split('T')[0],
        }

        onAddSession(newSession)

        setGameName('')
        setSelectedGame(null)
        setCurrentGoal('')
        setSubGoals([])
        setSubGoal('')
        setNotes('')
        setNextTask('')
    }

    const excludedTerms = [
        'dlc',
        'expansion',
        'bundle',
        'costume',
        'soundtrack',
        'pack',
        'season pass',
    ]

    const normalizedQuery = gameName.trim().toLowerCase()

    const displayedSuggestions = suggestions
        .filter((suggestion) => {
            const name = suggestion.name.toLowerCase()
            const matchesQuery = name.includes(normalizedQuery)
            const isExcluded = excludedTerms.some((term) => name.includes(term))

            return matchesQuery && !isExcluded
        })
        .sort((a, b) => {
            const aName = a.name.toLowerCase()
            const bName = b.name.toLowerCase()

            if (aName === normalizedQuery) return -1
            if (bName === normalizedQuery) return 1
            if (aName.startsWith(normalizedQuery)) return -1
            if (bName.startsWith(normalizedQuery)) return 1

            return aName.localeCompare(bName)
        })
        .slice(0, 10)
    
    return (
        <>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Game Session</legend>
                    <label>Game:</label>
                    <input 
                        type="text" 
                        name="game"
                        value={gameName}  
                        onChange={handleGameNameChange}
                    />

                    {isLoading && <p>Searching games...</p>}
                    
                    {displayedSuggestions.length > 0 && (
                        <ul>
                            {displayedSuggestions.map((suggestion) => (
                            <li key={suggestion.id}>
                                <button
                                type="button"
                                onClick={() => handleSelectGame(suggestion)}
                                >
                                {suggestion.name}
                                </button>
                            </li>
                            ))}
                        </ul>
                    )}

                    {error && <p role="alert">{error}</p>}

                    <label>Current Goal:</label>
                    <input 
                        type="text" 
                        name="currentGoal"
                        value={currentGoal}  
                        onChange={(event) => setCurrentGoal(event.target.value)}
                    />

                    <label>Sub-goals:</label>
                    <input 
                        type="text" 
                        name="subGoal"  
                        value={subGoal}
                        onChange={(event) => setSubGoal(event.target.value)}
                    />
                    <button type="button" onClick={handleAddSubGoal}>Add sub-goal</button>

                    <ul>
                        {subGoals.map((item) => (
                            <li key={item.id}>
                                <span>{item.text}</span>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteSubGoal(item.id)}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>

                    <label>Notes:</label>
                    <input 
                        type="text" 
                        name="notes"  
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                    />

                    <label>Next Task: </label>
                    <input 
                        type="text" 
                        name="nextTask"
                        value={nextTask}
                        onChange={(event) => setNextTask(event.target.value)}
                    />
                </fieldset>

                <button type="submit">Save</button>
            </form>
        </>
    )
}