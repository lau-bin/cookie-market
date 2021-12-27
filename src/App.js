import React, { useContext, useEffect, useState } from "react";

import { appStore, onAppMount } from "./state/app";

import { Wallet } from "./components/Wallet";
import { Contract } from "./components/Contract";
import { Gallery } from "./components/Gallery";

import Avatar from "url:./img/Cookie.png";
import Logo from "url:./img/cookie-logo-final.svg";
import NearLogo from "url:./img/near_icon.svg";

import "./App.scss";
import "./bootstrap.css";
import { MyOffers } from "./components/MyOffers";
import { formatAccountId } from "./utils/near-utils";

const App = () => {
  const { state, dispatch, update } = useContext(appStore);

  const {
    app,
    views,
    app: { tab, snack },
    near,
    wallet,
    contractAccount,
    account,
    loading,
    suply,
  } = state;

  const [profile, setProfile] = useState(false);

  const [show, setShow] = useState(false);

  const onMount = () => {
    dispatch(onAppMount());
  };
  useEffect(onMount, []);

  const signedIn = wallet && wallet.signedIn;

  if (profile && !signedIn) {
    setProfile(false);
  }

  return (
    <>
      {loading && (
        <div className="loading">
          <img className="cookieSpinner" src={Avatar} />
        </div>
      )}
      {snack && <div className="snack">{snack}</div>}
      <nav>
        <div id="containerNavBar">
          <div id="navBar" className="ContainerFlex">
            <div>
              <a id="logos" href="https://www.google.com">
                <img className="logo" src={Logo} />
              </a>

              <div className="links">
                <a
                  className="links"
                  style={{ textDecoration: "none", color: "#915731" }}
                  href="https://www.google.com"
                >
                  Minting
                </a>

                <div className="menuNoSelected"></div>
              </div>
              <div className="links">
                <a
                  className="links"
                  style={{ textDecoration: "none", color: "#915731" }}
                  href="https://www.google.com"
                >
                  FAQ
                </a>

                <div className="menuNoSelected"></div>
              </div>
              <div className="links" onClick={() => update("app.tab", 1)}>
                Market
                <div
                  className={tab === 1 ? "menuSelected" : "menuNoSelected"}
                ></div>
              </div>
              <div className="links" onClick={() => update("app.tab", 2)}>
                My&nbsp;NFTs
                <div
                  className={tab === 2 ? "menuSelected" : "menuNoSelected"}
                ></div>
              </div>
              <div className="links" onClick={() => update("app.tab", 3)}>
                My&nbsp;Offers
                <div
                  className={tab === 3 ? "menuSelected" : "menuNoSelected"}
                ></div>
              </div>
            </div>
            <div>
              {!signedIn ? (
                <Wallet {...{ wallet }} setShow={setShow} />
              ) : (
                <button
                  className="btnConnectWallet"
                  onClick={() => setProfile(!profile)}
                  style={{ cursor: "pointer" }}
                >
                  {formatAccountId(account.accountId, 20)}
                </button>
              )}
            </div>
          </div>
          {profile && signedIn && (
            <div>
              <div>
                {wallet && wallet.signedIn && (
                  <Wallet
                    {...{
                      wallet,
                      account,
                      update,
                      dispatch,
                      handleClose: () => setProfile(false),
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {!signedIn && tab === 3 && (
        <h4 style={{ margin: "220px auto", textAlign: "center" }}>
          Connect your wallet
        </h4>
      )}

      {signedIn && tab === 3 && (
        <div id="contract">
          {
            <MyOffers views={views} account={account} state={state} />
            //<Contract {...{ near, update, wallet, account }} />
          }
        </div>
      )}
      <div id="gallery">
        <Gallery
          {...{
            app,
            views,
            update,
            contractAccount,
            account,
            dispatch,
            suply,
            state,
            signedIn,
          }}
        />
      </div>
      {show && (
        <div className="backgroundPopUp2">
          <img src={Avatar} className="cookieSpinner" />
        </div>
      )}
      <footer
        style={{
          height: "70px",
          width: "100%",
          background: "#915731",
          position: "absolute",
          bottom: "0px",
          display: "flex",
          justifyContent: "center",
          zIndex: "-1",
        }}
      >
        <p style={{ color: "white", alignSelf: "center", margin: "auto" }}>
          Made In North Pole &#47; Copyright &#174; 2021
        </p>
      </footer>
    </>
  );
};

export default App;
