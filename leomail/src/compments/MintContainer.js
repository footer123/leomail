import './MintContainer.css'
import {content_root, program_id, remote_base_url, walletHelper} from "../Config";
import React, {useState} from "react";
import Pop from "./TranscationPop";

function MintContainer() {
    const [tip,setTip] = useState('')
    const [inputValue, setInputValue] = useState('');
    const [searched_domain, setSearched_domain] = useState('');

    const handleInputChange = (e) => {
        let value = e.target.value;
        if (value.length > 20) {
            value = value.slice(0, 20); // 限制长度为20
        }
        const filteredValue = value.replace(/[^a-z0-9]/g, ''); // 过滤非 ASCII 字符
        setInputValue(filteredValue);
    };

    const buy_domain = async () => {
        const priceList = {
            'digits3':'100000',
            'digits4':'9.9',
            'digits5':'8.9',
            'digits6':'6.9',
            'digits7':'2.9',
            'digits8':'0.9',
        }
        let price = 99;
        if(searched_domain.length < 3){
            return
        }
        else if(searched_domain.length>3 && searched_domain.length<8){
            price = priceList['digits'+searched_domain.length]
        }
        else{
            price = 9
        }

      const transactionId = await walletHelper.buyDomain(searched_domain,price)
       // content_root.render(<Pop transactionId={transactionId}/>)

    }

    const search = () => {
        const reg = /^[a-zA-Z0-9]{4,}$/
        if(!reg.test(inputValue)){
            setTip('The domain must be longer than 3 characters.')
            return
        }
        setSearched_domain(inputValue)
        const field = walletHelper.stringToAscii(inputValue)+'field'
        const link_user_contact = 'https://vm.aleo.org/api/testnet3/program/'+program_id+'/mapping/total_nft/'+field

        const xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", link_user_contact, false ); // false 为同步请求
        xmlHttp.send( null );
        if (xmlHttp.responseText === 'null'){
            setTip('Congratulations, you can register this domain')
        }
        else{
            setTip('the domain has already been registered')
        }
    }

    return (
        <div className="mint-content">
            <div className="search-container">
                <div className="title">
                    <img className='icon-item' src='leo.png'/>
                    <h2>Domain NFT</h2>
                    </div>
                <div className="search-box">
                    <input type="text" className="search-input" placeholder="Enter your search" value={inputValue} onChange={handleInputChange}/>
                    <div>@leomail.cc</div>
                        <button className="search-button" onClick={search}>Search</button>
                </div>
                {tip.length > 0 && <p className='tip-container'>
                    <img className='tip-image' src={tip.includes('Congratulations') ? 'yes.png' : 'warn.png'}/>
                    {tip}
                </p>}
                {tip.includes('Congratulations') && <button className='buy-button' onClick={buy_domain}>
                    <img className='tip-image' src={'buy.png'}/>
                    Buy it now!</button>}
            </div>
            <div className="table-container">
                <table>
                    <tr>
                        <th>Digits</th>
                        <th>Price</th>
                        <th>State</th>
                    </tr>
                    <tr>
                        <td>1-3</td>
                        <td>-</td>
                        <td>Not Open</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>9.9 Aleo</td>
                        <td><img className='tip-image' src={'yes.png'}/></td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>8.9 Aleo</td>
                        <td><img className='tip-image' src={'yes.png'}/></td>
                    </tr>
                    <tr>
                        <td>6</td>
                        <td>6.9 Aleo</td>
                        <td><img className='tip-image' src={'yes.png'}/></td>
                    </tr>
                    <tr>
                        <td>7</td>
                        <td>2.9 Aleo</td>
                        <td><img className='tip-image' src={'yes.png'}/></td>
                    </tr>
                    <tr>
                        <td>>=8</td>
                        <td>0.9 Aleo</td>
                        <td><img className='tip-image' src={'yes.png'}/></td>
                    </tr>
                </table>
            </div>
        </div>
    )
}

export default MintContainer;
