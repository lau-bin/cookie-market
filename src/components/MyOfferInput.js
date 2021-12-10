import React, { useState } from 'react'
import { handleOffer } from '../state/near';
import { BuyPopUp } from './BuyPopUp';
import Avatar from 'url:../img/Cookie.png';

export const MyOfferInput = ({token,account,formatNearAmount}) => {
    
    const [offerPrice, setOfferPrice] = useState('');
	const [feedBack, setFeedBack] = useState("");
	const offerToken='near';
	const price = formatNearAmount(token?.sale_conditions.near,4);
	const [loading, setLoading] = useState(false);
	const bid = Object.keys(token.bids).length > 0 ? formatNearAmount(Object.entries(token.bids).map(([ft_token_id, ft_token_bids]) => ft_token_bids.filter(element=>element===ft_token_bids[ft_token_bids.length-1]))[0][0].price,4) : 0 ;


    const handleInputChange = (e) => {
		setOfferPrice(e.target.value)
	}

	const handleBuyClick = e => {
		setLoading(true);
		setFeedBack('');
		handleOffer(account, token.token_id, offerToken, price );
	}

	const handleOfferClick = (e) =>{

		if(parseFloat(offerPrice) > parseFloat(bid) && parseFloat(offerPrice) < parseFloat(price) && offerPrice !== ''  ){
			setLoading(true);
			handleOffer(account, token.token_id, offerToken, offerPrice );
		}
		

		if (offerPrice === "") setFeedBack("you must make an offer");
		else if (parseFloat(offerPrice) <= parseFloat(bid)) setFeedBack("offer must be greater than last bid");
		else if (parseFloat(offerPrice) >= parseFloat(price) && price !== '0') setFeedBack("offer must be less than price");	
		
	}

    return (
        <>
            <input type="number" placeholder="New Offer..." value={offerPrice} onChange={(e) => handleInputChange(e)} />
            <button className="ml-1" onClick={e => handleOfferClick(e)}>Update</button>
			{feedBack!=="" && <BuyPopUp handleBuyClick={handleBuyClick} price={price} setFeedBack={setFeedBack} feedBack={feedBack}/>}
			{loading && <div className='backgroundPopUp2'><img src={Avatar} className="cookieSpinner"/></div>}
        </>
    )
}
