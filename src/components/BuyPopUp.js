import React from 'react'

export const BuyPopUp = ({handleBuyClick,price,setFeedBack,feedBack}) => {
    
    const handleClick = e => {
        e.target.classList.contains('backgroundPopUp2') && setFeedBack("");
    }
    
    return (
        <div 
            onClick={handleClick}
            className="backgroundPopUp2"
            tabIndex={-1}
        >
            {
                <div style={{width:"300px",height:"120px",margin:"auto",background:"#F8EDE7",display:"flex",flexDirection:"column",justifyContent:"space-between",borderRadius:"8px"}} >
                    
                        <svg onClick={()=>setFeedBack("")} style={{cursor:"pointer",alignSelf:"end"}} width="36" height="36" fill="#915731" className="bi bi-x" viewBox="0 0 16 16">
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    
                    <h4 style={{textAlign:"center"}}>{feedBack}</h4>
                    {
                        feedBack === "offer must be less than price" ? 
                        <button style={{marginBottom:"10px"}} onClick={ e => handleBuyClick(e) } className="btnBuy" style={{alignSelf:"center"}}>Buy For {price} Near</button> :
                        <button style={{marginBottom:"10px"}} onClick={ e => setFeedBack("") } className="btnBuy" style={{alignSelf:"center"}}>Ok</button> 
                    }
                </div>
            }
        </div>
    )
}
