// OUR TRANSACTIONS
import MoveSong_Transaction from '../transactions/MoveSong_Transaction.js';
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction.js';
import AddSong_Transaction from '../transactions/AddSong_Transaction.js';
import EditSong_Transaction from '../transactions/EditSong_Transaction.js';

import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    DELETE_MARKED_LIST: "DELETE_MARKED_LIST",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    MARK_SONG: "MARK_SONG",
    CANCEL_ACTION: "CANCEL_ACTION",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();
let ctrlPressed = false;
// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    console.log("starting");
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        markedList: null,
        markedSong: null
    });
    document.onkeydown = (keyEvent) => {
        if (keyEvent.key.toLowerCase() === "control") {
            ctrlPressed = true;
        }
        else if (keyEvent.key.toLowerCase() === "z") {
            if (ctrlPressed&&tps.hasTransactionToUndo()) {
                store.undo();
            }
        }
        else if (keyEvent.key.toLowerCase() === "y") {
            if (ctrlPressed&&tps.hasTransactionToRedo()) {
                store.redo();
            }
        }
    }
    document.onkeyup = (keyEvent) => {
        if(keyEvent.key.toLowerCase() === "control")
            ctrlPressed = false;
    }

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false
                })
            }
            // DELETE A LIST
            case GlobalStoreActionType.DELETE_MARKED_LIST: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter - 1,
                    listNameActive: false,
                    markedList: null
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    markedList: null,
                    markedSong: null
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                console.log(payload);
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    markedList: payload
                });
            }
            // PREPARE TO REMOVE A SONG
            case GlobalStoreActionType.MARK_SONG: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    markedList: null,
                    markedSong: payload
                });
            }
            // CANCELING AN ACTION OF MARKED LIST
            case GlobalStoreActionType.CANCEL_ACTION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    markedList: null,
                    markedSong: null
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    markedList: null,
                    markedSong: store.markedSong
                    
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true
                });
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }
    // THIS FUNCTION PROCESSES ADDING A LIST
    store.createNewList = function () {
        // GET THE LIST
        async function asyncCreateNewList() {
            let response = await api.createPlaylist();
            if (response.data.success) {
                let playlist = response.data.playlist;
                async function getListPairs(playlist) {
                    response = await api.getPlaylistPairs();
                    if (response.data.success) {
                        store.idNamePairs = response.data.idNamePairs;
                        storeReducer({
                            type: GlobalStoreActionType.CREATE_NEW_LIST,
                            payload: playlist
                        });
                        store.history.push("/playlist/" + playlist._id);
                    }
                }
                getListPairs(playlist);
            }       
        }
        asyncCreateNewList();
    }
    //THIS FUNCTION DELETES A LIST
    store.deletePlaylist = function(){
        async function asyncDeleteList() {
            let response = await api.deletePlaylist(store.markedList._id);
            if(response.data.success){
                async function getListPairs() {
                    response = await api.getPlaylistPairs();
                    if (response.data.success) {
                        storeReducer({
                            type: GlobalStoreActionType.DELETE_MARKED_LIST,
                            payload: response.data.idNamePairs
                        });
                    }
                }
                getListPairs();
            }
            store.hideDeleteListModal();
        }
        asyncDeleteList()
    }
    // THIS FUNCTION PROCESSES MARKING A LIST FOR DELETION
    store.markPlaylistForDeletion = function(id) {
        store.showDeleteListModal();
        async function asyncGetPlaylist(id){
            let response = await api.getPlaylistById(id)
            if(response.data.success){
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: response.data.playlist
                });
            }   
        }
        asyncGetPlaylist(id);
    }
    // THIS FUNCTION CANCELS DELETION OF A LIST
    store.cancelListDeletion = function(){
        store.hideDeleteListModal();
        console.log("Deletion of Playlist canceled")
        storeReducer({
            type: GlobalStoreActionType.CANCEL_ACTION,
            payload: null
        });
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST
    store.showDeleteListModal = function() {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.add("is-visible");
    }
    // THIS FUNCTION IS FOR HIDING THE MODAL
    store.hideDeleteListModal = function() {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.remove("is-visible");
    }
    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        tps.clearAllTransactions();
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }
    //THIS FUNCTION IS FOR MARKING A SONG FOR ANY ACTION
    store.markSong = function (index) {
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG,
            payload: index
        });
      }
   
    // THIS FUNCTION ADDS A AddSong_Transaction TO THE TRANSACTION STACK
    store.addAddSongTransaction = function () {
        let transaction = new AddSong_Transaction(store);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION PROCESSES ADDING A SONG
    store.addSong = function (newSong, start, end) {
        // GET THE LIST
        async function asyncCreateNewSong() {
            let response = await api.getPlaylistById(store.currentList._id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                async function addSong(playlist) {
                    let newSongs = playlist.songs;
                    let addee = {
                        title: "Untitled",
                        artist: "Unknown",
                        youTubeId: "dQw4w9WgXcQ"
                    };
                    if(newSong)
                        addee = newSong
                    newSongs.push(addee);
                    response = await api.updatePlaylistSongs(playlist._id,newSongs);
                    if (response.data.success) {
                        async function getUpdatedList(){
                            let response = await api.getPlaylistById(store.currentList._id);
                            if (response.data.success) {
                                store.currentList = response.data.playlist;
                                storeReducer({
                                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                                    payload: store.currentList
                                });
                                if((start||start===0) && (end||end===0)){
                                    store.moveSong(start,end);
                                }
                            }
                        }
                        getUpdatedList();
                    }
                }
                addSong(playlist);
            }       
        }
        asyncCreateNewSong();
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = function (index) {
        let transaction = new RemoveSong_Transaction(store, index);
        tps.addTransaction(transaction);
    }
    //Mark a song to potentially be removed and open the remove song modal
    store.markSongForRemoval = function(index){
        let removeeSong = store.currentList.songs[index];
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG,
            payload: removeeSong
        });
        store.showRemoveSongModal();
    }

    //THIS FUNCTION IS FOR REMOVING A MARKED SONG
    store.removeSong = function(index) {
        store.hideRemoveSongModal();
        console.log("Whole list");
        console.log(store.currentList.songs);
        async function asyncRemoveSong(){
            let newSongs = [];
            let markedSong = null;
            if(index||index===0){
                markedSong = store.currentList.songs[index];
            }
            else{
                markedSong = store.markedSong;
            }
            for (let i = 0; i < store.currentList.songs.length; i++){
                if(markedSong._id!==store.currentList.songs[i]._id){
                    newSongs.push(store.currentList.songs[i]);
                }
            }
            let response = await api.updatePlaylistSongs(store.currentList._id,newSongs);
            if (response.data.success) {
                store.currentList.songs = newSongs;
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }   
        asyncRemoveSong();
    }
    // THIS FUNCTION IS FOR WHEN REMOVING A SONG IS CANCELED
    store.cancelSongRemoval = function() {
        store.hideRemoveSongModal()
        store.markedSong = null;
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO REMOVE A SONG
    store.showRemoveSongModal = function() {
        let modal = document.getElementById("remove-song-modal");
        modal.classList.add("is-visible");
    }
    //THIS FUNCTION IS FOR HIDING THE REMOVE SONG MODAL
    store.hideRemoveSongModal = function() {
        let modal = document.getElementById("remove-song-modal");
        modal.classList.remove("is-visible");
    }
    //THIS FUNCTION IS FOR EDITIG A SONG
    store.editSong = function(newSong, index){
        store.hideEditSongModal();
        let oldSong = store.markedSong;
        if(index||index===0)
            oldSong = store.currentList.songs[index];
        async function asyncEditSong(){
            let newSongs = [];
            for (let i = 0; i < store.currentList.songs.length; i++){
                if(oldSong._id!==store.currentList.songs[i]._id)
                    newSongs.push(store.currentList.songs[i]);
                else
                    newSongs.push({
                        _id: oldSong._id,
                        title: newSong.title,
                        artist: newSong.artist,
                        youTubeId: newSong.youTubeId
                    });
            }
            let response = await api.updatePlaylistSongs(store.currentList._id,newSongs);
            if (response.data.success) {
                store.currentList.songs = newSongs;
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }   
        asyncEditSong();
    }
    //THIS FUNCTION IS FOR EDITING A SONG
    store.markSongForEdit = function(index) {;
        let editSong = store.currentList.songs[index];
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG,
            payload: editSong
        });
        store.showEditSongModal();
    }
    //THIS FUNCTION IS FOR MAKING AN EDIT SONG TRANSACTION
    store.addEditSongTransaction= function (index){
        let transaction = new EditSong_Transaction(store, index);
        tps.addTransaction(transaction);
    }
    //THIS FUNCTION RETURN VALUE OF CURRENT MARKED LIST TITLE
    store.currentMarkedSongTitle = function(){
        if(store.markedSong)
            return store.markedSong.title;
        return "Untitled";
    }
    // THIS FUNCTION IS FOR WHEN EDITING A SONG IS CANCELED
    store.cancelSongEdit = function() {
        store.hideEditSongModal()
        store.markedSong = null;
    }
    //FUNCTION TO SHOW EDIT SONG MODAL
    store.showEditSongModal = function() {
        let modal = document.getElementById("edit-song-modal");
        modal.classList.add("is-visible");
    }   
    //FUNCTION TO SHOW EDIT SONG MODAL
    store.hideEditSongModal = function() {
        let modal = document.getElementById("edit-song-modal");
        modal.classList.remove("is-visible");
    }
    //FUNCTION TO ADD A MOVE A SONG TRANSACTION
    store.addMoveSongTransaction = (start, end) => {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    //FUNCTION TO MOVE A SONG
    store.moveSong = (start, end) => {
        let list = store.currentList;
        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }
        async function asyncMoveSong(){
            let response = await api.updatePlaylistSongs(store.currentList._id,list.songs);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncMoveSong();
    }
    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.setCurrentList = function (id) {
        tps.clearAllTransactions();
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }
    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.hasTransactionToUndo = function () {
        return tps.hasTransactionToUndo();
    }
    store.hasTransactionToRedo = function () {
        return tps.hasTransactionToRedo();
    }

    store.listEditActive = function (){
        if(store.currentList){
            return true;
        }
        return false; 
    }
    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setlistNameActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}