import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import createContent from '../../utils/createContent';

import './charInfo.scss';

const CharInfo = (props) => {
    const [info, setInfo] = useState(null);

    const {clearError, getCharacter, process, setProcess} = useMarvelService();
    
    useEffect(() => {
        updateCharInfo();
    }, [props.id]);

    const onInfoLoaded = (data) => {
        setInfo(data);
    }
    const updateCharInfo = () => {
        if (!props.id) {
            return;
        }
        clearError();
        getCharacter(props.id)
            .then(onInfoLoaded)
            .then(() => setProcess('confirmed'))
            
        // for Error Boundary
        //this.foo.bar = 0;
    }
    return (
        <div className="char__info">
            {createContent(process, View, info)}
        </div>
    )
}

const View = ({data}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = data;
    const items = comics.slice(0, 10).map((item, i) => {
        const comicId = +item.resourceURI.replace(/\D/gi, '').slice(1);
        return (
            <li key={i} className="char__comics-item">
                <Link to={`/comics/${comicId}`}>{item.name}</Link>
            </li>
        )
    });
    const content = comics.length ? items : 'There are no comics.';
    let clazz = thumbnail.includes('image_not_available') || thumbnail.includes('4c002e0305708') ? {objectFit: 'unset'} : null;
    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={clazz} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">{description}</div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {content}
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    id: PropTypes.number
}

export default CharInfo;