import { FunctionComponent, useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup"
import { successMsg } from "../services/feedbacksService";
import Card from "../interfaces/Card";
import { getCardById, updateCard } from "../services/cardService";
import { SiteTheme } from "../App";

interface UpdateCardProps {
  onHide: Function;
  render: Function;
  cardId: string;
  cardTitle: string;
}

const UpdateCard: FunctionComponent<UpdateCardProps> = ({ onHide, render, cardId, cardTitle }) => {
  let theme = useContext(SiteTheme);
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
  let formik = useFormik({
    initialValues: {
      title: card.title, subtitle: card.subtitle, description: card.description, phone: card.phone, email: card.email, webSite: card.webSite, businessImage: ({ url: card.businessImage.url, alt: card.businessImage.alt }),
      address: ({ country: card.address.country, state: card.address.state, city: card.address.city, street: card.address.street, houseNumber: card.address.houseNumber, zipcode: card.address.zipcode }), owner: card.owner, bizNumber: card.bizNumber
    },
    validationSchema: yup.object({
      title: yup.string().required().min(2), subtitle: yup.string().required().min(2), description: yup.string().required().min(20),
      phone: yup.string().required().min(2), email: yup.string().required().email(), webSite: yup.string().min(10), businessImage: yup.object({ url: yup.string().min(2), alt: yup.string().min(2) }), address: yup.object({ country: yup.string().required().min(2), state: yup.string().min(2), city: yup.string().required().min(2), street: yup.string().required().min(2), houseNumber: yup.string().required().min(1), zipcode: yup.string().min(2) }),
    }),
    enableReinitialize: true,
    onSubmit(values: Card) {
      try {
        const geocoder = new google.maps.Geocoder();
        const place = `${values.address.country} ${values.address.city} ${values.address.street} ${values.address.houseNumber}`;
        geocoder.geocode({ address: place }, (results: any, status: any) => {
          if (status === "OK" && results![0]) {
            const location = results![0].geometry.location;
            const lat = (location.lat());
            const lng = (location.lng());
            updateCard({ ...values, address: { ...values.address, lat: lat, lng: lng } }, cardId)
              .then((res) => {
                render();
                onHide();
                successMsg(`${cardTitle} Business card was updated successfully`);
              }).catch((err) =>
                console.log(err));
          } else {
            console.error("Geocode was not successful for the following reason: " + status);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  });

  useEffect(() => {
    getCardById(cardId).then((res) => setCard(res.data)).catch((err) => console.log(err))
  }, [cardId]);

  return (<div className={`container ${theme}`}  >
    <form className="form-floating mt-3" onSubmit={formik.handleSubmit}>
      <h6 className=" mt-4 ">General</h6>
      <div className="row g-2 border rounded-4 border-secondary mt-1">
        <div className="form-floating col-6 mb-3 mt-3">
          <input type="text" className="form-control border-secondary" id="floatingTitle" placeholder="Business title"
            name="title"
            onChange={formik.handleChange}
            value={formik.values.title}
            onBlur={formik.handleBlur} ></input>
          <label htmlFor="floatingTitle lable">Business title *</label>
          {formik.touched.title && formik.errors.title && (
            <p className="text-danger">{formik.errors.title}</p>)}
        </div>
        <div className="form-floating col-6 mb-3 mt-3">
          <input type="text" className="form-control border-secondary" id="floatingSubtitle" placeholder="Busines subtitle"
            name="subtitle"
            onChange={formik.handleChange}
            value={formik.values.subtitle}
            onBlur={formik.handleBlur} ></input>
          <label htmlFor="floatingSubtitle">Busines subtitle *</label>
          {formik.touched.subtitle && formik.errors.subtitle && (
            <p className="text-danger">{formik.errors.subtitle}</p>)}
        </div>
        <div className="form-floating col-6 mb-3">
          <input type="text" className="form-control border-secondary" id="floatingDescription" placeholder="Business description"
            name="description"
            onChange={formik.handleChange}
            value={formik.values.description}
            onBlur={formik.handleBlur} ></input>
          <label htmlFor="floatingDescription">Business (short) description *</label>
          {formik.touched.description && formik.errors.description && (
            <p className="text-danger">{formik.errors.description}</p>)}
        </div>
        <div className="form-floating col-6 mb-3">
          <input type="text" className="form-control border-secondary" id="floatingPhone" placeholder="Phone Number"
            name="phone"
            onChange={formik.handleChange}
            value={formik.values.phone}
            onBlur={formik.handleBlur} ></input>
          <label htmlFor="floatingPhone">Phone Number *</label>
          {formik.touched.phone && formik.errors.phone && (
            <p className="text-danger">{formik.errors.phone}</p>)}
        </div>
        <div className="form-floating col-6 mb-3">
          <input type="text" className="form-control border-secondary" id="floatingEmail" placeholder="name@example.com"
            name="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            onBlur={formik.handleBlur} ></input>
          <label htmlFor="floatingEmail">Business email address *</label>
          {formik.touched.email && formik.errors.email && (
            <p className="text-danger">{formik.errors.email}</p>)}
        </div>
        <div className="form-floating col-6">
          <input type="text" className="form-control border-secondary" id="floatingWebSite" placeholder="WebSite"
            name="webSite"
            onChange={formik.handleChange}
            value={formik.values.webSite}
            onBlur={formik.handleBlur} ></input>
          <label htmlFor="floatingWebSite">Website *</label>
          {formik.touched.webSite && formik.errors.webSite && (
            <p className="text-danger">{formik.errors.webSite}</p>)}
        </div>
      </div>
      <h6 className="mt-4">Image</h6>
      <div className="row g-2 border rounded-4 border-secondary mt-1">
        <div className="form-floating col-6 mb-3 mt-3">
          <input
            type="text" className="form-control border-secondary" id="floatingBusinessImgURL" placeholder="Business Image"
            name="businessImage.url"
            onChange={formik.handleChange}
            value={formik.values.businessImage.url}
            onBlur={formik.handleBlur} ></input>
          <label htmlFor="floatingBusinessImgURL">Business Image URL</label>
          {formik.touched.businessImage?.url && formik.errors.businessImage?.url && (
            <p className="text-danger">{formik.errors.businessImage.url}</p>)}
        </div>
        <div className="form-floating col-6 mb-3 mt-3">
          <input
            type="text" className="form-control border-secondary" id="floatingBusinessImgAlt" placeholder="Business Image alternative name"
            name="businessImage.alt"
            onChange={formik.handleChange}
            value={formik.values.businessImage.alt}
            onBlur={formik.handleBlur} ></input>
          <label htmlFor="floatingBusinessImgAlt">Image alternative name</label>
          {formik.touched.businessImage?.alt && formik.errors.businessImage?.alt && (
            <p className="text-danger">{formik.errors.businessImage.alt}</p>)}
        </div>
      </div>
      <h6 className="mt-4">Address</h6>
      <div className="row g-2 border rounded-4 border-secondary mt-1">
        <div className="form-floating col-6 mb-3 mt-3">
          <input type="text" className="form-control border-secondary" id="floatingState" placeholder="State"
            name="address.state"
            onChange={formik.handleChange}
            value={formik.values.address.state}
            onBlur={formik.handleBlur} ></input>
          <label htmlFor="floatingState">State</label>
          {formik.touched.address?.state && formik.errors.address?.state && (
            <p className="text-danger">{formik.errors.address.state}</p>)}
        </div>
        <div className="form-floating col-6 mb-3 mt-3">
          <input type="text" className="form-control border-secondary" id="floatingCountry" placeholder="Country"
            name="address.country"
            onChange={formik.handleChange}
            value={formik.values.address.country}
            onBlur={formik.handleBlur} ></input>
          <label htmlFor="floatingCountry">Country *</label>
          {formik.touched.address?.country && formik.errors.address?.country && (
            <p className="text-danger">{formik.errors.address.country}</p>)}
        </div>
        <div className="form-floating col-6 mb-3">
          <input type="text" className="form-control border-secondary" id="floatingCity" placeholder="City"
            name="address.city"
            onChange={formik.handleChange}
            value={formik.values.address.city}
            onBlur={formik.handleBlur} ></input>
          <label htmlFor="floatingCity">City *</label>
          {formik.touched.address?.city && formik.errors.address?.city && (
            <p className="text-danger">{formik.errors.address.city}</p>)}
        </div>
        <div className="form-floating col-6 mb-3">
          <input type="text" className="form-control border-secondary" id="floatingStreet" placeholder="Street"
            name="address.street"
            onChange={formik.handleChange}
            value={formik.values.address.street}
            onBlur={formik.handleBlur} ></input>
          <label htmlFor="floatingStreet">Street *</label>
          {formik.touched.address?.street && formik.errors.address?.street && (
            <p className="text-danger">{formik.errors.address.street}</p>)}
        </div>
        <div className="form-floating col-6 mb-3">
          <input
            type="text" className="form-control border-secondary" id="floatingHouseNumber" placeholder="House Number"
            name="address.houseNumber"
            onChange={formik.handleChange}
            value={formik.values.address.houseNumber}
            onBlur={formik.handleBlur} ></input>
          <label htmlFor="floatingHouseNumber">House Number *</label>
          {formik.touched.address?.houseNumber && formik.errors.address?.houseNumber && (
            <p className="text-danger">{formik.errors.address.houseNumber}</p>)}
        </div>
        <div className="form-floating col-6 mb-3">
          <input type="text" className="form-control border-secondary" id="floatingZipCode" placeholder="Zip Code"
            name="address.zipcode"
            onChange={formik.handleChange}
            value={formik.values.address.zipcode}
            onBlur={formik.handleBlur} ></input>
          <label htmlFor="floatingZipCode">Zip Code *</label>
          {formik.touched.address?.zipcode && formik.errors.address?.zipcode && (
            <p className="text-danger">{formik.errors.address.zipcode}</p>)}
        </div>
      </div>
      <button className="btn btn-secondary w-100 mt-3" type="submit" disabled={!formik.isValid || !formik.dirty}>Update Card</button>
    </form>
    <div className="row">
      <div className="col-6">
        <button className="btn btn-danger mt-3" onClick={() => onHide()}>Close Without Saving</button>
      </div>
    </div>
  </div>);
}

export default UpdateCard;