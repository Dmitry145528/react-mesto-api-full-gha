import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import Logo from '../images/Logo.svg'

function Header(props) {

	const location = useLocation();
	const [currentPath, setCurrentPath] = useState(location.pathname);
	const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		setCurrentPath(location.pathname);
	}, [location.pathname]);

	const onSignOut = () => {
		localStorage.removeItem('token');
		navigate('/sign-in', { replace: true });
	}

	const handleBurgerClick = () => {
    setIsBurgerMenuOpen(!isBurgerMenuOpen);
  };

	const getLinkText = () => {
		if (currentPath === "/sign-up") {
			return "Вход";
		} else if (currentPath === "/sign-in") {
			return "Регистрация";
		}
		// По умолчанию, возвращаем "Ошибка текста ссылки" для всех остальных случаев
		return console.log("Ошибка текста ссылки");
	};

	const getLinkTo = () => {
		if (currentPath === "/sign-up") {
			return "/sign-in";
		} else if (currentPath === "/sign-in") {
			return "/sign-up";
		}
		// По умолчанию, возвращаем "/sign-in" для всех остальных случаев
		return "/sign-in";
	};

	return (
		<>
			{currentPath === "/" ? (
				<div className={isBurgerMenuOpen ? "header__container_mobile header__container_mobile-open" : "header__container_mobile"}>
					<p className="header__info">{props.email}</p>
					<button className="header__button" onClick={onSignOut}>
						Выйти
					</button>
				</div>) : ('')
			}
			<header className="header">
				<img src={Logo} alt="Логотип в виде надписи Место Россия" className="header__logo" />
				{currentPath === "/" ? (<>
					<div className="header__container">
						<p className="header__info">{props.email}</p>
						<button className="header__button" onClick={onSignOut}>
							Выйти
						</button>
					</div>
					<button className={`header__button ${isBurgerMenuOpen ? "header__button_mobile-close rotateClockwise" : "header__button_mobile rotateCounterClockwise"}`} onClick={handleBurgerClick} ></button></>
				) : (
					<Link className="header__link" to={getLinkTo()}>
						{getLinkText()}
					</Link>
				)}
			</header>
		</>);
}

export default Header;