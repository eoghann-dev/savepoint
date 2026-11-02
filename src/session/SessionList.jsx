import GameArtworkCard from "./GameArtworkCard.jsx"

export default function SessionList({ sessions, onSelect }) {
    return (
        <>
            {sessions.map((session) => (
                <GameArtworkCard 
                    key={session.id} 
                    session={session} 
                    onSelect={onSelect}
                />
            ))}
        </>
    )
}