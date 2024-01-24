import PopupWithForm from './PopupWithForm';

function ConfirmationPopup(props) {

  const handleSubmit = (e) => {
    e.preventDefault();

    props.onConfirm(props.card);
  };

  return (
    <PopupWithForm
      title={"Вы уверены?"}
      name={"delete-card"}
      button={"Да"}
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      isValid={true}
    >
    </PopupWithForm>
  );
}

export default ConfirmationPopup;