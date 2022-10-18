import jsTPS_Transaction from "../common/jsTPS.js"

/**
 * RemoveSong_Transaction
 * 
 * This class represents a transaction that works with remove.
 *  It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author Diego Sandoval
 */
export default class RemoveSong_Transaction extends jsTPS_Transaction {
    constructor(store,initIndex) {
        super();
        this.store = store;
        this.index = initIndex
    }
    doTransaction() {
        this.store.removeSong(this.index);
    }
    undoTransaction() {
        this.store.addSong();
    }
}