import {useState, useEffect} from 'react';
import useMarvelService from '../../services/MarvelService';
import createContent from '../../utils/createContent';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = () => {
    const [char, setChar] = useState({});

    const {clearError, getCharacter, process, setProcess} = useMarvelService();

    useEffect(() => {
        updateChar();
        //const timerId = setInterval(updateChar, 50000)
        return () => {
            //clearInterval(timerId)
        }
    }, []);

    const onCharLoaded = (char) => {
        setChar(char);
    }
    const updateChar = () => {
        clearError();
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        
        getCharacter(id)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'))
    }
    return (
        <div className="randomchar">
            {createContent(process, View, char)}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main" onClick={updateChar}>
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
}

const View = ({data}) => {
    const {name, description, thumbnail, homepage, wiki} = data;
    let clazz = thumbnail && thumbnail.indexOf('image_not_available') > -1 ? {objectFit: 'contain'} : null;
    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" style={clazz} className="randomchar__img"/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
             </div>
        </div>
    )
}

export default RandomChar;