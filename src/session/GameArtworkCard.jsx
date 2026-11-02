export default function GameArtworkCard({ session, onSelect }) {
    return (
        <button type="button" onClick={() => onSelect(session.id)}>
            <img src={session.artwork} alt={session.game} />
        </button>
    )
}