import React, {Component, useEffect, useState} from 'react';
import PopStyle from './pop.css'
import {leoWallet, message_root} from "../Config";



function Pop(pros) {
    const transactionid = pros.transactionId
    const [isModalOpen, setModalOpen] = useState(true);
    const [progress,setProgress] = useState(0)
    const [tranctionState,setTranctionState] = useState('')
    //const [tipstring,setTipstring] = useState('Work in the background')
    let  intervalId;
    let actionTimes = 0
    useEffect(() => {
        get_transactionState()

        return () => {
            clearInterval(intervalId)
        };
    }, []);


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

            intervalId = setInterval(function() {
                actionTimes++
                if(actionTimes>=50){
                    closeModal()
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
                            //setTipstring('Close')
                            clearInterval(intervalId)
                            break
                        case "Completed" || "Finalized":
                            setProgress(100)
                            //setTipstring('Close')
                            closeModal()
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

                    <div className='pop-modal'>
                        <div className='pop-close-button' onClick={closeModal}>
                            <img className='pop-ico-img' src={'close.png'}/>
                        </div>
                            <h3>{tranctionState}</h3>
                            <div className='progress-container' id="progress-container">
                                    <div style={{ width: `${progress}%` }} className="progress"></div>
                        </div>
                    </div>
                </div>
            )}



        </div>
    );
}




export default Pop;

