import React from 'react'
import React, { useState } from 'react'
import { handleAcceptOffer, handleBidRemove } from '../state/actions';
import { token2symbol } from '../state/near'
import { formatAccountId } from '../utils/near-utils'
import * as nearAPI from 'near-api-js';
import { MyOfferInput } from './MyOfferInput';
import { UserIconName } from './UserIconName';
import Avatar from 'url:../img/Cookie.png';


const {
	utils: { format: { formatNearAmount } }
} = nearAPI;


export const MyOffers = ({views,account,state}) => {

    const tokensWhitOffers = views.sales.filter(sale=> sale.bids.near?.length > 0 && sale?.bids.near[sale?.bids.near.length-1].owner_id === account.accountId);
    
    return (
            <>
			{ !state.tokensLoading.sales && !tokensWhitOffers.length && <h4 style={{margin:"100px auto",textAlign:"center"}}>You dont have any NFTs</h4>}
            
			<div className="containerGrid mt-5">
                {   tokensWhitOffers.map(token=>
                        <div key={token.token_id}>
                            <div className="containerFlex flexColumn p-2 pb-3 m-2" style={{borderRadius:"8px",boxShadow:"0px 0px 12px #C8ADA766"}}>
                                <img className="cookieToken mt-3 mb-2" src={token.metadata.media} />
                                {
                                    Object.keys(token.sale_conditions).length > 0 && <>
                                        {
                                            Object.entries(token.sale_conditions).map(([ft_token_id, price]) => <div style={{display:"block",margin:" 5px auto",fontSize:"12px"}} key={ft_token_id}>
                                                <span className="textWhite" style={{background: "#D18436", borderRadius: "5px", padding:"2px 10px"}}>
													{price === '0' ? 'OPEN Offers' : `${formatNearAmount(price, 4)} NEAR` }
                                                </span>
                                            </div>)
                                        }
                                    </>	
                                }
                                <UserIconName accountId={account.accountId} owner_id={token.owner_id}/>
                                {
                                    Object.keys(token.bids).length > 0 && <>
                                        {
                                            Object.entries(token.bids).map(([ft_token_id, ft_token_bids]) => ft_token_bids.filter(element=>element===ft_token_bids[ft_token_bids.length-1]).map(({ owner_id: bid_owner_id, price }) => <div className="offers" key={ft_token_id}>
                                                { 
                                                    <h4 style={{marginTop:'10px',marginBottom:"5px", background:"#D18436", color:"white", borderRadius:"5px",padding:"2px 0"}} className='textCenter'>You Offer {formatNearAmount(price, 4)} {token2symbol[ft_token_id]}</h4>
                                                }
                                            </div>) )
                                        }
                                    </>
                                }
                                {
                                    <>
                                        {
                                            account.accountId.length > 0 && account.accountId !== token.owner_id && 
                                            <div className="containerFlex">
                                                <MyOfferInput token={token} account={account} formatNearAmount={formatNearAmount}/>
                                            </div>
                                        }
                                    </>
                                }
                            </div>
                        </div>
                    )
                }
            </div>
            
			<div className="containerGrid">
				{state.tokensLoading.sales && <img src={Avatar} className="cookieSpinner" style={{margin:"100px auto",gridColumnStart:"3"}}/>}
            </div>
        </>
    )
}
