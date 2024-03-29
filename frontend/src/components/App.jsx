import { useState, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Main from '../components/Main'
import Footer from '../components/Footer'
import ImagePopup from './ImagePopup'
import ConfirmationPopup from './ConfirmationPopup'
import api from '../utils/Api'
import Card from './Card'
import EditProfilePopup from './EditProfilePopup'
import EditAvatarPopup from './EditAvatarPopup'
import AddPlacePopup from './AddPlacePopup'
import Login from './Login'
import Register from './Register'
import ProtectedRouteElement from './ProtectedRoute'
import InfoToolTip from './InfoTooltip'
import { checkToken, onLogout } from '../utils/Auth'
import CurrentUserContext from '../contexts/CurrentUserContext'

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isRegistrationPopupOpen, setIsRegistrationPopupOpen] = useState(false);
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);

  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCardDelete, setSelectedCardDelete] = useState(null);

  const [currentUser, setCurrentUser] = useState('');

  const [email, setEmail] = useState('');
  const [loggedIn, setLoggedIn] = useState(false); // Для статуса входа
  const [loginStatus, setLoginStatus] = useState(null); // Для статуса попапов
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (userId) {
      // проверим есть ли ID  в локальном хранилище
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
    }
  }, [loggedIn]);

  useEffect(() => {
    // Функция для выполнения запросов к API
    const userId = localStorage.getItem('userId');

    if (userId) {
      // проверим есть ли ID  в локальном хранилище
      checkToken().then((res) => {
        if (res) {
          // авторизуем пользователя
          setEmail(res.email);
          handleLogin(true);
          navigate('/', { replace: true });
        }
      })
        .catch(err => {
          console.error('Ошибка при запросе токена:', err);
        });
    }
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

  const handleDeleteCardClick = (card) => {
    setSelectedCardDelete(card);
    setIsConfirmationPopupOpen(!isConfirmationPopupOpen);
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
    const isLiked = card.likes.some(id => id === currentUser._id);

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
        closeAllPopups();
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

  const handleLogin = (status) => {
    setLoggedIn(status);
  }

  const onSignOut = () => {
    onLogout().then((res) => {
      if (res) {
        localStorage.removeItem('userId');
        handleLogin(false);
        navigate('/sign-in', { replace: true });
      }
    })
      .catch(err => {
        console.error('Ошибка на стороне сервера:', err);
      });
  }

  const updateEmail = (newEmail) => {
    setEmail(newEmail);
  };

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(false);
    setSelectedCardDelete(false);
    setIsRegistrationPopupOpen(false);
    setIsConfirmationPopupOpen(false);
  };

  return (
    <>
      <CurrentUserContext.Provider value={currentUser}>
        <div className="center-pos">
          <Header
            email={email}
            onSignOut={onSignOut}
          />
          <Routes>
            <Route path="/" element={<ProtectedRouteElement element={Main}
              onEditAvatar={handleEditAvatarClick}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              cardItems={cards.map(card => (
                <Card
                  key={card._id}
                  card={card}
                  onCardDelete={handleDeleteCardClick}
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
      <ConfirmationPopup
        isOpen={isConfirmationPopupOpen}
        onClose={closeAllPopups}
        onConfirm={handleCardDelete}
        card={selectedCardDelete}
      />
      <ImagePopup
        name="popup-img-back"
        card={selectedCard}
        onClose={closeAllPopups}
      />
    </>
  )
}

export default App