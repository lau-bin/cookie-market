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
			<div className="containerGrid mt-5">
                {   tokensWhitOffers.map(token=>
                        <div>
                            <div key={token.token_id} className="containerFlex flexColumn p-2 m-2" style={{borderRadius:"8px",boxShadow:"0px 0px 12px #C8ADA766"}}>
                                <img className="cookieToken mt-3" src={token.metadata.media} />
                                {
                                    Object.keys(token.sale_conditions).length > 0 && <>
                                        {
                                            Object.entries(token.sale_conditions).map(([ft_token_id, price]) => <div className="mt-3 mb-2" style={{display:"block",margin:"auto",fontSize:"12px"}} key={ft_token_id}>
                                                <span className="text-white text-bolder" style={{background: "#D18436", borderRadius: "5px", padding:"2px 10px"}}>
                                                    {price === '0' ? 'open' : formatNearAmount(price, 4)} {token2symbol[ft_token_id]}
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
                                                    <h4 className='textCenter'>You Offer {formatNearAmount(price, 4)} {token2symbol[ft_token_id]}</h4>
                                                }
                                            </div>) )
                                        }
                                    </>
                                }
                                {
                                    <>
                                        {
                                            account.accountId.length > 0 && account.accountId !== token.owner_id && <div className="containerFlex">
                                                <MyOfferInput token={token} account={account} formatNearAmount={formatNearAmount}/>
                                            </div>
                                        }
                                    </>
                                }
                            </div>
                        </div>
                    )
                }
				{state.tokensLoading.sales && <img src={Avatar} className="cookieSpinner" style={{margin:"100px auto",gridColumnStart:"3"}}/>}
            </div>
    )
}
