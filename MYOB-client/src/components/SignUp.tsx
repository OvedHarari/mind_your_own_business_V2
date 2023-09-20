import { useFormik } from "formik";
import { FunctionComponent } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { addUser, getTokenDetailes } from "../services/usersService";
import { errorMsg, successMsg } from "../services/feedbacksService";
import User from "../interfaces/User";

interface SignUpProps {
  setUserInfo: Function;
  passwordShown: boolean;
  togglePassword: Function;
}
const SignUp: FunctionComponent<SignUpProps> = ({ setUserInfo, passwordShown, togglePassword }) => {
  let navigate = useNavigate();

  let formik = useFormik({
    initialValues: {
      name: { firstName: "", middleName: "", lastName: "", }, phone: "", email: "", password: "", gender: "", image: { url: "", alt: "" },
      address: { country: "", state: "", city: "", street: "", houseNumber: "", zipcode: "", },
      role: "casual", isActive: true
    },
    validationSchema: yup.object({
      name: yup.object({ firstName: yup.string().required().min(2), middleName: yup.string().min(2), lastName: yup.string().required().min(2) }),
      phone: yup.string().required().min(8), email: yup.string().required().email(), password: yup.string().required().min(8).matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%#^*?&]{8,}$/, "Password must contain at least 1 uppercase letter, lowercase letter, digit and special character (@$!%*?&#^)"), gender: yup.string().required(), image: yup.object({ url: yup.string().min(2), alt: yup.string().min(2) }), address: yup.object({ country: yup.string().required().min(2), state: yup.string().min(0), city: yup.string().required().min(2), street: yup.string().required().min(2), houseNumber: yup.string().required().min(1), zipcode: yup.string().min(2), }), role: yup.string().min(2),
    }),
    onSubmit: async (values: User) => {
      addUser(values)
        .then((res) => {
          navigate("/");
          sessionStorage.setItem("token", JSON.stringify({
            token: res.data
          }))
          sessionStorage.setItem("userInfo", JSON.stringify({
            email: (getTokenDetailes() as any).email,
            userId: (getTokenDetailes() as any)._id,
            role: (getTokenDetailes() as any).role,
            gender: (getTokenDetailes() as any).gender
          }))
          setUserInfo(JSON.parse(sessionStorage.getItem("userInfo") as string));
          successMsg(`${values.email} was registered and logged in`);
        })
        .catch((err) => {
          if (err.response.data === "User already exist") {
            errorMsg(`${values.email} ${err.response.data}`);
            console.log(err)
          }
          else
            console.log(err)
        });
    },
  });

  return (
    <div className="container mt-5">
      <form className="form-floating signup mb-3 mt-3" onSubmit={formik.handleSubmit}>
        <p className="display-3">Sign Up !</p>
        <h6 className=" mt-4 text-start">General</h6>
        <div className="row g-2 border rounded-4 border-secondary mt-1">
          <div className="form-floating col-6 mb-3 mt-3">
            <input type="text" className="form-control border-secondary " id="floatingFirstName" placeholder="First Name"
              name="name.firstName"
              onChange={formik.handleChange}
              value={formik.values.name.firstName}
              onBlur={formik.handleBlur} ></input>
            <label htmlFor="floatingFirstName">First Name *</label>
            {formik.touched.name?.firstName && formik.errors.name?.firstName && (
              <p className="text-danger">{formik.errors.name.firstName}</p>)}
          </div>
          <div className="form-floating col-6 mb-3 mt-3">
            <input type="text" className="form-control border-secondary" id="floatingMiddleName" placeholder="Middle Name"
              name="name.middleName"
              onChange={formik.handleChange}
              value={formik.values.name.middleName}
              onBlur={formik.handleBlur} ></input>
            <label htmlFor="floatingmiddleName">Middle Name</label>
            {formik.touched.name?.middleName && formik.errors.name?.middleName && (
              <p className="text-danger">{formik.errors.name.middleName}</p>)}
          </div>
          <div className="form-floating col-6 mb-3">
            <input type="text" className="form-control border-secondary" id="floatingLastName" placeholder="Last Name"
              name="name.lastName"
              onChange={formik.handleChange}
              value={formik.values.name.lastName}
              onBlur={formik.handleBlur} ></input>
            <label htmlFor="floatingLastName">Last Name *</label>
            {formik.touched.name?.lastName && formik.errors.name?.lastName && (
              <p className="text-danger">{formik.errors.name.lastName}</p>)}
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
            <label htmlFor="floatingEmail">Email address *</label>
            {formik.touched.email && formik.errors.email && (
              <p className="text-danger">{formik.errors.email}</p>)}
          </div>
          <div className="form-floating col-6">
            <input type={passwordShown ? "text" : "password"} className="form-control border-secondary" id="floatingPassword" placeholder="Password"
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              onBlur={formik.handleBlur}></input>
            <div className="passIcon">
              {passwordShown ? <i className="fa-solid fa-eye-slash passIcon" onClick={() => togglePassword(!passwordShown)}></i> : <i className="fa-solid fa-eye passIcon" onClick={() => togglePassword(!passwordShown)}></i>}
            </div>
            <label htmlFor="floatingPassword">Password *</label>
            {formik.touched.password && formik.errors.password && (
              <p className="text-danger">{formik.errors.password}</p>)}
          </div>
        </div>
        <h6 className="mt-4 text-start">Gander / Image</h6>
        <div className="row g-2 border rounded-4 border-secondary mt-1">
          <div className="form-floating col-6 mb-3 mt-3 ">
            <select className="form-select border-secondary" aria-label="Grnder" id="floatingGender" placeholder="Gender"
              name="gender"
              onChange={formik.handleChange}
              value={formik.values.gender}
              onBlur={formik.handleBlur} >
              <option value=""></option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
            <label className="lable" htmlFor="floatingGender">Gender *</label>
            {formik.touched.gender && formik.errors.gender && (
              <p className="text-danger">{formik.errors.gender}</p>)}
          </div>
          <div className="form-floating col-6 mb-3 mt-3">
            <input
              type="text" className="form-control border-secondary" id="floatingUserImgURL" placeholder="User Image URL"
              name="image.url"
              onChange={formik.handleChange}
              value={formik.values.image.url}
              onBlur={formik.handleBlur} ></input>
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
              onBlur={formik.handleBlur} ></input>
            <label htmlFor="floatingState">State</label>
            {formik.touched.address?.state && formik.errors.address?.state && (<p className="text-danger">{formik.errors.address.state}</p>)}
          </div>
          <div className="form-floating col-6 mb-3 mt-3">
            <input type="text" className="form-control border-secondary" id="floatingCountry" placeholder="Country"
              name="address.country"
              onChange={formik.handleChange}
              value={formik.values.address.country}
              onBlur={formik.handleBlur} ></input>
            <label htmlFor="floatingCountry">Country *</label>
            {formik.touched.address?.country && formik.errors.address?.country && (<p className="text-danger">{formik.errors.address.country}</p>)}
          </div>
          <div className="form-floating col-6 mb-3">
            <input type="text" className="form-control border-secondary" id="floatingCity" placeholder="City"
              name="address.city"
              onChange={formik.handleChange}
              value={formik.values.address.city}
              onBlur={formik.handleBlur} ></input>
            <label htmlFor="floatingCity">City *</label>
            {formik.touched.address?.city && formik.errors.address?.city && (<p className="text-danger">{formik.errors.address.city}</p>)}
          </div>
          <div className="form-floating col-6 mb-3">
            <input type="text" className="form-control border-secondary" id="floatingStreet" placeholder="Street"
              name="address.street"
              onChange={formik.handleChange}
              value={formik.values.address.street}
              onBlur={formik.handleBlur} ></input>
            <label htmlFor="floatingStreet">Street *</label>
            {formik.touched.address?.street && formik.errors.address?.street && (<p className="text-danger">{formik.errors.address.street}</p>)}
          </div>
          <div className="form-floating col-6 mb-3">
            <input
              type="text" className="form-control border-secondary" id="floatingHouseNumber" placeholder="House Number"
              name="address.houseNumber"
              onChange={formik.handleChange}
              value={formik.values.address.houseNumber}
              onBlur={formik.handleBlur} ></input>
            <label htmlFor="floatingHouseNumber">House Number *</label>
            {formik.touched.address?.houseNumber && formik.errors.address?.houseNumber && (<p className="text-danger">{formik.errors.address.houseNumber}</p>)}
          </div>
          <div className="form-floating col-6 mb-3">
            <input
              type="text"
              className="form-control border-secondary" id="floatingZipCode" placeholder="Zip code"
              name="address.zipcode"
              onChange={formik.handleChange}
              value={formik.values.address.zipcode}
              onBlur={formik.handleBlur} ></input>
            <label htmlFor="floatingZipCode">Zip Code *</label>
            {formik.touched.address?.zipcode && formik.errors.address?.zipcode && (<p className="text-danger">{formik.errors.address.zipcode}</p>)}
          </div>
          <div className="form-check ms-3 text-start fw-bold">
            <input className="form-check-input" type="checkbox" id="roleCheckbox" name="role"
              checked={formik.values.role === "business"}
              onChange={(e) => { formik.setFieldValue("role", e.target.checked ? "business" : "user"); }}
              onBlur={formik.handleBlur} />
            <label className="form-check-label " htmlFor="roleCheckbox">
              SignUp as Business !!!
            </label>
            {formik.touched.role && formik.errors.role && (<p className="text-danger">{formik.errors.role}</p>)}
          </div>
        </div>
        <button className="btn btn-secondary w-100 mt-3" type="submit" disabled={!formik.isValid || !formik.dirty}>SignUp</button>
      </form>
      <label className="form-check-label" htmlFor="form2Example3">
        Already signed up? <br />
        <Link to={"/signin"}>Click here to SignIn</Link>
      </label>
    </div>
  );
};
export default SignUp;

