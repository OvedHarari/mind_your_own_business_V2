import { FunctionComponent, useContext, useEffect, useState } from "react";
import { SiteTheme } from "../App";
import { Link } from "react-router-dom";
import Card from "../interfaces/Card";
import { getCards } from "../services/cardService";
import NewCardModal from "./NewCardModal";
import DeleteCardModal from "./DeleteCardModal";
import UpdateCardModal from "./UpdateCardModal";
import { addRemoveFavorites, getFavorites } from "../services/favoritesService";
import { successMsg } from "../services/feedbacksService";
import BusinessDetailsModal from "./BusinessDetailsModal";

interface BcardsProps {
  userInfo: any;
}

const Bcards: FunctionComponent<BcardsProps> = ({ userInfo
}) => {
  let theme = useContext(SiteTheme);
  let [cards, setCards] = useState<Card[]>([]);
  let [openNewCardModal, setOpenNewCardModal] = useState<boolean>(false);
  let [openDeleteCardModal, setOpenDeleteCardModal] = useState<boolean>(false);
  let [openUpdateCardModal, setOpenUpdateCardModal] = useState<boolean>(false);
  let [openBusinessDetailsModal, setOpenBusinessDetailsModal] = useState<boolean>(false);
  let [cardId, setCardId] = useState<string>("");
  let [cardTitle, setCardTitle] = useState<string>("");
  let [dataUpdated, setDataUpdated] = useState<boolean>(false);
  let [favorites, setFavorites] = useState<string[]>([])
  let render = () => setDataUpdated(!dataUpdated);
  let handleAddToFavorites = (card: Card) => {
    if (favorites.includes(card._id as string)) {
      addRemoveFavorites(card._id as string)
        .then((res) => {
          setFavorites(favorites.filter((id) => id !== card._id));
          successMsg(`${card.title} business card was removed from favorites!`);
        })
        .catch((err) => { console.log(err); });
    } else {
      addRemoveFavorites(card._id as string)
        .then((res) => {
          setFavorites([...favorites, card._id as string]);
          successMsg(`${card.title} business card was added to favorites!`);
        })
        .catch((err) => { console.log(err); });
    }
  };

  useEffect(() => {
    if (userInfo.userId) {
      getFavorites(userInfo.userId)
        .then((res) => {
          let defaultCardIds: string[] = res.data?.cards.map((card: any) => card._id) || [];
          setFavorites(defaultCardIds);
        })
        .catch((err) => console.log(err));
    }
    getCards().then((res) => setCards(res.data)).catch((err) => console.log(err));
  }, [dataUpdated, userInfo.userId]);

  return (
    <div className={`container mt-3 bCard ${theme}`}>
      <h1 className="display-1  fw-bold">
        <img
          src="/mindYourOwnBusiness_LOGO.png"
          alt="Mind Your Own Business logo"
          width="70"
          height="64"
        ></img>
        Mind Your Own Business
      </h1>
      <h5 className="display-6">The platform that connects businesses with customers in a user-friendly way.</h5>
      <div className="text-end mb-2">
        {(userInfo.role === "business" || userInfo.role === "admin") && (
          <Link
            to=""
            className="btn btn-secondary rounded-circle position-fixed bottom-0 end-0 mb-5 mx-5"
            onClick={() => setOpenNewCardModal(true)}
          >
            <i className="fa-solid fa-plus fs-1 fw-normal"></i>
          </Link>
        )}
      </div>
      {cards.length ? (
        <div className="container">
          <div className="row">
            {cards.map((card: Card) => (
              <div
                key={card._id}
                className="card col-md-4 mx-3 mt-4 shadow"
                style={{ width: "18rem" }}  >
                <div className="cardImgDiv mt-3 rounded-3">
                  <img
                    src={card.businessImage.url}
                    className="card-img-top cardImg "
                    alt={card.businessImage.alt}
                    style={{ width: "16.5rem", height: "16.5rem" }}
                    onClick={() => {
                      setCardId(card._id as string);
                      setCardTitle(card.title);
                      setOpenBusinessDetailsModal(true);
                    }}
                  />
                </div>
                <div className="card-body">
                  <h4 className="card-subtitle mb-2 text-muted">
                    {card.title}
                  </h4>
                  <h5 className="card-title">{card.subtitle}</h5>
                  <p className="card-text mb-4">{card.description}</p>
                  <div className="cardIcons">
                    <div className="row">
                      {(userInfo.email === card.owner ||
                        userInfo.role === "admin") && (

                          <div className="col left-icons text-start">
                            <Link
                              to=""
                              className="btn col"
                              onClick={() => {
                                setCardId(card._id as string);
                                setCardTitle(card.title);
                                setOpenDeleteCardModal(true);
                              }}
                            >
                              <i className="fa-solid fa-trash"></i>
                            </Link>
                            <Link
                              to=""
                              className="btn col"
                              onClick={() => {
                                setCardId(card._id as string);
                                setCardTitle(card.title);
                                setOpenUpdateCardModal(true);
                              }}
                            >
                              <i className="fa-solid fa-pen-to-square"></i>
                            </Link>
                          </div>
                        )}
                      <div className="col right-icons text-end">
                        <Link
                          to={`tel:${card.phone}`}
                          className="btn col"
                        >
                          <i className="fa-solid fa-phone"></i>
                        </Link>
                        {userInfo.email && (favorites.includes(card._id as string) ? (
                          <Link to="" className="btn col text-danger" onClick={() => {
                            handleAddToFavorites(card);
                          }}    >
                            <i className="fa-solid fa-heart"></i>
                          </Link>
                        ) : (
                          <Link to="" className="btn col" onClick={() => { handleAddToFavorites(card); }}    >
                            <i className="fa-solid fa-heart"></i>
                          </Link>)
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No cards</p>
      )}
      <NewCardModal
        show={openNewCardModal}
        onHide={() => setOpenNewCardModal(false)}
        render={render}
        userInfo={userInfo}
      />
      <DeleteCardModal
        show={openDeleteCardModal}
        onHide={() => setOpenDeleteCardModal(false)}
        render={render}
        cardId={cardId}
        cardTitle={cardTitle}
      />
      <UpdateCardModal
        show={openUpdateCardModal}
        onHide={() => setOpenUpdateCardModal(false)}
        render={render}
        cardId={cardId}
        cardTitle={cardTitle}
      />
      <BusinessDetailsModal
        show={openBusinessDetailsModal}
        onHide={() => setOpenBusinessDetailsModal(false)}
        cardId={cardId}
        cardTitle={cardTitle}
      />
    </div>
  );
};

export default Bcards;
