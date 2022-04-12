import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const createContent = (process, Component, loadMoreComics) => {
    switch(process) {
        case 'waiting':
            return <Spinner />;
            break;
        case 'loading':
            return loadMoreComics ? <Component /> : <Spinner />;
            break;
        case 'confirmed':
            return <Component />;
            break;
        case 'error':
            return <ErrorMessage />;
            break;
        default:
            throw new Error('Unexpected process state');
    }
}

const ComicsList = () => {
    const [comics, setComics] = useState([]);
    const [loadMoreComics, setLoadMoreComics] = useState(false);
    const [offset, setOffset] = useState(10);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {getAllComics, process, setProcess} = useMarvelService();
    
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
            .then(() => setProcess('confirmed'))
    }
    const renderComics = (comics) => {
        const items = comics.map((item, i) => {
            const {id, name, thumbnail, price} = item;
            return (
                <li key={i} className="comics__item">
                    <Link to={`/comics/${id}`}>
                        <img src={thumbnail} alt={name} className="comics__item-img"/>
                        <div className="comics__item-name">{name}</div>
                        <div className="comics__item-price">{`${price}$`}</div>
                    </Link>
                </li>
            );
        });
        return (
            <ul className="comics__grid">
                {items}
            </ul>
        );
    }

    return (
        <div className="comics__list">
            {createContent(process, () => renderComics(comics), loadMoreComics)}
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