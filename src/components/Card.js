const Card = ({ image, title, subtitle, shape = 'square' }) => {
  return (
    <div className={`card card-${shape}`}>
      {image ? (
        <img src={image} alt={title} className="card-image" />
      ) : (
        <div className="card-image-placeholder">
          <span className="card-placeholder-icon">🎵</span>
        </div>
      )}
      <div className="card-body">
        <h4 className="card-title">{title}</h4>
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};

export default Card;
