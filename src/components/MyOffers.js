import React from 'react'
import React, { useState } from 'react'
import { handleAcceptOffer, handleBidRemove } from '../state/actions';
import { token2symbol } from '../state/near'
import { formatAccountId } from '../utils/near-utils'
import * as nearAPI from 'near-api-js';
import { MyOfferInput } from './MyOfferInput';

const {
	utils: { format: { formatNearAmount } }
} = nearAPI;


export const MyOffers = ({views,account}) => {

    const tokensWhitOffers = views.sales.filter(sale=> sale.bids.near?.length > 0 && sale?.bids.near[sale?.bids.near.length-1].owner_id === account.accountId);
    
    return (
			<div className="containerGrid mt-5">
                {   tokensWhitOffers.map(token=>
                        <div>
                            <div key={token.token_id} className="d-flex flex-column p-2 m-2">
                                <img className="cookieToken" src={token.metadata.media} />
                                {
                                    Object.keys(token.sale_conditions).length > 0 && <>
                                        {
                                            Object.entries(token.sale_conditions).map(([ft_token_id, price]) => <div className="mt-3 mb-2" style={{display:"block",margin:"auto",fontSize:"12px"}} key={ft_token_id}>
                                                <span className="text-white px-2 text-bolder" style={{background: "#D18436", borderRadius: "5px"}}>
                                                    {price === '0' ? 'open' : formatNearAmount(price, 4)} {token2symbol[ft_token_id]}
                                                </span>
                                            </div>)
                                        }
                                    </>	
                                }
                                <div className="d-flex justify-content-center">
                                        <svg style={{minWidth:"20px"}} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#D18436" className="bi bi-person-circle" viewBox="0 0 16 16">
                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                        </svg>
                                        <p className="text-center userToken mx-1" >{account.accountId !== token.owner_id ? `${formatAccountId(token.owner_id)}` : `Your NFT`}</p>
                                </div>
                                {
                                    <>
                                        {
                                            account.accountId.length > 0 && account.accountId !== token.owner_id && <div className="d-flex">
                                                <MyOfferInput token={token} account={account} formatNearAmount={formatNearAmount}/>
                                            </div>
                                        }
                                    </>
                                }
                                {
                                    Object.keys(token.bids).length > 0 && <>
                                        {
                                            Object.entries(token.bids).map(([ft_token_id, ft_token_bids]) => ft_token_bids.filter(element=>element===ft_token_bids[ft_token_bids.length-1]).map(({ owner_id: bid_owner_id, price }) => <div className="offers" key={ft_token_id}>
                                                { 
                                                    <button className="w-100" onClick={() => handleBidRemove(account, token.token_id)}>Remove {formatNearAmount(price, 4)} {token2symbol[ft_token_id]} Offer</button>
                                                }
                                            </div>) )
                                        }
                                    </>
                                }
                            </div>
                        </div>
                    )
                }
            </div>
    )
}
