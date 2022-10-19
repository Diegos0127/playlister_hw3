import jsTPS_Transaction from "../common/jsTPS.js"

/**
 * EditSong_Transaction
 * 
 * This class represents a transaction that works with remove.
 *  It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author Diego Sandoval
 */
export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(store,initIndex) {
        super();
        this.store = store;
        this.index = initIndex;
        this.oldSong = store.currentList.songs[initIndex];
        this.newSong = {
            title: document.getElementById("edit-song-modal-title-textfield").value,
            artist: document.getElementById("edit-song-modal-artist-textfield").value,
            youTubeId: document.getElementById("edit-song-modal-youTubeId-textfield").value
        }
    }
    doTransaction() {
        this.store.editSong(this.newSong, this.index);
    }
    undoTransaction() {
        this.store.editSong(this.oldSong, this.index);
    }
}
