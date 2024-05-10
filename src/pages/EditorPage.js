import React, { useEffect, useRef, useState } from 'react'
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import ACTIONS from '../Actions';
import { Navigate, useLocation, useNavigate,useParams } from 'react-router-dom';
import toast from 'react-hot-toast';



const EditorPage = () => {


  const socketRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  // console.log(params)

  const reactNavigator = useNavigate();

  useEffect(() => {

    const init = async () => {

      socketRef.current = await initSocket();
      //error handlers
      socketRef.current.on('connection_error', (err) => handleErrors(err));
      socketRef.current.on('connection_failed', (err) => handleErrors(err));

      function handleErrors(e) {
        console.log('socket error', e);
        toast.error('Socket connection failed,try again later.')
        reactNavigator('/');

      }
        socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        userName: location.state?.userName,

      });

    };

    init();

    
  }, []);

  const [clients, setClients] = useState([
    { socketId: 1, userName: 'Ankit Chouhan' },
    { socketId: 2, userName: 'Sakshi Patel' },
    { socketId: 3, userName: 'Arun' },
  ]);
   
  if (!location.state) {
    return <Navigate to="/" />
  }
  
  return (
    <div className='mainWrap'>
      
      <div className='aside'>

        <div className='asideInner'>
          <div className='logo'>
            <img
              className='logoImage'
              src='/code-sync.png'
              alt='logo'
            />
          </div>

          <h3>Connected</h3>

          <div className='clientsList'>
            {
              clients.map(client => (
                <Client
                  key={ client.socketId }
                  userName={client.userName}
                />
              ))
            }

          </div>


        </div>

        <button className='btn copyBtn'> Copy ROOM ID </button> 
        <button className='btn leaveBtn'> Leave </button> 
    
      </div>


      <div className='editorWrap'>

        <Editor/>
         
      </div>
      
    </div>
  )
}

export default EditorPage
