import { FunctionComponent } from "react";
import { updateUser } from "../services/usersService";
import User from "../interfaces/User";
import { useFormik } from "formik";
import * as yup from "yup";
import { successMsg } from "../services/feedbacksService";

interface UserProfileProps {
  userInfo: any;
  onHide: Function;
  setUserProfile: Function;
  userProfile: any;
  editForm: boolean;
  setEditForm: Function;
  render: Function;
  togglePassword: Function;
  passwordShown: boolean;
}
const UserProfile: FunctionComponent<UserProfileProps> = ({ onHide, userProfile, editForm, setEditForm, render, togglePassword, passwordShown }) => {
  let formik = useFormik({
    initialValues: {
      name: { firstName: userProfile.name.firstName, middleName: userProfile.name.middleName, lastName: userProfile.name.lastName }, phone: userProfile.phone, email: userProfile.email,
      // password: userProfile.password,
      gender: userProfile.gender, image: { url: userProfile.image.url }, address: { country: userProfile.address.country, state: userProfile.address.state, city: userProfile.address.city, street: userProfile.address.street, houseNumber: userProfile.address.houseNumber, zipcode: userProfile.address.zipcode }, role: userProfile.role, isActive: userProfile.isActive
    },
    validationSchema: yup.object({
      name: yup.object({ firstName: yup.string().required().min(2), middleName: yup.string().min(2), lastName: yup.string().required().min(2) }),
      phone: yup.string().required().min(2), email: yup.string().required().email(),
      // password: yup.string().required().min(8).matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%#^*?&]{8,}$/, "Password must contain at least 1 uppercase letter, lowercase letter, digit and special character (@$!%*?&#^)"),
      gender: yup.string().required(), image: yup.object({ url: yup.string().min(2) }), address: yup.object({ country: yup.string().required().min(2), state: yup.string().min(2), city: yup.string().required().min(2), street: yup.string().required().min(2), houseNumber: yup.string().required().min(2), zipcode: yup.string().min(2) }), role: yup.string().min(2)
    }),
    enableReinitialize: true,
    onSubmit(values: User) {
      updateUser(values, userProfile._id)
        .then((res) => {
          setEditForm(true)
          onHide();
          render();
          successMsg(`Changes where saved for user ${values.email}`);
        })
        .catch((err) => console.log(err));
    },
  });
  return <>
    <div className="row g-0">
      <div className="col-md-4">
      </div>
      <div className="container">
        <form className="form-floating  mt-3" onSubmit={formik.handleSubmit}>
          <h6 className=" mt-4 text-start">General</h6>
          <div className="row g-2 border rounded-4 border-secondary mt-1">
            <div className="form-floating col-6 mb-3 mt-3">
              <input type="text" className="form-control border-secondary " id="floatingFirstName" placeholder="First Nane"
                name="name.firstName"
                onChange={formik.handleChange}
                value={formik.values.name.firstName}
                onBlur={formik.handleBlur}
                disabled={editForm} ></input>
              <label htmlFor="floatingFirstName">First Name *</label>
              {formik.touched.name?.firstName && formik.errors.name?.firstName && (<p className="text-danger">{formik.errors.name.firstName}</p>)}
            </div>
            <div className="form-floating col-6 mb-3 mt-3">
              <input type="text" className="form-control border-secondary" id="floatingMiddleName" placeholder="Middle Name"
                name="name.middleName"
                onChange={formik.handleChange}
                value={formik.values.name.middleName}
                onBlur={formik.handleBlur} disabled={editForm}></input>
              <label htmlFor="floatingmiddleName">Middle Name</label>
              {formik.touched.name?.middleName && formik.errors.name?.middleName && (<p className="text-danger">{formik.errors.name.middleName}</p>)}
            </div>
            <div className="form-floating col-6 mb-3">
              <input type="text" className="form-control border-secondary" id="floatingLastName" placeholder="Last Name"
                name="name.lastName"
                onChange={formik.handleChange}
                value={formik.values.name.lastName}
                onBlur={formik.handleBlur} disabled={editForm}></input>
              <label htmlFor="floatingLastName">Last Name *</label>
              {formik.touched.name?.lastName && formik.errors.name?.lastName && (<p className="text-danger">{formik.errors.name.lastName}</p>)}
            </div>
            <div className="form-floating col-6 mb-3">
              <input type="text" className="form-control border-secondary" id="floatingPhone" placeholder="Phone Number"
                name="phone"
                onChange={formik.handleChange}
                value={formik.values.phone}
                onBlur={formik.handleBlur} disabled={editForm}></input>
              <label htmlFor="floatingPhone">Phone Number *</label>
              {formik.touched.phone && formik.errors.phone && (<p className="text-danger">{formik.errors.phone}</p>)}
            </div>
            <div className="form-floating col-6 mb-3">
              <input type="text" className="form-control border-secondary" id="floatingEmail" placeholder="name@example.com"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                onBlur={formik.handleBlur} disabled={editForm}></input>
              <label htmlFor="floatingEmail">Email address *</label>
              {formik.touched.email && formik.errors.email && (<p className="text-danger">{formik.errors.email}</p>)}
            </div>
            {/* <div className="form-floating col-6">
              <input type={passwordShown ? "text" : "password"} className="form-control border-secondary" id="floatingPassword" placeholder="Password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                onBlur={formik.handleBlur} disabled={editForm}></input>
              <div className="passIcon">
                {passwordShown ? <i className="fa-solid fa-eye-slash passIcon" onClick={() => togglePassword(!passwordShown)}></i> : <i className="fa-solid fa-eye passIcon" onClick={() => togglePassword(!passwordShown)}></i>}
              </div>
              <label htmlFor="floatingPassword">Password *</label>
              {formik.touched.password && formik.errors.password && (<p className="text-danger">{formik.errors.password}</p>)}
            </div> */}
          </div>
          <h6 className="mt-4 text-start">Gander / Image</h6>
          <div className="row g-2 border rounded-4 border-secondary mt-1">
            <div className="form-floating col-6 mb-3 mt-3 ">
              <select className="form-select border-secondary" aria-label="Grnder" id="floatingGender" placeholder="Gender"
                name="gender"
                onChange={formik.handleChange}
                value={formik.values.gender}
                onBlur={formik.handleBlur}
                disabled={editForm}>
                <option value=""></option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
              <label className="lable" htmlFor="floatingGender">Gender *</label>
              {formik.touched.gender && formik.errors.gender && (<p className="text-danger">{formik.errors.gender}</p>)}
            </div>
            <div className="form-floating col-6 mb-3 mt-3">
              <input
                type="text" className="form-control border-secondary" id="floatingUserImgURL" placeholder="User Image URL"
                name="image.url"
                onChange={formik.handleChange}
                value={formik.values.image.url}
                onBlur={formik.handleBlur} disabled={editForm}></input>
              <label htmlFor="floatingUserImgURL">User Image URL</label>
              {formik.touched.image?.url && formik.errors.image?.url && (<p className="text-danger">{formik.errors.image.url}</p>)}
            </div>
          </div>
          <h6 className="mt-4 text-start">Address</h6>
          <div className="row g-2 border rounded-4 border-secondary mt-1">
            <div className="form-floating col-6 mb-3 mt-3">
              <input type="text" className="form-control border-secondary" id="floatingState" placeholder="State"
                name="address.state"
                onChange={formik.handleChange}
                value={formik.values.address.state}
                onBlur={formik.handleBlur} disabled={editForm}></input>
              <label htmlFor="floatingState">State</label>
              {formik.touched.address?.state && formik.errors.address?.state && (<p className="text-danger">{formik.errors.address.state}</p>)}
            </div>
            <div className="form-floating col-6 mb-3 mt-3">
              <input type="text" className="form-control border-secondary" id="floatingCountry" placeholder="Country"
                name="address.country"
                onChange={formik.handleChange}
                value={formik.values.address.country}
                onBlur={formik.handleBlur} disabled={editForm}></input>
              <label htmlFor="floatingCountry">Country *</label>
              {formik.touched.address?.country && formik.errors.address?.country && (<p className="text-danger">{formik.errors.address.country}</p>)}
            </div>
            <div className="form-floating col-6 mb-3">
              <input type="text" className="form-control border-secondary" id="floatingCity" placeholder="City"
                name="address.city"
                onChange={formik.handleChange}
                value={formik.values.address.city}
                onBlur={formik.handleBlur} disabled={editForm}></input>
              <label htmlFor="floatingCity">City *</label>
              {formik.touched.address?.city && formik.errors.address?.city && (<p className="text-danger">{formik.errors.address.city}</p>)}
            </div>
            <div className="form-floating col-6 mb-3">
              <input type="text" className="form-control border-secondary" id="floatingStreet" placeholder="Street"
                name="address.street"
                onChange={formik.handleChange}
                value={formik.values.address.street}
                onBlur={formik.handleBlur} disabled={editForm}></input>
              <label htmlFor="floatingStreet">Street *</label>
              {formik.touched.address?.street && formik.errors.address?.street && (<p className="text-danger">{formik.errors.address.street}</p>)}
            </div>
            <div className="form-floating col-6 mb-3">
              <input
                type="text" className="form-control border-secondary" id="floatingHouseNumber" placeholder="House Number"
                name="address.houseNumber"
                onChange={formik.handleChange}
                value={formik.values.address.houseNumber}
                onBlur={formik.handleBlur} disabled={editForm}></input>
              <label htmlFor="floatingHouseNumber">House Number *</label>
              {formik.touched.address?.houseNumber && formik.errors.address?.houseNumber && (<p className="text-danger">{formik.errors.address.houseNumber}</p>)}
            </div>
            <div className="form-floating col-6 mb-3">
              <input
                type="text"
                className="form-control border-secondary" id="floatingZipCode" placeholder="Zip Code"
                name="address.zipcode"
                onChange={formik.handleChange}
                value={formik.values.address.zipcode}
                onBlur={formik.handleBlur} disabled={editForm}></input>
              <label htmlFor="floatingZipCode">Zip Code *</label>
              {formik.touched.address?.zipcode && formik.errors.address?.zipcode && (
                <p className="text-danger">{formik.errors.address.zipcode}</p>)}
            </div>
          </div>
          <button className="btn btn-secondary w-100 mt-3" type="submit" disabled={!formik.isValid || !formik.dirty}>Save Changes</button>
        </form>
        <div className="col-6">
          <button className="btn btn-danger mt-3" onClick={() => { onHide(); setEditForm(true) }}>Close Without Saving</button>
        </div>
      </div>
    </div>
  </>
};

export default UserProfile;