import {Link} from 'react-router-dom';
import {Helmet} from "react-helmet";

const SingleCharPage = ({data}) => {
    const {name, fullDescription, thumbnail, comics} = data;
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
        <div className="single-page">
            <Helmet>
                <meta
                    name="description"
                    content={`Page about ${name} character`}
                    />
                <title>{`${name} page`}</title>
            </Helmet>
            <img src={thumbnail} alt={name} className="single-page__img_char"/>
            <div className="single-page__info">
                <h2 className="single-page__name">{name}</h2>
                <p className="single-page__descr">{fullDescription}</p>
                <div className="char__comics">Comics:</div>
                <ul className="char__comics-list">
                    {content}
                </ul>
            </div>
            <Link to="/" className="single-page__back">Back to all</Link>
        </div>
    )
}

export default SingleCharPage;