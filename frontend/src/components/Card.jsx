import { useContext } from 'react'
import CurrentUserContext from '../contexts/CurrentUserContext'

function Card(props) {
  const currentUser = useContext(CurrentUserContext);

  const handleClick = () => {
    props.onCardClick(props.card);
  };

  const handleLikeClick = () => {
    props.onCardLike(props.card);
  };

  const handleDeleteClick = () => {
    props.onCardDelete(props.card);
  };

  const isOwn = props.card.owner._id === currentUser._id;
  const isLiked = props.card.likes.some(i => i._id === currentUser._id);
  const cardLikeButtonClassName = `element__heart ${isLiked ? 'element__heart_active' : ''}`;

  return (
    <li className="element" key={props.card._id}>
      {isOwn && (
        <button
          className="element__trash"
          type="button"
          aria-label="Кнопка в виде мусорной корзины"
          onClick={handleDeleteClick}
        ></button>
      )}
      <img
        className="element__img"
        src={props.card.link}
        alt={props.card.name}
        onClick={handleClick}
      />
      <div className="element__pos-element">
        <h2 className="element__title">{props.card.name}</h2>
        <button
          className={cardLikeButtonClassName}
          type="button"
          aria-label="Кнопка в виде сердца"
          onClick={handleLikeClick}
        >
          <span className="element__heart_like-count">{props.card.likes.length}</span>
        </button>
      </div>
    </li>
  );
}

export default Card;