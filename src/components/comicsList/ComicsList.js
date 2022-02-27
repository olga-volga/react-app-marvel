import {useState, useEffect} from 'react';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';
//import uw from '../../resources/img/UW.png';
//import xMen from '../../resources/img/x-men.png';

const ComicsList = () => {
    const [comics, setComics] = useState([]);
    const [loadMoreComics, setLoadMoreComics] = useState(false);
    const [offset, setOffset] = useState(10);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, clearError, getAllComics} = useMarvelService();
    
    useEffect(() => {
        if (!comicsEnded) {
            updateComics(offset, true);
        }
    }, []);

    const onLoadedComics = (newComics) => {
        setComics(comics => [...comics, ...newComics]);
        setLoadMoreComics(false);
        setOffset(offset => offset + 8);
        setComicsEnded(newComics.length < 8 ? true : false);
    }
    const updateComics = (offset, initial) => {
        initial ? setLoadMoreComics(false) : setLoadMoreComics(true);
        
        getAllComics(offset)
            .then(onLoadedComics)
    }
    const renderComics = (comics) => {
        const items = comics.map((item, i) => {
            const {id, name, url, thumbnail, price} = item;
            return (
                <li key={i} className="comics__item">
                    <a href={url}>
                        <img src={thumbnail} alt={name} className="comics__item-img"/>
                        <div className="comics__item-name">{name}</div>
                        <div className="comics__item-price">{`${price}$`}</div>
                    </a>
                </li>
            );
        });
        return (
            <ul className="comics__grid">
                {items}
            </ul>
        );
    }
    const comicsList = renderComics(comics);
    const spinner = loading && !loadMoreComics ? <Spinner /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;

    return (
        <div className="comics__list">
            {spinner}
            {errorMessage}
            {comicsList}
            <button 
                className="button button__main button__long" 
                disabled={loadMoreComics}
                onClick={() => updateComics(offset)}
                style={{display: comicsEnded ? 'none' : null}}>
                    <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;