import React, { useState } from 'react'
import { handleOffer } from '../state/near';

export const MyOfferInput = ({token,account,formatNearAmount}) => {
    
    const [offerPrice, setOfferPrice] = useState('');
	const offerToken='near';
	const price = formatNearAmount(token?.sale_conditions.near,4);
	const [btnClass, setBtnClass] = useState( price>0 ? 'btnBuy' : 'btnOffer' );
	const bid = Object.keys(token.bids).length > 0 ? formatNearAmount(Object.entries(token.bids).map(([ft_token_id, ft_token_bids]) => ft_token_bids.filter(element=>element===ft_token_bids[ft_token_bids.length-1]))[0][0].price,4) : 0 ;


    const handleInputChange = (e) => {
		
		( price!== '0' && (e.target.value === '' || e.target.value === price) ) ? setBtnClass('btnBuy') : setBtnClass('btnOffer') ; 
		
		setOfferPrice(e.target.value)
	
	}

	const handleOfferClick = (e) =>{

		if(parseFloat(offerPrice) > parseFloat(bid) && price === '0' 
		|| parseFloat(offerPrice) > parseFloat(bid) && parseFloat(offerPrice) <= parseFloat(price)){
			handleOffer(account, token.token_id, offerToken, offerPrice );
		}
		
		if (parseFloat(offerPrice) <= 0) console.log("offer must be greater than 0");
		else if (parseFloat(offerPrice) <= parseFloat(bid)) console.log("offer must be greater than last bid");
		else if (parseFloat(offerPrice) > parseFloat(price) && price !== '0') console.log("offer must be equal or less than price");
        else if (offerPrice === "") console.log("offer must be a number")

	}

    return (
        <>
            <input type="number" placeholder="New Offer..." value={offerPrice} onChange={(e) => handleInputChange(e)} />
            <button className="ml-1" onClick={e => handleOfferClick(e)}>Update</button>  
        </>
    )
}
