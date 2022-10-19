import jsTPS_Transaction from "../common/jsTPS.js"

/**
 * MoveSong_Transaction
 * 
 * This class represents a transaction that works with remove.
 *  It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author Diego Sandoval
 */
export default class MoveSong_Transaction extends jsTPS_Transaction {
    constructor(store,initSource, initDest) {
        super();
        this.store = store;
        this.source = initSource;
        this.destination = initDest;
    }
    doTransaction() {
        this.store.moveSong(this.source, this.destination);
    }
    undoTransaction() {
        this.store.moveSong(this.destination,this.source);
    }
}