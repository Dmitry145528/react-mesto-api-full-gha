import successImage from '../images/Success.svg'
import errorImage from '../images/Error.svg'

function InfoToolTip(props) {
  return (
    <div className={props.isOpen ? 'popup popup_opened' : 'popup'}>
      <div className="popup__container infoTooltip__container">
        <button className="popup__close" type="button" aria-label="Кнопка в форме крестика" onClick={props.onClose}></button>
        <img src={props.loginStatus ? successImage : errorImage} alt="Статус регистрации" />
        <h2 className="popup__header infoTooltip__title">{props.loginStatus ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'}</h2>
      </div>
    </div>
  );
}

export default InfoToolTip