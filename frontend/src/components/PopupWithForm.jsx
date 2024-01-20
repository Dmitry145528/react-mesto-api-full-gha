function PopupWithForm(props) {
  return (
    <div className={props.isOpen ? `popup popup_${props.name} popup_opened` : `popup popup_${props.name}`}>
      <div className="popup__container">
        <button className="popup__close" type="button" aria-label="Кнопка в форме крестика" onClick={props.onClose}></button>
        <h2 className="popup__header">{props.title}</h2>
        <form className="popup__form" action="#" name={props.name} onSubmit={props.onSubmit} method="post" noValidate>
          {props.children}
          <button
            type="submit"
            className={`popup__button ${props.isValid ? 'popup__button' : 'popup__button_disabled'}`}
            aria-label="Кнопка с надписью сохранить"
            disabled={!props.isValid}
          >
            {props.button}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;