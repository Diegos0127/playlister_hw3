import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
/*
    This modal is a functional React component that
    creates the Delete List Modal.
    
    @author McKilla Gorilla
*/

function DeleteListModal() {
    const { store } = useContext(GlobalStoreContext);
    let name = "";
    if (store.markedList) {
        name = store.markedList.name;
    }
    function handleDeleteConfirm(event) {
        event.stopPropagation();
        store.deletePlaylist();
    }
    function handleDeleteCancel(event) {
        event.stopPropagation();
        store.cancelListDeletion();
    }
     return (
        <div 
            className="modal" 
            id="delete-list-modal" 
            data-animation="slideInOutLeft">
                <div className="modal-root" id='verify-delete-list-root'>
                    <div className="modal-north">
                        Delete playlist?
                    </div>
                    <div className="modal-center">
                        <div className="modal-center-content">
                            Are you sure you wish to permanently delete the <strong>{name}</strong> playlist?
                        </div>
                    </div>
                    <div className="modal-south">
                        <input type="button" 
                            id="delete-list-confirm-button" 
                            className="modal-button" 
                            onClick={handleDeleteConfirm}
                            value='Confirm' />
                        <input type="button" 
                            id="delete-list-cancel-button" 
                            className="modal-button" 
                            onClick={handleDeleteCancel}
                            value='Cancel' />
                    </div>
                </div>
        </div>
     );
}
export default DeleteListModal;