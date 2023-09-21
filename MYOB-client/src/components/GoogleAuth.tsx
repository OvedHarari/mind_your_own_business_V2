import { FunctionComponent, useEffect } from "react";
import { getGoogleUser, getTokenDetailes } from "../services/usersService";
import { useNavigate } from "react-router-dom";

interface GoogleAuthProps {
    setUserInfo: Function;

}

const GoogleAuth: FunctionComponent<GoogleAuthProps> = ({ setUserInfo }) => {
    let navigate = useNavigate()
    useEffect(() => {
        const setGoogleAuthUser = async () => {
            await getGoogleUser().then((res) => {
                if (res.data.token) {
                    sessionStorage.setItem("token", JSON.stringify({
                        token: res.data.token
                    }))
                    sessionStorage.setItem("userInfo", JSON.stringify({
                        email: (getTokenDetailes() as any).email,
                        userId: (getTokenDetailes() as any)._id,
                        role: (getTokenDetailes() as any).role,
                        gender: (getTokenDetailes() as any).gender,
                        picture: res.data.user._json.picture
                    }))
                    setUserInfo(JSON.parse(sessionStorage.getItem("userInfo") as string));
                    navigate("/")
                }
            }
            ).catch((err) => console.log((err))
            );
        }
        setGoogleAuthUser();
    }, [navigate, setUserInfo]);
    return (<></>);
}

export default GoogleAuth;