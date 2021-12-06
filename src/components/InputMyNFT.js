import React, { useState } from 'react'
import { handleSaleUpdate } from '../state/actions';
import { parseNearAmount } from '../state/near';

export const InputMyNFT = ({account,token_id,text}) => {
    
    const [price, setPrice] = useState('');
    const [saleConditions, setSaleConditions] = useState({});
    const [ft, setFT] = useState('near');

    return (
        <div>
            <div className="containerFlex">
                <input type="number" placeholder={text} value={price} onChange={(e) => setPrice(e.target.value)} />
                <button onClick={() => {
                    if (!price.length) {
                        return console.log('Enter a price');
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
        </div>
    )
}
