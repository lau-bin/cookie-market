import React, { useEffect, useState } from 'react'
import { handleAcceptOffer } from '../state/actions';
import { handleOffer, token2symbol } from '../state/near'
import { formatAccountId } from '../utils/near-utils'
import Avatar from 'url:../img/Cookie.png';
import { BuyPopUp } from './BuyPopUp';

export const PopUp = ({setPopUp,popUp,formatNearAmount,accountId,account}) => {
	
	const [show, setShow] = useState(true)
    const [offerPrice, setOfferPrice] = useState('');
	const [feedBack, setFeedBack] = useState("")
	const offerToken='near';
	const price = formatNearAmount(popUp.token?.sale_conditions.near,4);
	const bid = Object.keys(popUp.token.bids).length > 0 ? formatNearAmount(Object.entries(popUp.token.bids).map(([ft_token_id, ft_token_bids]) => ft_token_bids.filter(element=>element===ft_token_bids[ft_token_bids.length-1]))[0][0].price,4) : 0 ;

	const [animation, setAnimation] = useState(false)

	const handleInputChange = (e) => {
		setOfferPrice(e.target.value)
	}

	const handleBuyClick = e => {
		setShow(show=>!show);
			handleOffer(account, popUp.token.token_id, offerToken, price );
	}
	
	useEffect(() => {
		animation && setTimeout(() => {
			setPopUp({show:false,token:null})
		},300); 
	}, [animation])

	const handleOfferClick = (e) =>{

		if(parseFloat(offerPrice) > parseFloat(bid) && price === '0' && offerPrice !== '' 
		|| parseFloat(offerPrice) > parseFloat(bid) && parseFloat(offerPrice) < parseFloat(price) && offerPrice !== ''  
		){
			setShow(show=>!show);
			handleOffer(account, popUp.token.token_id, offerToken, offerPrice );
		}
		

		if (offerPrice === "") setFeedBack("You must make an offer");
		else if (parseFloat(bid) === 0 && parseFloat(offerPrice) <= 0) setFeedBack("Offer must be greater than 0");
		else if (parseFloat(offerPrice) <= parseFloat(bid)) setFeedBack("Offer must be greater than last bid");
		else if (parseFloat(offerPrice) >= parseFloat(price) && price !== '0') setFeedBack("Offer must be less than price");	
		
	}

    return (
        <div 
			onClick={(e)=>{e.target.classList.contains('backgroundPopUp') && setAnimation(true)}}
			className={animation? "backgroundPopUp exit-popup":"backgroundPopUp show-popup"}	
          	tabIndex={-1}
        >
          	{show &&
				<div 
				className="popUp"	
				>
					<img src={popUp.token.media} />
					<div className="cookieInfo">
						<div >
							<div className="frameMetaInfoe1">
									{popUp.token && Object.entries(popUp.token?.sale_conditions).map(([ft_token_id, price]) =>
										<span className="cost" key={ft_token_id} style={{marginRight:"10px",fontWeight:"bolder"}}>
											{price === '0' ? 'open' : formatNearAmount(price, 4)} {token2symbol[ft_token_id]}
										</span>
									)}
								
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#915731" className="bi bi-person-circle" viewBox="0 0 16 16">
										<path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
										<path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
									</svg>
									<span style={{color:"#915731",fontSize:"12px",fontWeight:"bolder",marginLeft:"5px"}}  >{popUp.token?.accountId !== popUp.token?.owner_id ? `${formatAccountId(popUp.token?.owner_id,17)}` : `Your NFT`}</span>
								
							</div>
							<div className="information">
								<span>Token name</span>
							</div>
						</div>
						<div>
							{accountId.length > 0 && accountId !== popUp.token.owner_id && 
								<div style={{display:"flex",flexDirection:"column"}}>
									{parseFloat(price) > 0 && <>
										<button style={{width:"100%",margin:"0 !important"}} onClick={ e => handleBuyClick(e) } className="btnBu">Buy For {price} NEAR</button>
										<p style={{margin:"0",alignSelf:"center"}}>- or -</p>
									</>}
									<div className="containerFlex" style={{justifyContent:"space-between"}}>
										<button style={{width:"80px"}} onClick={ e => handleOfferClick(e) } className="btnOffer">Offer</button>
									
										<input style={{margin:"0 !important"}} type="number" inputMode='decimal' placeholder="Place an offer..." value={offerPrice} onChange={(e) => handleInputChange(e)} />
									</div>
								</div>
							}
							{Object.keys(popUp.token.bids).length > 0 && 
								<>
									<h4>Offers</h4>
									{
										Object.entries(popUp.token.bids).map(([ft_token_id, ft_token_bids]) => ft_token_bids.filter(element=>element===ft_token_bids[ft_token_bids.length-1]).map(({ owner_id: bid_owner_id, price }) => <div className="offers" key={ft_token_id}>
											<div>
												{price === '0' ? 'open' : formatNearAmount(price, 4)} {token2symbol[ft_token_id]} by {formatAccountId(bid_owner_id,17)}
											</div>
											{
												accountId === popUp.token.owner_id &&
												<button onClick={() => {setShow(false);handleAcceptOffer(account, popUp.token.token_id, ft_token_id)}}>Accept</button>
											}
										</div>) )
									}
								</>
							}
						</div>
					</div>
					{feedBack!=="" && <BuyPopUp handleBuyClick={handleBuyClick} price={price} setFeedBack={setFeedBack} feedBack={feedBack}/>}
				</div>
			}
			{
				!show && <div className='backgroundPopUp2'><img src={Avatar} className="cookieSpinner"/></div>
			}
		</div>
    )
}
