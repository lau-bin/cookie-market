import React, { useEffect, useState } from 'react';
import * as nearAPI from 'near-api-js';
import { parseNearAmount, token2symbol, getTokenOptions, handleOffer } from '../state/near';
import { formatAccountId } from '../utils/near-utils';
import { getMarketStoragePaid, getSupgetSupply, ply, loadItems, getSupply } from '../state/views';
import { handleAcceptOffer, handleRegisterStorage, handleSaleRemove, handleSaleUpdate } from '../state/actions';
import { useHistory } from '../utils/history';
import {Token} from './Token';
import { PopUp } from './PopUp';
import { InputMyNFT } from './InputMyNFT';
import { UserIconName } from './UserIconName';
import Avatar from 'url:../img/Cookie.png';



const PATH_SPLIT = '?t=';
const SUB_SPLIT = '&=';

const {
	utils: { format: { formatNearAmount } }
} = nearAPI;


const n2f = (amount) => parseFloat(parseNearAmount(amount, 8));

const sortFunctions = {
	1: (a, b) => parseInt(a.metadata.issued_at || '0') - parseInt(b.metadata.issued_at || '0'),
	2: (b, a) => parseInt(a.metadata.issued_at || '0') - parseInt(b.metadata.issued_at || '0'),
	3: (a, b) => n2f(a.sale_conditions?.near || '0') - n2f(b.sale_conditions?.near || '0'),
	4: (b, a) => n2f(a.sale_conditions?.near || '0') - n2f(b.sale_conditions?.near || '0'),
};


