import PopupWithForm from "./PopupWithForm"
import { useState, useEffect } from 'react'
import { useFormAndValidation } from '../hooks/useFormAndValidation'

function AddPlacePopup(props) {
  const [submitButtonText, setSubmitButtonText] = useState('Добавить');
  const { values, handleChange, errors, isValid, resetForm } = useFormAndValidation();

  useEffect(() => {
    // Сброс полей при закрытии модального окна
    if (!props.isOpen) {
      resetForm({
        title: '',
        url: ''
      });
    }
  }, [props.isOpen, resetForm]);

  function handleSubmit(e) {
    e.preventDefault();

    if (isValid) {
      setSubmitButtonText('Добавление...');

      props.onAddPlace({
        name: values.title,
        link: values.url
      })
        .finally(() => {
          setSubmitButtonText('Добавить');
        });
    } else {
      console.log('Форма невалидна, отправка данных отклонена.');
    }
  }

  return (
    <PopupWithForm
      title="Новое место"
      name="add-card"
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
            value={values.title || ''}
            onChange={handleChange}
            placeholder='Название'
            id="title"
            name="title"
            type="text"
            minLength="2"
            maxLength="30"
            required
          />
          <span className="title-error popup__input-error">{errors.title}</span>
        </div>
        <div className="popup__field">
          <input
            className="popup__input"
            value={values.url || ''}
            onChange={handleChange}
            placeholder='Ссылка на картинку'
            id="img-url"
            name="url"
            type="url"
            required
          />
          <span className="img-url-error popup__input-error">{errors.url}</span>
        </div>
      </fieldset>
    </PopupWithForm>
  );
}

export default AddPlacePopup;