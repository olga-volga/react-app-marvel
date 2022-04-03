import {Link} from 'react-router-dom';

const SingleComicPage = ({data}) => {
    const {name, description, pageCount, language, thumbnail, price} = data;
    return (
        <div className="single-page">
            <img src={thumbnail} alt={name} className="single-page__img"/>
            <div className="single-page__info">
                <h2 className="single-page__name">{name}</h2>
                <p className="single-page__descr">{description}</p>
                <p className="single-page__descr">{pageCount}</p>
                <p className="single-page__descr">Language: {language}</p>
                <div className="single-page__price">{price}</div>
            </div>
            <Link to="/comics" className="single-page__back">Back to all</Link>
        </div>
    )
}

export default SingleComicPage;