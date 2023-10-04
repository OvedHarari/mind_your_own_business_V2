import { FunctionComponent, useContext } from "react";
import { Modal } from "react-bootstrap";
import { SiteTheme } from "../App";
import BusinessDetails from "./BusinessDetails";


interface BusinessDetailsModalProps {
  show: boolean;
  onHide: Function;
  cardId: string;
  cardTitle: string;
  userInfo: any;
}
const BusinessDetailsModal: FunctionComponent<BusinessDetailsModalProps> = ({ show, onHide, cardId, cardTitle, userInfo }) => {
  let theme = useContext(SiteTheme);

  return (<div
    className="modal show"
    style={{ display: "block", position: "initial" }}  >
    <Modal
      className={`${theme} set-modal`}
      show={show}
      onHide={() => onHide()}
      keyboard={false}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered  >
      <Modal.Header closeButton>
        <Modal.Title className="display-3">{`More About: ${cardTitle}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <BusinessDetails onHide={onHide} cardId={cardId} userInfo={userInfo} />
      </Modal.Body>
    </Modal>
  </div>);
}

export default BusinessDetailsModal;