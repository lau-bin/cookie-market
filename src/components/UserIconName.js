import React from 'react'
import { formatAccountId } from '../utils/near-utils'

export const UserIconName = ({accountId,owner_id}) => {
    return (
        <div className="containerFlex justifyContentCenter">
            <svg style={{minWidth:"20px"}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#915731" className="bi bi-person-circle" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
            </svg>
            <p className="textCenter userToken mx-1" style={{marginBottom:"5px",color:"#915731",fontSize:"12px",fontWeight:"bolder"}} >{accountId !== owner_id ? `${formatAccountId(owner_id,18)}` : `Your NFT`}</p>
        </div>
    )
}
