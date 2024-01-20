import { useNavigate } from "react-router-dom"
import AuthForm from "./AuthForm"
import * as Auth from "../utils/Auth"

function Login(props) {

  const navigate = useNavigate();

  const handleSubmit = (formValue) => {
    if (formValue.password && formValue.email) {
      const { password, email } = formValue;
      Auth.onLogin(password, email)
        .then((data) => {
          if (data.token) {
            Auth.checkToken(data.token).then((res) => {
              if (res) {
                props.updateEmail(res.data.email);
                props.handleLogin();
                navigate('/', { replace: true });
              }
            });
          }
        })
        .catch(err => {
          console.log('Ошибка при запросе авторизации:', err);
          props.handleLoginStatus(false); // Неудачный вход
          props.isOpen();
        });
    }
  }

  return (
    <AuthForm
      title="Вход"
      onSubmit={handleSubmit}
      buttonText="Войти"
      linkTo="/sign-in"
    />
  );
}

export default Login