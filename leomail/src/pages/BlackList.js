import React, {useEffect, useState} from 'react';
import './BlackList.css';
import {leoWallet, message_root, program_id, remote_base_url, walletHelper} from "../Config"; // 导入样式文件

function BlackList() {
    const regex = /^aleo[A-Za-z0-9]{59}$/;
    const [inputRows, setInputRows] = useState([
        {id:'input1',value:''},
        {id:'input2',value:''},
        {id:'input3',value:''},
        {id:'input4',value:''},
        {id:'input5',value:''},]);

    const [correctInput,setCorrectInput] = useState({'input1':true,'input2':true,'input3':true,'input4':true,'input5':true})

    const setBlackList = async () => {
        const isCorrect = correctInput['input1'] &&correctInput['input2'] &&correctInput['input3'] &&correctInput['input4'] &&correctInput['input5']
        if(!isCorrect){
            return
        }

        const blacks = {
            "black1":inputRows[0].value ? inputRows[0].value: "aleo1wa04hyxkymezl5zcqucp3h3zlm52r9p7xryuentel8s88xcv6sqst8wz2t",
            'black2':inputRows[1].value ? inputRows[1].value: "aleo1wa04hyxkymezl5zcqucp3h3zlm52r9p7xryuentel8s88xcv6sqst8wz2t",
            'black3':inputRows[2].value ? inputRows[2].value: "aleo1wa04hyxkymezl5zcqucp3h3zlm52r9p7xryuentel8s88xcv6sqst8wz2t",
            'black4':inputRows[3].value ? inputRows[3].value: "aleo1wa04hyxkymezl5zcqucp3h3zlm52r9p7xryuentel8s88xcv6sqst8wz2t",
            'black5':inputRows[4].value ? inputRows[4].value: "aleo1wa04hyxkymezl5zcqucp3h3zlm52r9p7xryuentel8s88xcv6sqst8wz2t",
        }
       const content = JSON.stringify(blacks).replace(/"/g, '')
       await walletHelper.setBlackList(content)
    }
    const handleInputChange = (id, value) => {
        let correctList = correctInput
        if (regex.test(value) || value.length===0 ) {
            correctList[id] = true
        } else {
            correctList[id] = false
        }
        setCorrectInput(correctList)
        const filteredValue = value.replace(/[^a-zA-Z0-9]/g, ''); // 过滤非 ASCII 字符

        const updatedRows = inputRows.map(row =>
            row.id === id ? {id:row.id,value:filteredValue} : row
        );
        setInputRows(updatedRows);
    };
    const getBlackList = async () => {
        const link_blacklist = 'https://vm.aleo.org/api/testnet3/program/'+program_id+'/mapping/black_list_store/'+leoWallet.publicKey
        const response = await fetch( link_blacklist);
        let textValue = await response.json();
        textValue = textValue ? textValue : ',,,,'
        const default_address = 'aleo1wa04hyxkymezl5zcqucp3h3zlm52r9p7xryuentel8s88xcv6sqst8wz2t'
        let groupValue = textValue.replace('{','').replace('}','').replace('black1:','').replace('black2:','').
        replace('black3:','').replace('black4:','').replace('black5:','').replaceAll(default_address,'').replaceAll(' ','').replaceAll('\n','')
        groupValue = groupValue.split(',')

        const rows = [
            {id:'input1',value:groupValue[0] },
            {id:'input2',value:groupValue[1]},
            {id:'input3',value:groupValue[2]},
            {id:'input4',value:groupValue[3]},
            {id:'input5',value:groupValue[4]},]

        setInputRows(rows)

    }
    const close = () => {
      message_root.render("")
    }

    useEffect(() => {
        getBlackList().then()

        return () => {
            // 组件即将卸载时执行清理操作、取消订阅或释放资源
        };
    }, []); // 空依赖数组表示只在组件挂载和卸载时执行一次

    return (
        <div className="modal-container">
            <div className='modal-content'>
                <h1>BlackList</h1>
                <div className='close-button' onClick={close}>
                    <img className='img_button' src={'close.png'}/>
                </div>
                <p>Block the following address from sending you mails.</p>
                <div className="input-list">
                    {inputRows.map(row => (
                        <div key={row.id} className="input-row">
                            <input
                                onChange={(event) => handleInputChange(row.id,event.target.value)}
                                className={correctInput[row.id] ? "input-type": "error-form-control" }
                                type="text"
                                value={row.value}
                                placeholder={(`BlackList ${row.id}`).replace('input','') }
                            />

                        </div>
                    ))}

                </div>
                <div className="buttons">
                    <button className="save-button" onClick={setBlackList}>Save</button>
                </div>
            </div>

        </div>
    );
}

export default BlackList;
