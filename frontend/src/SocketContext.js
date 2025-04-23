    import React, { useState, createContext, useRef, useEffect } from 'react';
    import { io } from 'socket.io-client';
    import  Peer  from 'simple-peer/simplepeer.min.js';

    const SocketContext = createContext();

    const socket = io('http://localhost:5000');

    const ContextProvider = ({ children }) => {
        const myVideo = useRef();
        const [ stream, setStream ] = useState(null);
        const [ me, setMe ] = useState('');
        const [ call, setCall ] = useState({});
        const [ callAccepted, setCallAccepted ] = useState(false);
        const [ callEnded, setCallEnded ] = useState(false);
        const [ name, setName ] = useState('');
        const userVideo = useRef();
        const connectionRef = useRef();


        useEffect(() => {
            
        
            // ✅ This ensures we receive "me" every time socket reconnects
            socket.on('me', (id) => {
                console.log("New connection:", id);
                setMe(id); // No need to wait for 'me' emit
              });
            
        
            // Still listen for incoming call
            socket.on('callUser', ({ from, callerName, signal }) => {
            setCall({ isReceivedCall: true, from, name: callerName, signal });
            });
        
            // ✅ Clean up listeners on component unmount (optional)
            return () => {
      
            socket.off('connect')
            socket.off('callUser');
            };
        }, []);

      

        const answerCall = () => {
            setCallAccepted(true);

            const peer = new Peer({ initiator: false, trickle: false, stream })

            // listen for call and sharing the signal data
            peer.on('signal', (data) => {
                socket.emit('answerCall', { signal: data, to: call.from });
            });

            // Now when we receive the data, set it to our video element 
            peer.on('stream', (currentStream) => {
                userVideo.current.srcObject = currentStream;
            });

            //feed signal data into peer connection
            peer.signal(call.signal);

            //Storing Current peer connection in ref
            connectionRef.current = peer;
        }

        const callUser = (id) => {

            //create a peer connection, but this time you will be the initiator
            const peer = new Peer({ initiator: true, trickle: false, stream })

            //send the call offer to backend and backend then send the offer to the callee
            peer.on('signal', (data) => {
                socket.emit('callUser', { userToCall: id, signalData: data, from: me, callerName:name })
            })

            // Now when we receive the data, set it to our video element 
            peer.on('stream', (currentStream) => {
                userVideo.current.srcObject = currentStream;
            });

            //After callee accepts the call, backedn sends back their signal 
            socket.on('callAccepted', (signal) => {
                setCallAccepted(true);
                peer.signal(signal); //complete the handshake
            })

            //store the connection in ref
            connectionRef.current = peer;

        }

        const endCall = () => {

            //change the state
            setCallEnded(true);

            //Close the peer connection and stop media 
            connectionRef.current.destroy();

            //Reload the page to get the new id
             window.location.reload();

        }

        return (
            //pass the state and methods to the children
            <SocketContext.Provider value={{ call, callAccepted, callEnded, me, name, setName, stream, myVideo, userVideo, callUser, answerCall, endCall,setStream, socket }}>
                {children}
            </SocketContext.Provider>
        )
    }

    export {ContextProvider, SocketContext};