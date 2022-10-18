import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
/*
    This toolbar is a functional React component that
    manages the Remove Song Modal.
    
    @author Diego Sandoval
*/

function RemoveSongModal() {
    const { store } = useContext(GlobalStoreContext);
    let title = "";
    let index = 0;
    if (store.markedSong) {
        title = store.markedSong.artist;
        for (let i = 0; i < store.currentList.songs.length; i++){
            if(store.markedSong._id===store.currentList.songs[i]._id){
                index = i;
            }
        }

    }
    function handleRemoveConfirm(event) {
        event.stopPropagation();
        store.addRemoveSongTransaction(index);
    }
    function handleRemoveCancel(event) {
        event.stopPropagation();
        store.cancelSongRemoval();
    }
     return (
        <div 
            className="modal" 
            id="remove-song-modal" 
            data-animation="slideInOutLeft">
                <div className="modal-root" id='verify-remove-song-root'>
                    <div className="modal-north">
                        Remove song?
                    </div>
                    <div className="modal-center">
                        <div className="modal-center-content">
                            Are you sure you wish to permanently remove <strong>{title}</strong> from the playlist?
                        </div>
                    </div>
                    <div className="modal-south">
                        <input type="button" 
                            id="remove-song-confirm-button" 
                            className="modal-button" 
                            onClick={handleRemoveConfirm}
                            value='Confirm' />
                        <input type="button" 
                            id="remove-song-cancel-button" 
                            className="modal-button" 
                            onClick={handleRemoveCancel}
                            value='Cancel' />
                    </div>
                </div>
        </div>
     );
}
export default RemoveSongModal;