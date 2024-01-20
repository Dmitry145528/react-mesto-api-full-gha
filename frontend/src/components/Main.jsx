import { useContext } from 'react';
import CurrentUserContext from '../contexts/CurrentUserContext';

function Main(props) {
	const currentUser = useContext(CurrentUserContext);

	return (
		<main className="content">
			<section className="profile">
				<div className="profile__pos-left">
					<img className="profile__avatar"
						alt="Цветная фотография крупным планом человека в красной шапке на улице, лицо в фокусе, фон размыт" src={currentUser.avatar} />
					<button className="profile__avatar-button" onClick={props.onEditAvatar}></button>
					<div className="profile-info">
						<div className="profile-info__line">
							<h1 className="profile-info__title">{currentUser.name}</h1>
							<button className="profile-info__edit-button" type="button" aria-label="Кнопка в виде ручки в рамке" onClick={props.onEditProfile}></button>
						</div>
						<p className="profile-info__subtitle">{currentUser.about}</p>
					</div>
				</div>
				<button className="profile__addbutton" type="button" aria-label="Кнопка с символом плюс" onClick={props.onAddPlace}></button>
			</section>
			<section className="elements">
				<ul className="elements__grid-items">
					{props.cardItems}
				</ul>
			</section>
		</main>
	);
}

export default Main