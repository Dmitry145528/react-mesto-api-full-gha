function ImagePopup(props) {

		return (
			<div className={props.card ? `popup popup_${props.name} popup_opened` : `popup popup_${props.name}`}>
				<div className="popup__container-img">
					<button className="popup__close" type="button" aria-label="Кнопка в форме крестика" onClick={props.onClose}></button>
					<figure className="popup__figure">
						<img className="popup__image" src={props.card?.link} alt={props.card?.name} />
						<figcaption className="popup__caption">{props.card?.name}</figcaption>
					</figure>
				</div>
			</div>
		);
}

export default ImagePopup