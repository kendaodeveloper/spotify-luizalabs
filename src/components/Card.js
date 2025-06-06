const Card = ({ image, name, onClick }) => (
  <div className="card" onClick={onClick}>
    <img src={image} alt={name} />
    <div className="card-content">
      <h4>{name}</h4>
    </div>
  </div>
);

export default Card;
