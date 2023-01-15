import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom'
import './App.css'
import send from './assets/send.svg'
import clip from './assets/paperclip.svg'
import smile from './assets/smile.svg'
import useChat from './service/useChat';
import video from './assets/video.svg';
import voice from './assets/phone.svg';
import option from './assets/menu.svg';
import back from './assets/arrow-left.svg';
import EmojiPicker from 'emoji-picker-react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';


function App() {
  const { messages, sendMessage, sendFile } = useChat('test');  //Custom useChat Hook
  const [message, setMessage] = useState('')
  const [emojiSection, setEmojiSection] = useState(false)
  const [file, setFile] = useState(null)
  let successMsg = ''

  const textInput = useRef(null);
  const messageReceived = useRef(null)
  const successMsgRef = useRef(null)

  function changeHandler(e) {
    setMessage(e.target.value)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      submitMessageHandler()
    }
  }

  function submitMessageHandler() {
    if (message.length !== 0) {
      sendMessage(message) //custom hook functions
      textInput.current.value = ''; //setting the textinput to null 
      setMessage('')
    }
  }

  useEffect(() => {
    messageReceived.current?.scrollIntoView({
      behavior: 'smooth',
      block: "center",
      inline: "start",
    })
    window.scrollTo(0, 1)
    successMsgRef.current.style.backgroundColor = 'transparent';
  })

  function getEmoji(e) {
    let emojis = String(e.emoji);
    textInput.current.value += emojis;
    setMessage(textInput.current.value)
  }

  function emojiHandler() {
    setEmojiSection(!emojiSection)
  }

  const fileUploadHandler = (e) => {
    console.log("File: ", e.target.files[0])
    sendFile(e.target.files[0])
    successMsgRef.current.style.backgroundColor = '#3AA589';
    successMsgRef.current.innerText = "File Uploaded Successfully"


    setTimeout(() => {
      successMsgRef.current.innerText = ""
      successMsgRef.current.style.backgroundColor = 'transparent';
    }, 2000)
  }

  return (
    <div>
      <Routes>

        <Route path='/' element={
          <>
            <Navbar />

            <div className='main'>
            <p className='successMsg' ref={successMsgRef} >{successMsg}</p>
            <header className='topBar'>
              <img alt='back-arrow' className='back-icon' src={back} />
              <img alt='avatar' className='avatar' src='//unsplash.it/100/100' />
              <p className='roomName' >Public Room</p>
              <img alt='video-icon' className='video-icon' src={video} />
              <img alt='voice-icon' className='voice-icon' src={voice} />
              <img alt='option-icon' className='option-icon' src={option} />
            </header>

           <Sidebar/>

            <div className='chatInputWrapper'>
              <div className='chatWrapper' >
                {
                  messages.map((item, index) => (
                    <p className={`chats ${item.ownedByCurrentUser === true ? 'own-message' : 'others-message'
                      }`} key={index} ref={messageReceived} >{item.body}</p>
                  ))
                }
              </div>

              <div className='inputWrapper'>
                <div className='textInputOuterWrapper'>
                  <img alt='emoji-icon' className='emojiButton' src={smile} onClick={emojiHandler} />
                  <input className='textInput' onKeyDown={handleKeyDown} type='text' ref={textInput} onChange={changeHandler} placeholder='Type a message' autoComplete='none' />
                  {/* <input type='file' onChange={fileUploadHandler} /> */}
                  <div className="image-upload">
                    <label htmlFor="file-input">
                      <img alt='clip-icon' src={clip} />
                    </label>
                    <input id="file-input" type="file" onChange={fileUploadHandler} />
                  </div>
                </div>
                <button className='submitButton' onClick={submitMessageHandler}> <img alt='send-button' className='sendButton' src={send} /> </button>
              </div>

              {
                (emojiSection === true) ? <EmojiPicker onEmojiClick={getEmoji} emojiStyle={'google'} Theme azyLoadEmojis='true'
                  searchDisabled='false' className='emojiPicker' height='100vh' width='100vw' previewConfig={{
                    showPreview: false, // defaults to: true
                  }} /> : ''
              }

            </div>
            </div>
          </>
        } />

      </Routes>
    </div>
  );
}

export default App;