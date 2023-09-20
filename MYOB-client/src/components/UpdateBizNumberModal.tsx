import { FunctionComponent, useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { errorMsg, successMsg } from "../services/feedbacksService";
import { SiteTheme } from "../App";
import { useFormik } from "formik";
import * as yup from "yup"
import Card from "../interfaces/Card";
import { getCardById, updateCardProps } from "../services/cardService";

interface UpdateBizNumberModalProps {
  show: boolean;
  onHide: Function;
  render: Function;
  cardId: string;
  bizNumber: number

}

const UpdateBizNumberModal: FunctionComponent<UpdateBizNumberModalProps> = ({
  show, onHide, render, cardId, bizNumber

}) => {
  let [card, setCard] = useState<Card>(
    {
      title: "",
      subtitle: "",
      description: "",
      phone: "",
      email: "",
      webSite: "",
      businessImage: {
        url: "",
        alt: "",
      },
      address: {
        country: "",
        state: "",
        city: "",
        street: "",
        houseNumber: "",
        zipcode: ""
      },
      bizNumber: 0

    })

  let theme = useContext(SiteTheme);
  let formik = useFormik({
    initialValues: {
      bizNumber: bizNumber
    },
    validationSchema: yup.object({
      bizNumber: yup.number().required().min(7)
    }),
    enableReinitialize: true,
    onSubmit(value: any) {
      updateCardProps(cardId, "bizNumber", value.bizNumber)
        .then((res) => {
          render();
          onHide();
          successMsg(`${card.title} business No. successfully changed to ${value}`)
        })
        .catch((err) => {
          console.log(err)
          errorMsg(err.response.data)
        })

    }
  })

  useEffect(() => {
    getCardById(cardId).then((res) => setCard(res.data)).catch((err) => console.log(err))
  }, [cardId]);

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
          <Modal.Title>Update Business No.</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form action="" onSubmit={formik.handleSubmit}>
            <div className="container">
              <div className="form-control col-6 mb-3 mt-3">
                <label htmlFor="floatingTitle lable" className="form-label ms-1">New Business No. :</label>
                <input type="number" className="form-control border-secondary mb-2" id="floatingTitle" placeholder="Business Number"
                  name="bizNumber"
                  onChange={formik.handleChange}
                  value={formik.values.bizNumber}
                  onBlur={formik.handleBlur} ></input>

                {formik.touched.bizNumber && formik.errors.bizNumber && (
                  <p className="text-danger">{formik.errors.bizNumber as string}</p>)}
              </div>
              <Button
                variant="secondary"
                type="submit"
              >Save</Button>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>

          <Button variant="danger" onClick={() => onHide()}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdateBizNumberModal;