export const Gallery = ({ app, views, update, contractAccount, account, dispatch, suply,state,signedIn }) => {

	if (!contractAccount) return null;

	const { tab, sort, filter } = app;
	const { tokens, sales, allTokens, marketStoragePaid } = views

	let accountId = '';
	if (account) accountId = account.accountId;

	/// market
	const [offerPrice, setOfferPrice] = useState('');
	//-const [offerToken, setOfferToken] = useState('near');
	const offerToken='near';

	/// updating user tokens
	const [price, setPrice] = useState('');
	const [ft, setFT] = useState('near');
	const [saleConditions, setSaleConditions] = useState({});

	//- pop-up
	const [popUp, setPopUp] = useState({show:false,token:null});
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		dispatch(getMarketStoragePaid(account));
		//dispatch(getSupply(account));
	}, [])

	useEffect(() => {
		dispatch(loadItems(account,tokens,sales,suply))
	}, [sales,tokens]);

	// path to token
	const [path, setPath] = useState(window.location.href);
	useHistory(() => {
		setPath(window.location.href);
	});
	let tokenId;
	let pathSplit = path.split(PATH_SPLIT)[1];
	if (allTokens.length && pathSplit?.length) {
		tokenId = pathSplit.split(SUB_SPLIT)[0];
	}


	const currentSales = sales.filter(({ owner_id, sale_conditions }) => account?.accountId === owner_id && Object.keys(sale_conditions || {}).length > 0)

	let market = sales;
	//-if (tab !== 2 && filter === 1) {
	//-	market = market.concat(allTokens.filter(({ token_id }) => !market.some(({ token_id: t}) => t === token_id)));
	//-} no queremos nft que no esten a la venta en el market
	//market.sort(sortFunctions[sort]);
	//tokens.sort(sortFunctions[sort]);


	const token = market.find(({ token_id }) => tokenId === token_id);
	if (token) {
		return <Token {...{dispatch, account, token}} />;
	}

	return <>
		{ popUp.show && <PopUp setPopUp={setPopUp} popUp={popUp} formatNearAmount={formatNearAmount} accountId={accountId} account={account}/>}
		{
			false && tab < 3 && 
			<center className="containerflex justifyContentCenter mt-3 mb-2" >
				{
					false && tab !== 2 && <button className="mx-3 btnSort px-3" onClick={() => update('app.filter', filter === 2 ? 1 : 2)} style={{background: '#fed'}}>{filter === 1 ? 'All' : 'Sales'}</button>
				}
				<button className="mx-3 btnSort" onClick={() => update('app.sort', sort === 2 ? 1 : 2)} style={{ background: sort === 1 || sort === 2 ? '#fed' : ''}}>Date {sort === 1 && '▲'}{sort === 2 && '▼'}</button>
				{
					tab !== 2 && <button className="mx-3 btnSort" onClick={() => update('app.sort', sort === 4 ? 3 : 4)} style={{ background: sort === 3 || sort === 4 ? '#fed' : ''}}>Price {sort === 3 && '▲'}{sort === 4 && '▼'}</button>
				}
			</center>
		}
			<div className="containerGrid mt-5">
				{
					tab === 1 && market.map(({
						metadata: { media },
						owner_id,
						token_id,
						sale_conditions = {},
						bids = {},
						royalty = {}
					}) =>
						<>
							<div key={token_id} className="containerFlex flexColumn p-2 pb-4 m-2" style={{borderRadius:"8px",boxShadow:"0px 0px 12px #C8ADA766",cursor:'pointer'}} onClick={() => setPopUp({show:true,token:{media,sale_conditions,accountId,owner_id,token_id,bids}})}>
								<img className="cookieToken mt-3" src={media} />
								{
									Object.keys(sale_conditions).length > 0 && <>
										{
											Object.entries(sale_conditions).map(([ft_token_id, price]) => <div className="mt-3 mb-2" style={{display:"block",margin:"auto",fontSize:"12px"}} key={ft_token_id}>
												<span className="textWhite" style={{background: "#D18436", borderRadius: "5px", padding:"2px 10px"}}>
													{price === '0' ? 'OPEN Offers' : `${formatNearAmount(price, 4)} NEAR` }
												</span>
											</div>)
										}
									</>	
								}
								<UserIconName accountId={accountId} owner_id={owner_id}/>
								{ false && Object.keys(sale_conditions).length > 0 && <>
									<h4>Royalties</h4>
									{
										Object.keys(royalty).length > 0 ?
											Object.entries(royalty).map(([receiver, amount]) => <div key={receiver}>
												{receiver} - {amount / 100}%
											</div>)
											:
											<p>This token has no royalties.</p>
									}
								</>
								}
								{
									false && <>
										{
											accountId.length > 0 && accountId !== owner_id && <>
												<input type="number" placeholder="Price" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} />
												{
													//-getTokenOptions(offerToken, setOfferToken, Object.keys(sale_conditions))
												}
												<button onClick={() => handleOffer(account, token_id, offerToken, offerPrice)}>Offer</button>
											</>
										}
									</>
								}
								{
									false && Object.keys(bids).length > 0 && <>
										<h4>Offers</h4>
										{
											Object.entries(bids).map(([ft_token_id, ft_token_bids]) => ft_token_bids.map(({ owner_id: bid_owner_id, price }) => <div className="offers" key={ft_token_id}>
												<div>
													{price === '0' ? 'open' : formatNearAmount(price, 4)} - {token2symbol[ft_token_id]} by {bid_owner_id}
												</div>
												{
													accountId === owner_id && 
													<button onClick={() => handleAcceptOffer(account, token_id, ft_token_id)}>Accept</button>
												}
											</div>) )
										}
									</>
								}
							</div>
						</>
					)
				}
			</div>
			<div className="containerGrid">
				{tab === 1 && state.tokensLoading.sales && <img src={Avatar} className="cookieSpinner" style={{margin:"100px auto",gridColumnStart:"3"}}/>}
			</div>

		{
			tab === 2 && <>
				{!signedIn && <h4 style={{margin:"100px auto",textAlign:"center"}}>Connect your wallet</h4>}

				{signedIn && !tokens.length && !state.tokensLoading.sales && <h4 style={{margin:"100px auto",textAlign:"center"}}>You dont have any NFTs</h4>}
					<div className="containerGrid">
				{
					signedIn && tokens.map(({
						metadata: { media },
						owner_id,
						token_id,
						sale_conditions = {},
						bids = {},
						royalty = {}
					}) => 
					<div key={token_id}>
						<div className="containerFlex flexColumn p-2 m-2" style={{borderRadius:"8px",boxShadow:"0px 0px 12px #C8ADA766"}}>
						<img className="cookieToken mt-3 mb-2" src={media} />
						{
							marketStoragePaid !== '0' ? <>
								{	false && <h4>Royalties</h4> }
								{
									false && (Object.keys(royalty).length > 0 ?
										Object.entries(royalty).map(([receiver, amount]) => <div key={receiver}>
											{receiver} - {amount / 100}%
										</div>)
										:
										<p>This token has no royalties.</p>)
								}
								{
									Object.keys(sale_conditions).length > 0 && <>
										{
											Object.entries(sale_conditions).map(([ft_token_id, price]) => <div className="textCenter" key={ft_token_id}>
												<h4 style={{marginBottom:"5px", background:"#915731", color:"white", borderRadius:"5px",padding:"2px 0",margin:"5px 0"}} className="textCenter">
													{price === '0' ? 'OPEN Offers' : `${formatNearAmount(price, 4)} NEAR` } In Market
												</h4>
											</div>)
										}
									</>
								}
								{
									// saleConditions.length > 0 &&
									// 	<div>
									// 		<h4>Pending Sale Updates</h4>
									// 		{
									// 			saleConditions.map(({ price, ft_token_id }) => <div className="margin-bottom" key={ft_token_id}>
									// 				{price === '0' ? 'open' : formatNearAmount(price, 4)} - {token2symbol[ft_token_id]}
									// 			</div>)
									// 		}
									// 		<button className="pulse-button" onClick={() => handleSaleUpdate(account, token_id)}>Update Sale Conditions</button>
									// 	</div>
								}
								{
									accountId === owner_id && sale_conditions.near && <>
									<div>
										<InputMyNFT account={account} token_id={token_id} text="Update Price..." setLoading={setLoading}/>
									</div>
									<button onClick={() => { setLoading('true');handleSaleRemove(account, token_id)}}>Remove From Market</button>
								</>
								}
								{
									accountId === owner_id && !sale_conditions.near && <>
										<div>
											<h4 style={{marginBottom:"5px", background:"#915731", color:"white", borderRadius:"5px",padding:"2px 0",margin:"5px 0"}} className="textCenter">Add To Sale</h4>

											<InputMyNFT account={account} token_id={token_id} text="Add Price..." setLoading={setLoading}/>
										</div>
										<div className="textCenter">
											<span style={{ fontSize: '0.70rem' }}>Price 0 means open offers</span>
										</div>
									</>
								}
								<div style={{minHeight:"0px"}}>
								{Object.keys(bids).length > 0 && 
								<>
									{
											Object.entries(bids).map(([ft_token_id, ft_token_bids]) => ft_token_bids.filter(element=>element===ft_token_bids[ft_token_bids.length-1]).map(({ owner_id: bid_owner_id, price }) => 
											<div style={{display:"flex",justifyContent:"space-between",marginTop:"5px"}} key={ft_token_id}>
											<div style={{display:"flex",flexDirection:"column",marginRight:"5px",textAlign:"end"}}>
											<span style={{ fontSize: '0.6rem' ,fontWeight:"bolder",color:"#0008"}}> Offer From</span>
											<span style={{ fontSize: '0.6rem' ,fontWeight:"bolder"}}> {formatAccountId(bid_owner_id,17)}</span>
												
											</div>
											{
												accountId === owner_id &&
												<button style={{padding:"4px",flexGrow:'1'}} className="" onClick={() => {setLoading('true');handleAcceptOffer(account, token_id, ft_token_id)}}>Accept {formatNearAmount(price, 2)} N</button>
											}
										</div>) )
									}
								</>
								}
								</div>
							</>
								:
								<div className="center">
									<button onClick={() => handleRegisterStorage(account)}>Register with Market to Sell</button>
								</div>
						}
					</div>
					</div>
					)
				}
				{loading && <div className='backgroundPopUp2'><img src={Avatar} className="cookieSpinner"/></div>}

					</div>
					<div className="containerGrid">
				{tab === 2 && signedIn && state.tokensLoading.sales && <img src={Avatar} className="cookieSpinner" style={{margin:"100px auto",gridColumnStart:"3"}}/>}
					</div>
			</>
		}

	</>;
};

