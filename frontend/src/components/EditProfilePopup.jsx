import { useState, useEffect, useContext } from 'react'
import PopupWithForm from "./PopupWithForm"
import CurrentUserContext from '../contexts/CurrentUserContext'
import { useFormAndValidation } from '../hooks/useFormAndValidation'

function EditProfilePopup(props) {
  const [submitButtonText, setSubmitButtonText] = useState('Сохранить');
  const { values, handleChange, errors, isValid, setValues } = useFormAndValidation();

  const currentUser = useContext(CurrentUserContext);

  // После загрузки текущего пользователя из API
  // его данные будут использованы в управляемых компонентах.
  useEffect(() => {
    if (currentUser.name && currentUser.about) {
      setValues({ name: currentUser.name, about: currentUser.about });
    }
  }, [currentUser, props.isOpen, setValues]);

  function handleSubmit(e) {
    e.preventDefault();

    if (isValid) {
      setSubmitButtonText('Сохранение...');

      props.onUpdateUser({
        name: values.name,
        about: values.about,
      })
        .finally(() => {
          setSubmitButtonText('Сохранить');
        });
    } else {
      console.log('Форма невалидна, отправка данных отклонена.');
    }
  }

  return (
    <PopupWithForm
      title="Редактировать профиль"
      name="edit-profile"
      button={submitButtonText}
      onSubmit={handleSubmit}
      isOpen={props.isOpen}
      onClose={props.onClose}
      isValid={isValid}
    >
      <fieldset className="popup__contact-info">
        <div className="popup__field">
          <input
            className="popup__input"
            id="name"
            placeholder="Имя и Фамилия"
            name="name"
            type="text"
            minLength="2"
            maxLength="40"
            required
            value={values.name || ''}
            onChange={handleChange}
          />
          <span className="name-error popup__input-error">{errors.name}</span>
        </div>
        <div className="popup__field">
          <input
            className="popup__input"
            id="activity"
            placeholder="Деятельность"
            name="about"
            type="text"
            minLength="2"
            maxLength="200"
            required
            value={values.about || ''}
            onChange={handleChange}
          />
          <span className="activity-error popup__input-error">{errors.about}</span>
        </div>
      </fieldset>
    </PopupWithForm>
  );
}

export default EditProfilePopup;