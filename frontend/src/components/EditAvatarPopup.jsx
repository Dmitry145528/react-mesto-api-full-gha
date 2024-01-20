import PopupWithForm from "./PopupWithForm"
import { useEffect, useState } from 'react'
import { useFormAndValidation } from '../hooks/useFormAndValidation'

function EditAvatarPopup(props) {
  const [submitButtonText, setSubmitButtonText] = useState('Сохранить');
  const { values, handleChange, errors, isValid, resetForm } = useFormAndValidation();

  useEffect(() => {
    // Сброс полей при закрытии модального окна
    if (!props.isOpen) {
      resetForm({ avatar: '' });
    }
  }, [props.isOpen, resetForm]);

  function handleSubmit(e) {
    e.preventDefault();

    if (isValid) {
      setSubmitButtonText('Сохранение...');

      props.onUpdateAvatar({
        avatar: values.avatar,
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
      title="Обновить аватар"
      name="update-avatar"
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
            value={values.avatar || ''}
            onChange={handleChange}
            placeholder='Ссылка на картинку'
            id="avatar-url"
            name="avatar"
            type="url"
            required
          />
          <span className="avatar-url-error popup__input-error">{errors.avatar}</span>
        </div>
      </fieldset>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;