import React from 'react'
import './Chatbox.css'
import { IoIosSend } from "react-icons/io";
import ReactMarkdown from 'react-markdown';
import Loader from '../Loader/Loader';

const Chatbox = ({ response, question, setQuestion,loading ,explainCode }) => {


    const handleDoubt = (e) => {

        e.preventDefault();

        explainCode()
    }
    return (
        <>
            <div className="chatbox">
                {

                    loading ? <Loader /> : (
                        <>
                            <div className="chat-area markdown-content">
                                <ReactMarkdown>{response}</ReactMarkdown>
                            </div>
                        </>
                    )
                }



            
                <form className="chatInput">

                    <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder='Ask your doubt' />
                    <button type='submit' onClick={handleDoubt} className='sendchat-btn'>
                        <IoIosSend />
                    </button>
                </form>

            </div>
        </>
    )
}

export default Chatbox