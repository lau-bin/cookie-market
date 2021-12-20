import React, { useEffect, useState } from 'react';

import * as nearAPI from 'near-api-js';
import { updateWallet } from '../state/near';
import {
	getContract,
	contractMethods,
	GAS
} from '../utils/near-utils';
const {
	KeyPair,
	utils: { PublicKey,
		format: {
			formatNearAmount
		} }
} = nearAPI;

export const Wallet = ({ wallet, account, update, dispatch, handleClose,setShow }) => {

	const [accountId, setAccountId] = useState('');
	const [proceeds, setProceeds] = useState('0');

	if (wallet && wallet.signedIn) {
		return <>
		<div 
			onClick={(e)=>{e.target.classList.contains('backgroundPopUp') && handleClose()}}
			className="backgroundPopUp"	
          	tabIndex={-1}
        >
			<div style={{width:"400px",height:"220px",margin:"auto",background:"#F8EDE7",display:"flex",flexDirection:"column",justifyContent:"space-between",borderRadius:"8px",zIndex:"10000"}}>
				<svg onClick={()=>setFeedBack("")} style={{cursor:"pointer",alignSelf:"end",position:"relative",top:"0px",right:"0"}} onClick={handleClose} width="36" height="36" fill="#915731" className="bi bi-x" viewBox="0 0 16 16">
							<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
				</svg>

				<h3 style={{textAlign:"center",color:"#915731"}}>Wallet Balance</h3>
				<p style={{textAlign:"center",color:"#000A",fontWeight:"bolder"}}>{ wallet.balance } NEAR</p>
				<button style={{marginBottom:"40px",width:"200px",alignSelf:"center"}} onClick={() => wallet.signOut()}>Sign Out</button>
			</div>
		</div>
		</>;
	}

	return <>
		<button onClick={() => {setShow(true); wallet.signIn()}} className="btnConnectWallet p-1">CONNECT WALLET</button>
	</>;
};

