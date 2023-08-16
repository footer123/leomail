import './BlackList.css'
import React, {useEffect, useState} from "react";
import {message_root, walletHelper} from "../Config";
function NftList() {
    const [domains,setDomains] = useState([])

    const close = () => {
        message_root.render("")
    }

    const getDomains = async  () => {
        const domainList = await walletHelper.refreshDomain()
        setDomains(domainList)
    }
    useEffect(() => {
        getDomains().then()

        return () => {

        };
    }, []);

    return (
        <div className="modal-container">
            <div className='modal-content'>
                <div className='close-button' onClick={close}>
                    <img className='img_button' src={'close.png'}/>
                </div>
                <h1>My Domain NFT</h1>

                    <div className='domain-list'>
                        {domains.map(value => (
                        <DomainItem domain={value}/>
                    ))}
                    </div>
                {
                    (domains.length === 0 ) && <h2>You don't have your own domain name yet.</h2>
                }

            </div>
        </div>
    )
}

function DomainItem(pros) {
    const domain = pros.domain
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const startTransfer = () => {
        setIsMenuOpen(false)
        message_root.render(<TransferDomain domainNft={domain}/>)
    }
    const burnNft =async () => {
      await walletHelper.burnDomain(domain.record)
    }
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
                <div className='domain-container'>
                    <h2 onClick={toggleMenu}>{domain.domain + '@leomail.cc' }</h2>

                    {isMenuOpen &&
                    <div>
                        <button className="save-button" onClick={startTransfer} >Transfer</button>
                        <button className="delete-button" onClick={burnNft} >Burn</button>
                    </div>
                    }

                </div>
            )

}

function TransferDomain(pros) {
    const domainNft = pros.domainNft
    const [correctInput,setCorrectInput] = useState(true)
    const [inputValue,setInputValue] = useState('')

    const regex = /^aleo[A-Za-z0-9]{59}$/;
    const handleInputChange = (value) => {
        let correctList = correctInput
        if (regex.test(value) || value.length===0 ) {
            setCorrectInput(true)
        } else {
            setCorrectInput(false)
        }

        const filteredValue = value.replace(/[^a-zA-Z0-9]/g, ''); // 过滤非 ASCII 字符

        setInputValue(filteredValue);
    };

    const close = () => {
        message_root.render("")
        console.log(domainNft)
    }

    const transfer =async () => {
        await walletHelper.transferDomain(inputValue,domainNft.record)
    }
    return (
        <div className="modal-container">
            <div className='modal-content'>
                <h1>Transfer Domain NFT</h1>
                <div className='close-button' onClick={close}>
                    <img className='img_button' src={'close.png'}/>
                </div>
                <div className='domain-container'>
                    <img className='icon-img' src={'down.png'}/>
                    <input
                        onChange={(event) => handleInputChange(event.target.value)}
                        className={correctInput ? "input-type-border" : "error-form-control"}
                        type="text"
                        value={inputValue}
                        placeholder='Enter the address you want to transfer...'
                    />
                    <div>
                        <button className="save-button" onClick={transfer} >Transfer Now</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default NftList;
