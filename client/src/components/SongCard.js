import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [ isDragging, setIsDragging ] = useState(false)
    const [ draggedTo, setDraggedTo ] = useState(false)
    const { song, index } = props;
    
    let cardClass = "list-card unselected-list-card";
    function handleClick (event) {
        if (event.detail === 2) {
            let index = event.target.id.slice(5,event.target.id.length-5);
            store.markSongForEdit(parseInt(index));
        }
    }
    function handleRemoveSong(event){
        event.stopPropagation();
        let _id = event.target.id;
        if (_id.indexOf('remove-song-') >= 0)
            _id = ("" + _id).substring("remove-song-".length);
        store.markSongForRemoval(parseInt(_id));
    }
    function handleDragStart (event) {
        event.dataTransfer.setData("song", props.index);
        setIsDragging(true);
    }
    function handleDragOver (event)  {
        event.preventDefault();
        setDraggedTo(true);
    }
    function handleDragEnter (event) {
        event.preventDefault();
        setDraggedTo(true);
    }
    function handleDragLeave (event)  {
        event.preventDefault();
        setDraggedTo(false);
    }
    function handleDrop (event) {
        event.preventDefault();
        let targetIndex = props.index;
        let sourceIndex = Number(event.dataTransfer.getData("song"));
        setIsDragging(false);
        setDraggedTo(false);
        console.log(targetIndex);
        console.log(sourceIndex);
        store.addMoveSongTransaction(sourceIndex, targetIndex);
    }
    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true"
            className={cardClass}
            onClick={handleClick}
        >
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                onClick={handleRemoveSong}
                value={"\u2715"}
            />
        </div>
    );
}

export default SongCard;