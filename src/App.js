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
import { MyOffers } from './components/MyOffers';

const App = () => {
	const { state, dispatch, update } = useContext(appStore);
	
	const { app, views, app: {tab, snack}, near, wallet, contractAccount, account, loading } = state;

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
		<div id="containerNavBar">
			<div id="navBar" className="ContainerFlex">
				<div>
					<div id="logos" >
						<img src={Avatar}/>
						<img className="logo" src={Logo}/>
					</div>
					<div id="tabs">
						<div className="links" onClick={() => update('app.tab', 1)}><span> Market</span><div className={ tab === 1 ? 'menuSelected' : 'menuNoSelected' }></div></div>
						<div className="links" onClick={() => update('app.tab', 2)}><span> My&nbsp;NFTs</span><div className={ tab === 2 ? 'menuSelected' : 'menuNoSelected' }></div></div>
						<div className="links" onClick={() => update('app.tab', 3)}><span> My&nbsp;Offers</span><div className={ tab === 3 ? 'menuSelected' : 'menuNoSelected' }></div></div>
					</div>
				</div>
				<div>
					{!signedIn ? <Wallet {...{ wallet }} /> : <div onClick={() => setProfile(!profile)} style={{cursor:"pointer"}}>{account.accountId}</div>}
				</div>
				{
					profile && signedIn && 
						<div id="profile">
							<div>
								{
									wallet && wallet.signedIn && <Wallet {...{ wallet, account, update, dispatch, handleClose: () => setProfile(false) }} />
								}
							</div>
						</div>
				}
			</div>
		</div>
		

		{
			
		}

		{ signedIn && tab === 3 &&
			<div id="contract">
				{
					<MyOffers views={views} account={account}/>
					//<Contract {...{ near, update, wallet, account }} />
				}
			</div>
		}
		<div id="gallery">
			<Gallery {...{ app, views, update, loading, contractAccount, account, dispatch }} />
		</div>
	</>;
};

export default App;
