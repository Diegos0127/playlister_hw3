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
    MARK_SONG_FOR_REMOVAL: "MARK_SONG_FOR_REMOVAL",
    CANCEL_ACTION: "CANCEL_ACTION",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

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
                    listNameActive: false
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    markedList: payload
                });
            }
            // PREPARE TO REMOVE A SONG
            case GlobalStoreActionType.MARK_SONG_FOR_REMOVAL: {
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
                    markedList: null
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false
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
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }
    // THIS FUNCTION PROCESSES ADDING A SONG
    store.createNewSong = function () {
        // GET THE LIST
        async function asyncCreateNewSong() {
            let response = await api.getPlaylistById(store.currentList._id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                async function addSong(playlist) {
                    let newSongs = playlist.songs;
                    newSongs.push({
                        title: "Untitled",
                        artist: "Unknown",
                        youTubeId: "dQw4w9WgXcQ"
                    });
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
    //Mark a song to potentially be removed and open the remove song modal MARK_SONG_FOR_REMOVAL
    store.markSongForRemoval = function(index){
        console.log("hello");
        let removeeSong = store.currentList.songs[index];
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG_FOR_REMOVAL,
            payload: removeeSong
        });
        store.showRemoveSongModal();
    }
    //THIS FUNCTION IS FOR REMOVING A MARKED SONG
    store.removeSong = function() {
        store.hideRemoveSongModal();
        async function asyncRemoveSong(){
            let newSongs = [];
            for (let i = 0; i < store.currentList.songs.length; i++){
                if(store.markedSong._id!=store.currentList.songs[i]._id){
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