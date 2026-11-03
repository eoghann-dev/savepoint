export default function SessionCard({ session, onToggleSubGoal, onDelete }) {
    if (!session) return null;

    return (
        <section>
            <article>
                <h2>{session.game}</h2>
                <p>Goal: {session.currentGoal}</p>
                <ul>
                    {session.subGoals.map((subGoal) => (
                        <li key={subGoal.id}>
                            <input
                                type="checkbox"
                                checked={subGoal.completed}
                                onChange={() => onToggleSubGoal(session.id, subGoal.id)}
                            />
                            <span>{subGoal.text}</span>
                        </li>
                    ))}
                </ul>
                <p>Notes: {session.notes}</p>
                <p>Next Task: {session.nextTask}</p>
                <p>Last Played: {session.lastPlayed}</p>
            </article>

            <button 
                type="button" 
                onClick={() => onDelete(session.id)}
            >
                Delete Session
            </button>
        </section>
    )
}