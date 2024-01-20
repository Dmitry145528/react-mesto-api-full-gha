import { Link } from "react-router-dom"
import { useFormAndValidation } from "../hooks/useFormAndValidation"
import { useEffect } from "react"

function AuthForm({ title, onSubmit, buttonText, linkText, linkTo }) {
  const { values, handleChange, errors, isValid, resetForm } = useFormAndValidation();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isValid) {
      onSubmit(values);
    } else {
      console.log('Форма невалидна, отправка данных отклонена.');
    }
  };

  // Сброс полей при монтировании компонента
  useEffect(() => {
    resetForm();
  }, [resetForm]);

  return (
    <main className="auth">
      <h2 className="popup__header auth__header">{title}</h2>
      <form className="auth__form" onSubmit={handleSubmit}>
        <fieldset className="popup__contact-info auth__contact-info">
          <div className="auth__field">
            <input
              className="popup__input auth__input"
              value={values.email || ''}
              onChange={handleChange}
              id="email"
              placeholder="Email"
              name="email"
              type="email"
              required
            />
            <span className="email-error popup__input-error">{errors.email}</span>
          </div>
          <div className="auth__field">
            <input
              className="popup__input auth__input"
              value={values.password || ''}
              onChange={handleChange}
              id="password"
              placeholder="Пароль"
              name="password"
              type="password"
              minLength="5"
              required
            />
            <span className="password-error popup__input-error">{errors.password}</span>
          </div>
        </fieldset>
        <button className={`popup__button auth__button ${isValid ? '' : 'popup__button_disabled'}`} aria-label={`Кнопка с надписью ${buttonText}`} disabled={!isValid}>
          {buttonText}
        </button>
      </form>
      {linkText && (
        <p className="auth__caption">
          {linkText} <Link className="auth__caption-link" to={linkTo}>Войти</Link>
        </p>
      )}
    </main>
  );
}

export default AuthForm;