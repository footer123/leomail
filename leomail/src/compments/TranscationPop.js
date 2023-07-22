import React, {Component, useEffect, useState} from 'react';
import './pop.css'
import {leoWallet} from "./Config";



function Pop(pros) {
    const transactionid = pros.transactionId
    const [isModalOpen, setModalOpen] = useState(true);
    const [progress,setProgress] = useState(0)
    const [tranctionState,setTranctionState] = useState('')
    const [tipstring,setTipstring] = useState('Work in the background')
    let  intervalId;
    useEffect(() => {
        get_transactionState()

        return () => {
            // 组件即将卸载时执行清理操作、取消订阅或释放资源
        };
    }, []); // 空依赖数组表示只在组件挂载和卸载时执行一次


    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        clearInterval(intervalId)
        setModalOpen(false);
    };

    const get_transactionState = () => {
        try{
            console.log(transactionid)
            setTranctionState('Starting...')
            let intertimes = 0
            intervalId = setInterval(function() {
                intertimes++
                if(intertimes>50){
                    clearInterval(intervalId)
                }
                if(!isModalOpen){
                    clearInterval(intervalId)
                }
                leoWallet.transactionStatus(transactionid).then(state=>{
                    console.log(state)
                    setTranctionState(state)
                    switch (state) {
                        case 'Starting...':
                            setProgress(8)
                            break
                        case 'Queued':
                            setProgress(15)
                            break
                        case 'Downloading Prover Files':
                            setProgress(20)
                            break
                        case 'Generating Transaction':
                            setProgress(50)
                            break
                        case 'Broadcasting':
                            setProgress(80)
                            break
                        case 'Failed':
                            setTipstring('Close')
                            clearInterval(intervalId)
                            break
                        case "Completed":
                            setProgress(100)
                            setTipstring('Close')
                            clearInterval(intervalId)
                            break
                    }
                })
            }, 5000);
        }
        catch (e) {

        }
    }
    return (
        <div>
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Transaction</h3>
                            <div>{tranctionState}</div>
                            <div id="progress-container">

                                <div className="progress-bar">
                                    <div style={{ width: `${progress}%` }} className="progress"></div>
                                </div>

                            </div>
                            <button onClick={closeModal}>{tipstring}
                            </button>

                        </div>
                    </div>
                </div>
            )}



        </div>
    );
}




export default Pop;

