import { Link } from 'react-router-dom';

const RoomCard = ({ room }) => {
  const hasImage = room.images?.[0]?.url;
  const features = room.category?.features?.slice(0, 3) || [];

  return (
    <div className="room-card">
      {/* Image */}
      <div className="room-card-img">
        {hasImage ? (
          <img src={room.images[0].url} alt={room.name} />
        ) : (
          <div className="room-card-placeholder">🛏</div>
        )}
        <span className={`room-status-badge ${room.available ? 'status-available' : 'status-occupied'}`}>
          {room.available ? 'Available' : 'Occupied'}
        </span>
      </div>

      {/* Body */}
      <div className="room-card-body">
        <p className="room-card-cat">{room.category?.name ?? 'Room'}</p>
        <h3 className="room-card-name">{room.name}</h3>

        {features.length > 0 && (
          <div className="room-card-features">
            {features.map((f) => (
              <span key={f._id} className="feature-chip">{f.name}</span>
            ))}
          </div>
        )}

        <div className="room-card-footer">
          <div className="room-price">
            <span className="price-amount">₦{room.price?.toLocaleString()}</span>
            <span className="price-night">/night</span>
          </div>
          <Link to={`/rooms/${room._id}`} className="room-card-btn">
            View Room
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
