import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);

    const { song, index } = props;

    let cardClass = "list-card unselected-list-card";
    function handleRemoveSong(event){
        event.stopPropagation();
        let _id = event.target.id;
        if (_id.indexOf('remove-song-') >= 0)
            _id = ("" + _id).substring("remove-song-".length);
        store.markSongForRemoval(parseInt(_id-1));
    }

    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
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