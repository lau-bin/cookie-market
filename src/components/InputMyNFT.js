import React, { useState } from 'react'
import { handleSaleUpdate } from '../state/actions';
import { parseNearAmount } from '../state/near';
import { BuyPopUp } from './BuyPopUp';

export const InputMyNFT = ({account,token_id,text,setLoading}) => {
    
    const [price, setPrice] = useState('');
    const [saleConditions, setSaleConditions] = useState({});
    const [ft, setFT] = useState('near');
    const [feedBack, setFeedBack] = useState("");

    const handleEnterKey = e => {
        if(e.key === 'Enter'){
            sendUpdate();
        }
    }

    const sendUpdate = () => {
        
        if (!price.length || parseFloat(price) < 0) {
            console.log(price)
            !price.length && setFeedBack('You must enter an price');
            parseFloat(price) < 0 && setFeedBack('Offer must be greater than or equal to 0');
        }else{
            const newSaleConditions = {
                ...saleConditions,
                [ft]: parseNearAmount(price)
            }
            setSaleConditions(newSaleConditions);
            setPrice('');
            setFT('near');
            setLoading(loading=>!loading);
            handleSaleUpdate(account, token_id, newSaleConditions);
        }
        
    }

    return (
        <div>
            <div className="containerFlex" style={{marginBottom:"5px"}}>
                <input onKeyDown={handleEnterKey} type="number" inputMode='decimal' placeholder={text} style={{marginRight:"5px"}} value={price} onChange={(e) => setPrice(e.target.value)} />
                <button onClick={ sendUpdate }>Add</button>
    			{feedBack!=="" && <BuyPopUp handleBuyClick={null} price={price} setFeedBack={setFeedBack} feedBack={feedBack}/>}
            </div>
        </div>
    )
}
