import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);

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

    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
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