import { useState, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Main from '../components/Main'
import Footer from '../components/Footer'
import PopupWithForm from '../components/PopupWithForm'
import ImagePopup from './ImagePopup'
import api from '../utils/Api'
import Card from './Card'
import EditProfilePopup from './EditProfilePopup'
import EditAvatarPopup from './EditAvatarPopup'
import AddPlacePopup from './AddPlacePopup'
import Login from './Login'
import Register from './Register'
import ProtectedRouteElement from './ProtectedRoute'
import InfoToolTip from './InfoTooltip'
import { checkToken } from '../utils/Auth'
import CurrentUserContext from '../contexts/CurrentUserContext'

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isRegistrationPopupOpen, setIsRegistrationPopupOpen] = useState(false);

  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  const [currentUser, setCurrentUser] = useState('');

  const [email, setEmail] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginStatus, setLoginStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Функция для выполнения запросов к API
    const tokenCheck = () => {

      if (localStorage.getItem('token')) {
        const token = localStorage.getItem('token');

        if (token) {
          // проверим токен
          checkToken(token).then((res) => {
            if (res) {
              // авторизуем пользователя
              setEmail(res.data.email);
              handleLogin();
              navigate('/', { replace: true });
            }
          })
            .catch(err => {
              console.error('Ошибка при запросе токена:', err);
            });
        }
      }
    }

    const fetchData = () => {

      Promise.all([
        api.getProfileInfo(),
        api.getInitialCards(),
      ])
        .then(([userData, initialCards]) => {
          setCurrentUser(userData);
          setCards(initialCards);
        })
        .catch(err => {
          console.error('Ошибка при запросе к API:', err);
        });
    };

    tokenCheck();
    fetchData(); // Вызов функции
  }, []);

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  };

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
  };

  const handleLoginStatus = (status) => {
    setLoginStatus(status);
  };

  const handleOpenStatus = () => {
    setIsRegistrationPopupOpen(!isRegistrationPopupOpen);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    // Определяем, какой метод использовать
    const likeAction = () => isLiked ? api.deleteLike(card._id) : api.setLiked(card._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    likeAction(card._id)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((error) => {
        console.error('Ошибка статуса лайка:', error);
      });
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((error) => {
        console.error('Ошибка удаления карточки:', error);
      });
  }

  function handleUpdateUser(userData) {
    return api.setProfileInfo(userData)
      .then((newUserData) => {
        setCurrentUser(newUserData);
        closeAllPopups();
      })
      .catch((err) => {
        console.error('Ошибка обновления данных пользователя:', err);
      })
  }

  function handleUpdateAvatar(userData) {
    return api.updateAvatar(userData)
      .then((newUserData) => {
        setCurrentUser(newUserData);
        closeAllPopups();
      })
      .catch((err) => {
        console.error('Ошибка обновления аватара:', err);
      })
  }

  function handleAddPlaceSubmit({ name, link }) {
    return api.addCard({ name, link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.error('Ошибка добавления карточки:', err);
      })
  }

  const handleLogin = () => {
    setLoggedIn(true);
  }

  const updateEmail = (newEmail) => {
    setEmail(newEmail);
  };

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(false);
    setIsRegistrationPopupOpen(false);
  };

  return (
    <>
      <CurrentUserContext.Provider value={currentUser}>
        <div className="center-pos">
          <Header email={email} />
          <Routes>
            <Route path="/" element={<ProtectedRouteElement element={Main}
              onEditAvatar={handleEditAvatarClick}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              cardItems={cards.map(card => (
                <Card
                  key={card._id}
                  card={card}
                  onCardDelete={handleCardDelete}
                  onCardLike={handleCardLike}
                  onCardClick={handleCardClick}
                />
              ))}
              loggedIn={loggedIn} />} />
            <Route path="sign-in" element={<Login
              handleLoginStatus={handleLoginStatus}
              isOpen={handleOpenStatus}
              updateEmail={updateEmail}
              handleLogin={handleLogin} />} />
            <Route path="sign-up" element={<Register
              handleLoginStatus={handleLoginStatus}
              isOpen={handleOpenStatus} />} />
          </Routes>
          <Footer />
        </div>
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser} />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit} />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar} />
        <InfoToolTip
          isOpen={isRegistrationPopupOpen}
          onClose={closeAllPopups}
          loginStatus={loginStatus}
        />
      </CurrentUserContext.Provider>
      <PopupWithForm
        title="Вы уверены?"
        name="delete-card"
        button="Да" />
      <ImagePopup
        name="popup-img-back"
        card={selectedCard}
        onClose={closeAllPopups}
      />
    </>
  )
}

export default App