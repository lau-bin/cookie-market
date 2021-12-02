import React, { useEffect, useState } from 'react';
import * as nearAPI from 'near-api-js';
import { parseNearAmount, token2symbol, getTokenOptions, handleOffer } from '../state/near';
import {
	formatAccountId,
} from '../utils/near-utils';
import { getMarketStoragePaid, loadItems } from '../state/views';
import { handleAcceptOffer, handleRegisterStorage, handleSaleUpdate } from '../state/actions';
import { useHistory } from '../utils/history';
import {Token} from './Token';
import { PopUp } from './PopUp';


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


export const Gallery = ({ app, views, update, contractAccount, account, loading, dispatch }) => {
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

	useEffect(() => {
		if (!loading) {
			dispatch(loadItems(account))
			dispatch(getMarketStoragePaid(account))
		}
	}, [loading]);

	// path to token
	const [path, setPath] = useState(window.location.href);
	useHistory(() => {
		setPath(window.location.href);
	});
	let tokenId;
	let pathSplit = path.split(PATH_SPLIT)[1];
	if (allTokens.length && pathSplit?.length) {
		console.log(pathSplit);
		tokenId = pathSplit.split(SUB_SPLIT)[0];
	}


	const currentSales = sales.filter(({ owner_id, sale_conditions }) => account?.accountId === owner_id && Object.keys(sale_conditions || {}).length > 0)


	let market = sales;
	if (tab !== 2 && filter === 1) {
		market = market.concat(allTokens.filter(({ token_id }) => !market.some(({ token_id: t}) => t === token_id)));
	}
	market.sort(sortFunctions[sort]);
	tokens.sort(sortFunctions[sort]);


	const token = market.find(({ token_id }) => tokenId === token_id);
	if (token) {
		return <Token {...{dispatch, account, token}} />;
	}

	return <>
		{ popUp.show && <PopUp setPopUp={setPopUp} popUp={popUp} formatNearAmount={formatNearAmount} accountId={accountId} account={account}/>}
		{
			tab < 3 && 
			<center className="d-flex justify-content-center mt-3" >
				{
					tab !== 2 && <button className="mx-3 px-3" onClick={() => update('app.filter', filter === 2 ? 1 : 2)} style={{background: '#fed'}}>{filter === 1 ? 'All' : 'Sales'}</button>
				}
				<button className="mx-3" onClick={() => update('app.sort', sort === 2 ? 1 : 2)} style={{ background: sort === 1 || sort === 2 ? '#fed' : ''}}>Date {sort === 1 && '▲'}{sort === 2 && '▼'}</button>
				{
					tab !== 2 && <button className="mx-3" onClick={() => update('app.sort', sort === 4 ? 3 : 4)} style={{ background: sort === 3 || sort === 4 ? '#fed' : ''}}>Price {sort === 3 && '▲'}{sort === 4 && '▼'}</button>
				}
			</center>
		}
		<div className="container-fluid">
			<div className="row">
				{
					tab === 1 && market.map(({
						metadata: { media },
						owner_id,
						token_id,
						sale_conditions = {},
						bids = {},
						royalty = {}
					}) =>
						<div className="col-6 col-md-2">
							<div key={token_id} className="d-flex flex-column p-2 m-2">
								<img className="cookieToken" style={{width:"120px",height:"120px",display:"block",margin:"auto"}} src={media} onClick={() => setPopUp({show:true,token:{media,sale_conditions,accountId,owner_id,token_id,bids}})} />
								{
									Object.keys(sale_conditions).length > 0 && <>
										{
											Object.entries(sale_conditions).map(([ft_token_id, price]) => <div className="mt-3 mb-2" style={{display:"block",margin:"auto",fontSize:"12px"}} key={ft_token_id}>
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
										<p className="text-center userToken mx-1" >{accountId !== owner_id ? `${formatAccountId(owner_id)}` : `You`}</p>
								</div>
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
						</div>
					)
				}
			</div>
		</div>
		{
			tab === 2 && <>
				{!tokens.length && <p className="margin">You dont have any NFTs. Try minting something!</p>}
					<div className="container-fluid">
					<div className="row">
				{
					tokens.map(({
						metadata: { media },
						owner_id,
						token_id,
						sale_conditions = {},
						bids = {},
						royalty = {}
					}) => 
					<div className="col-6 col-md-2">
						<div key={token_id} className="d-flex flex-column p-2 m-2">
						<img style={{width:"120px",height:"120px",display:"block",margin:"auto"}} src={media} onClick={() => history.pushState({}, '', window.location.pathname + '?t=' + token_id)} />
						{
							marketStoragePaid !== '0' ? <>
								<h4>Royalties</h4>
								{
									Object.keys(royalty).length > 0 ?
										Object.entries(royalty).map(([receiver, amount]) => <div key={receiver}>
											{receiver} - {amount / 100}%
										</div>)
										:
										<p>This token has no royalties.</p>
								}
								{
									Object.keys(sale_conditions).length > 0 && <>
										<h4>Current Sale Conditions</h4>
										{
											Object.entries(sale_conditions).map(([ft_token_id, price]) => <div className="margin-bottom" key={ft_token_id}>
												{price === '0' ? 'open' : formatNearAmount(price, 4)} - {token2symbol[ft_token_id]}
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
									accountId === owner_id && <>
										<div>
											<h4>Add Sale Conditions</h4>
											<input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
											{
												//-getTokenOptions(ft, setFT) permite elegir entre near y otras monedas, desactivado para usar solo near
											}
											<button onClick={() => {
												if (!price.length) {
													return alert('Enter a price');
												}
												const newSaleConditions = {
													...saleConditions,
													[ft]: parseNearAmount(price)
												}
												setSaleConditions(newSaleConditions);
												setPrice('');
												setFT('near');
												handleSaleUpdate(account, token_id, newSaleConditions);
											}}>Add</button>
										</div>
										<div>
											<i style={{ fontSize: '0.75rem' }}>Note: price 0 means open offers</i>
										</div>
									</>
								}
								{
									Object.keys(bids).length > 0 && <>
										<h4>Offers</h4>
										{
											Object.entries(bids).map(([ft_token_id, { owner_id, price }]) => <div className="offers" key={ft_token_id}>
												<div>
													{price === '0' ? 'open' : formatNearAmount(price, 4)} - {token2symbol[ft_token_id]}
												</div>
												<button onClick={() => handleAcceptOffer(token_id, ft_token_id)}>Accept</button>
											</div>)
										}
									</>
								}
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
					</div>
					</div>
			</>
		}

	</>;
};

