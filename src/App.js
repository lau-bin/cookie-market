import React, { useContext, useEffect, useState } from 'react';

import { appStore, onAppMount } from './state/app';

import { Wallet } from './components/Wallet';
import { Contract } from './components/Contract';
import { Gallery } from './components/Gallery';

import Avatar from 'url:./img/Cookie.png';
import Logo from 'url:./img/Logo.png';
import NearLogo from 'url:./img/near_icon.svg';

import './App.scss';
import './bootstrap.css';

const App = () => {
	const { state, dispatch, update } = useContext(appStore);
	
	const { app, views, app: {tab, snack}, near, wallet, contractAccount, account, loading } = state;
	account && console.log(account)

	const [profile, setProfile] = useState(false);

	const onMount = () => {
		dispatch(onAppMount());
	};
	useEffect(onMount, []);


	const signedIn = ((wallet && wallet.signedIn));

	if (profile && !signedIn) {
		setProfile(false);
	}

	return <>
		{ loading && <div className="loading">
			<img src={NearLogo} />
		</div>
		}
		{
			snack &&
			<div className="snack">
				{snack}
			</div>
		}

		<div id="menu" className="d-flex">
			<div className="flex-shrink-1">
				<img src={Avatar}/>
				<img src={Logo}/>
			</div>
			<div id="tabs">
				<div onClick={() => update('app.tab', 1)} style={{ background: tab === 1 ? '#fed' : '' }}><span className="links text-bolder"> Market</span></div>
				<div onClick={() => update('app.tab', 2)} style={{ background: tab === 2 ? '#fed' : '' }}><span className="links text-bolder"> My NFTs</span></div>
				<div onClick={() => update('app.tab', 3)} style={{ background: tab === 3 ? '#fed' : '' }}><span className="links text-bolder"> Mint</span></div>
			</div>
			<div className="d-flex justify-content-end">
				{!signedIn ? <Wallet {...{ wallet }} /> : <div onClick={() => setProfile(!profile)} style={{cursor:"pointer"}}>{account.accountId}</div>}
			</div>
			{
				profile && signedIn && <div id="profile">
					<div>
						{
							wallet && wallet.signedIn && <Wallet {...{ wallet, account, update, dispatch, handleClose: () => setProfile(false) }} />
						}
					</div>
				</div>
			}
		</div>


		{
			
		}

		{ signedIn && tab === 3 &&
			<div id="contract">
				{
					signedIn &&
					<Contract {...{ near, update, wallet, account }} />
				}
			</div>
		}
		<div id="gallery">
			<Gallery {...{ app, views, update, loading, contractAccount, account, dispatch }} />
		</div>
	</>;
};

export default App;
