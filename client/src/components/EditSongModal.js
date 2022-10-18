import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
/*
    This modal is a functional React component that
    creates the Edit Song Modal.
    
    @author McKilla Gorilla
*/


function EditSongModal() {
    const { store } = useContext(GlobalStoreContext);
    let song = {title: "Untitled", artist: "Unknown", youTubeId: "dQw4w9WgXcQ"};
    let index = 0;
    console.log("Open edit");
    if (store.markedSong) {
        song = store.markedSong;
        console.log(store.markedSong);
    }
    function handleUpdate(event) {
        console.log(event.target.value);
    }
    function handleEditConfirm(event) {
        event.stopPropagation();
        for (let i = 0; i < store.currentList.songs.length; i++){
            if(store.markedSong._id===store.currentList.songs[i]._id){
                index = i;
            }
        }
        store.addEditSongTransaction(index);
    }
    function handleEditCancel(event) {
        event.stopPropagation();
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
                    <input id="edit-song-modal-title-textfield" className='modal-textfield' type="text" defaultValue={song.title} onChange={handleUpdate} />
                    <div id="artist-prompt" className="modal-prompt">Artist:</div>
                    <input id="edit-song-modal-artist-textfield" className='modal-textfield' type="text" defaultValue={song.artist} onChange={handleUpdate} />
                    <div id="you-tube-id-prompt" className="modal-prompt">You Tube Id:</div>
                    <input id="edit-song-modal-youTubeId-textfield" className='modal-textfield' type="text" defaultValue={song.youTubeId} onChange={handleUpdate} />
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