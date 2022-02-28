import {useParams, Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import AppBanner from '../appBanner/AppBanner';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './singleComicPage.scss';
import xMen from '../../resources/img/x-men.png';

const SingleComicPage = () => {
    const {comicId} = useParams();
    const [comic, setComic] = useState(null);

    const {loading, error, clearError, getComic} = useMarvelService();

    useEffect(() => {
        updateComic();
    }, [comicId]);

    const onComicLoaded = (data) => {
        setComic(data);
    }
    const updateComic = () => {
        clearError();
        getComic(comicId)
            .then(onComicLoaded)
    }
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(!comic || loading || error) ? <View comic={comic} /> : null;
    return (
        <>
            <AppBanner />
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

const View = ({comic}) => {
    const {name, description, pageCount, language, thumbnail, price} = comic;
    return (
        <div className="single-comic">
            <img src={thumbnail} alt={name} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{name}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price}</div>
            </div>
            <Link to="/comics" className="single-comic__back">Back to all</Link>
        </div>
    )
}

export default SingleComicPage;