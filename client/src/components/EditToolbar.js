import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    let enabledButtonClass = "playlister-button";

    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleAddSong(){
        store.addAddSongTransaction();
    }
    function handleClose() {
        history.push("/");
        store.closeCurrentList();
    }
    let editStatus = false;
    if (store.isListNameEditActive) {
        editStatus = true;
    }
    let undoStatus = false;
    if (!store.hasTransactionToUndo()){
        undoStatus = true;
    }
    let redoStatus = false;
    if (!store.hasTransactionToRedo()){
        redoStatus = true;
    }
    let listEditActive = true;
    if (!store.listEditActive()){
        listEditActive = false;
    }
    return (
        <span id="edit-toolbar"
        >
            <input
                type="button"
                id='add-song-button'
                disabled={editStatus||!listEditActive}
                value="+"
                className={enabledButtonClass+"-add"}
                onClick={handleAddSong}
            />
            <input
                type="button"
                id='undo-button'
                disabled={editStatus||undoStatus}
                value="⟲"
                className={enabledButtonClass}
                onClick={handleUndo}
            />
            <input
                type="button"
                id='redo-button'
                disabled={editStatus||redoStatus}
                value="⟳"
                className={enabledButtonClass}
                onClick={handleRedo}
            />
            <input
                type="button"
                id='close-button'
                disabled={editStatus||!listEditActive}
                value="&#x2715;"
                className={enabledButtonClass}
                onClick={handleClose}
            />
        </span>);
}

export default EditToolbar;