import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
/*
    This modal is a functional React component that
    creates the Edit Song Modal.
    
    @author McKilla Gorilla
*/


const EditSongModal = () => {
    const { store } = useContext(GlobalStoreContext);
    const [ textTitle, setTextTitle ] = useState("Untitled");
    const [ textArtist, setTextArtist ] = useState("Unknown");
    const [ textYouTubeId, setTextYouTubeId ] = useState("dQw4w9WgXcQ");
    const [ count, setCounter] = useState(0);

    console.log("open edit");
    console.log("count:"+count);
    if (store.markedSong && count===0) {
        console.log(store.markedSong.title);
        setTextTitle(store.markedSong.title);
        setTextArtist(store.markedSong.artist);
        setTextYouTubeId(store.markedSong.youTubeId);
        setCounter(1);
    }
    function handleEditConfirm(event) {
        event.stopPropagation();
        setCounter(0);
        let index = 0;
        for (let i = 0; i < store.currentList.songs.length; i++){
            if(store.markedSong._id===store.currentList.songs[i]._id){
                index = i;
            }
        }
        store.addEditSongTransaction(index);
    }
    function handleEditCancel(event) {
        event.stopPropagation();
        setCounter(0);
        store.cancelSongEdit();
    }
    return (
        <div
            id="edit-song-modal"
            className="modal"
            data-animation="slideInOutLeft">
            <div
                id='edit-song-root'
                className="modal-root">
                <div
                    id="edit-song-modal-header"
                    className="modal-north">Edit Song</div>
                <div
                    id="edit-song-modal-content"
                    className="modal-center">
                    <div id="title-prompt" className="modal-prompt">Title:</div>
                    <input id="edit-song-modal-title-textfield" className='modal-textfield' type="text" defaultValue={textTitle} onChange={(e)=>setTextTitle(e.target.value)} />
                    <div id="artist-prompt" className="modal-prompt">Artist:</div>
                    <input id="edit-song-modal-artist-textfield" className='modal-textfield' type="text" defaultValue={textArtist} onChange={(e)=>setTextArtist(e.target.value)} />
                    <div id="you-tube-id-prompt" className="modal-prompt">You Tube Id:</div>
                    <input id="edit-song-modal-youTubeId-textfield" className='modal-textfield' type="text" defaultValue={textYouTubeId} onChange={(e)=>setTextYouTubeId(e.target.value)} />
                </div>
                <div className="modal-south">
                    <input type="button" id="edit-song-confirm-button" className="modal-button" value='Confirm' onClick={handleEditConfirm} />
                    <input type="button" id="edit-song-cancel-button" className="modal-button" value='Cancel' onClick={handleEditCancel} />
                </div>
            </div>
        </div>
    );
}

export default EditSongModal;