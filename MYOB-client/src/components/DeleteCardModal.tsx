import { FunctionComponent, useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import { successMsg } from "../services/feedbacksService";
import { deleteCard } from "../services/cardService";
import { SiteTheme } from "../App";

interface DeleteCardModalProps {
  show: boolean;
  onHide: Function;
  cardId: string;
  render: Function;
  cardTitle: string;
}
const DeleteCardModal: FunctionComponent<DeleteCardModalProps> = ({
  show,
  onHide,
  cardId,
  render,
  cardTitle,
}) => {
  let theme = useContext(SiteTheme);
  return (
    <>
      <Modal
        className={`${theme} set-modal`}
        show={show}
        onHide={() => onHide()}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Business Card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <span className="fw-bold"> {cardTitle}</span> business card ?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() =>
              deleteCard(cardId)
                .then((res) => {
                  render();
                  onHide();
                  successMsg(`${cardTitle} business card was deleted successfully!`);
                })
                .catch((err) => console.log(err))
            } >Yes</Button>
          <Button variant="secondary" onClick={() => onHide()}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteCardModal;
