import React, { useState } from "react";
import { handleOffer } from "../state/near";
import { BuyPopUp } from "./BuyPopUp";
import Avatar from "url:../img/Cookie.png";

export const MyOfferInput = ({ token, account, formatNearAmount }) => {
  const [offerPrice, setOfferPrice] = useState("");
  const [feedBack, setFeedBack] = useState("");
  const offerToken = "near";
  const price = formatNearAmount(token?.sale_conditions.near, 4);
  const [loading, setLoading] = useState(false);
  const bid =
    Object.keys(token.bids).length > 0
      ? formatNearAmount(
          Object.entries(token.bids).map(([ft_token_id, ft_token_bids]) =>
            ft_token_bids.filter(
              (element) => element === ft_token_bids[ft_token_bids.length - 1]
            )
          )[0][0].price,
          4
        )
      : 0;

  const handleInputChange = (e) => {
    setOfferPrice(e.target.value);
  };

  const handleBuyClick = (e) => {
    setLoading(true);
    setFeedBack("");
    handleOffer(account, token.token_id, offerToken, price);
  };

  const handleOfferClick = (e) => {
    if (
      (parseFloat(offerPrice) > parseFloat(bid) &&
        parseFloat(offerPrice) < parseFloat(price) &&
        offerPrice !== "") ||
      (parseFloat(offerPrice) > parseFloat(bid) &&
        parseFloat(price) === 0 &&
        offerPrice !== "")
    ) {
      setLoading(true);
      handleOffer(account, token.token_id, offerToken, offerPrice);
    }

    if (offerPrice === "") setFeedBack("You must make an offer");
    else if (parseFloat(offerPrice) <= parseFloat(bid))
      setFeedBack("Offer must be greater than last bid");
    else if (parseFloat(offerPrice) >= parseFloat(price) && price !== "0")
      setFeedBack("Offer must be less than price");
  };

  return (
    <>
      <input
        style={{ borderRadius: "8px 0 0 8px" }}
        type="number"
        inputMode="decimal"
        placeholder="New Offer..."
        value={offerPrice}
        onChange={(e) => handleInputChange(e)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleOfferClick(e);
        }}
      />
      <button
        style={{ borderRadius: "0 8px 8px 0", flexGrow: 1 }}
        className="bl"
        onClick={(e) => handleOfferClick(e)}
      >
        Update
      </button>
      {feedBack !== "" && (
        <BuyPopUp
          handleBuyClick={handleBuyClick}
          price={price}
          setFeedBack={setFeedBack}
          feedBack={feedBack}
        />
      )}
      {loading && (
        <div className="backgroundPopUp2">
          <img src={Avatar} className="cookieSpinner" />
        </div>
      )}
    </>
  );
};
