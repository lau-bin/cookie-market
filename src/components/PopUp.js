import React, { useState } from 'react'
import { handleAcceptOffer } from '../state/actions';
import { handleOffer, token2symbol } from '../state/near'
import { formatAccountId } from '../utils/near-utils'

export const PopUp = ({setPopUp,popUp,formatNearAmount,accountId,account}) => {
    
    const [offerPrice, setOfferPrice] = useState('');
	const offerToken='near';

    return (
        <div 
			onClick={(e)=>{e.target.classList.contains('backgroundPopUp') && setPopUp({show:false,token:null})}}
          	className="backgroundPopUp" 
          	tabIndex={-1}
        >
          	<div 
            className="popUp"
		  		
			>
				<img src={popUp.token.media} />
				<div className="cookieInfo">
					<div className="frame1">
						<div className="frameMetaInfoe1">
								{popUp.token && Object.entries(popUp.token?.sale_conditions).map(([ft_token_id, price]) =>
									<span className="cost" key={ft_token_id}>
										{price === '0' ? 'open' : formatNearAmount(price, 4)} {token2symbol[ft_token_id]}
									</span>
								)}
							<div className="owner">
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#D18436" className="bi bi-person-circle" viewBox="0 0 16 16">
									<path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
									<path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
								</svg>
								<span>{popUp.token?.accountId !== popUp.token?.owner_id ? `${formatAccountId(popUp.token?.owner_id)}` : `You`}</span>
							</div>
						</div>
						<div className="information">
							<span>Token name</span>
						</div>
					</div>
					<div>
						{accountId.length > 0 && accountId !== popUp.token.owner_id && 
							<>
								<div>
									<button onClick={() => handleOffer(account, popUp.token.token_id, offerToken, offerPrice)}>Offer</button>
								</div>
								<div>
									<input type="number" placeholder="Price" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} />
								</div>
								</>
						}
						{Object.keys(popUp.token.bids).length > 0 && 
							<>
								<h4>Offers</h4>
								{
									Object.entries(popUp.token.bids).map(([ft_token_id, ft_token_bids]) => ft_token_bids.map(({ owner_id: bid_owner_id, price }) => <div className="offers" key={ft_token_id}>
										<div>
											{price === '0' ? 'open' : formatNearAmount(price, 4)} - {token2symbol[ft_token_id]} by {bid_owner_id}
										</div>
										{
											accountId === popUp.token.owner_id &&
											<button onClick={() => handleAcceptOffer(account, popUp.token.token_id, ft_token_id)}>Accept</button>
										}
									</div>) )
								}
							</>
						}
					</div>
				</div>
			</div>	
		</div>
    )
}
