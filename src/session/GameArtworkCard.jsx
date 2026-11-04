export default function GameArtworkCard({ session, onSelect }) {
    return (
        <button type="button" onClick={() => onSelect(session.id)}>
            <img src={session.artwork} alt={session.game} />
            <span>
                <strong>{session.game}</strong>
                <small>Last played: {session.lastPlayed}</small>
            </span>
        </button>
    )
}