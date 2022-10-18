import jsTPS_Transaction from "../common/jsTPS.js"

/**
 * AddSong_Transaction
 * 
 * This class represents a transaction that works with remove.
 *  It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author Diego Sandoval
 */
export default class AddSong_Transaction extends jsTPS_Transaction {
    constructor(store) {
        super();
        this.store = store;
    }
    doTransaction() {
        this.store.addSong();
    }
    undoTransaction() {
        this.store.removeSong(this.store.currentList.songs.length-1);
    }
}
