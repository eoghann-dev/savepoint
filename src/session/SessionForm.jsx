import { useState } from "react";

export default function SessionForm({ onAddSession }) {
    const [gameName, setGameName] = useState('');
    const [currentGoal, setCurrentGoal] = useState('');
    const [subGoals, setSubGoals] = useState([]);
    const [subGoal, setSubGoal] = useState('');
    const [notes, setNotes] = useState('');
    const [nextTask, setNextTask] = useState('');

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

    const handleSubmit = (event) => {
        event.preventDefault()

        const newSession = {
            id: crypto.randomUUID(),
            game: gameName,
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
    }

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
                        onChange={(event) => setGameName(event.target.value)}
                    />

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
                            <div>
                                <li key={item.id}>{item.text}</li>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteSubGoal(item.id)}
                                >
                                    Delete
                                </button>
                            </div>
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