import {useParams, Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import AppBanner from '../appBanner/AppBanner';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './singleComicPage.scss';

const SingleCharPage = () => {
    const {charId} = useParams();
    const [char, setChar] = useState(null);

    const {loading, error, clearError, getCharacter} = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [charId])

    const onCharLoaded = (data) => {
        setChar(data);
    }
    const updateChar = () => {
        clearError();
        getCharacter(charId)
            .then(onCharLoaded)
    }
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(!char || loading || error) ? <View char={char} /> : null;
    return (
        <>
            <AppBanner />
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

const View = ({char}) => {
    const {name, fullDescription, thumbnail, comics} = char;
    const items = comics.slice(0, 10).map((item, i) => {
        const comicId = +item.resourceURI.replace(/\D/gi, '').slice(1);
        return (
            <li key={i} className="char__comics-item">
                <Link to={`/comics/${comicId}`}>{item.name}</Link>
            </li>
        )
    });
    const content = comics.length ? items : 'There are no comics.';
    return (
        <div className="single-comic">
            <img src={thumbnail} alt={name} className="single-char__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{name}</h2>
                <p className="single-comic__descr">{fullDescription}</p>
                <div className="char__comics">Comics:</div>
                <ul className="char__comics-list">
                    {content}
                </ul>
            </div>
            <Link to="/" className="single-comic__back">Back to all</Link>
        </div>
    )
}

export default SingleCharPage;