import { useNavigate } from "react-router-dom"
import * as Auth from "../utils/Auth"
import AuthForm from "./AuthForm"

function Register(props) {

  const navigate = useNavigate();

  const handleSubmit = (formValue) => {
    if (formValue.password && formValue.email) {
      const { password, email } = formValue;
      Auth.register(password, email)
        .then((res) => {
          props.handleLoginStatus(true); // Успешный вход
          props.isOpen();
          navigate("/sign-in", { replace: true });
        })
        .catch((err) => {
          console.log('Ошибка при запросе регистрации:', err);
          props.handleLoginStatus(false); // Неудачный вход
          props.isOpen();
        });
    }
  }

  return (
    <AuthForm
      title="Регистрация"
      onSubmit={handleSubmit}
      buttonText="Зарегистрироваться"
      linkText="Уже зарегистрированы?"
      linkTo="/sign-in"
    />
  );
}

export default Register