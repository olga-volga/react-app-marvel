import React, {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './charList.scss';

const CharList = (props) => {
    const [characters, setCharacters] = useState([]);
    const [loadingMoreItems, setLoadingMoreItems] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const charRefs = useRef([]);

    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        if (/*loading && */!charEnded) {
            updateCharList(offset, true);
        }
    }, []);

    useEffect(() => {
        //window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        }
    });

    const onScroll = () => {
        let scrollHeight = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        );
        if (loadingMoreItems) return;

        if (window.pageYOffset + document.documentElement.clientHeight >= scrollHeight) {
            updateCharList(offset);
        }
        if (charEnded) {
            window.removeEventListener('scroll', onScroll);
        }
    }
    const onCharactersLoaded = (newCharacters) => {
        setLoadingMoreItems(false);
        setCharacters(characters => [...characters, ...newCharacters]);
        setOffset(offset => offset + 9);
        setCharEnded(newCharacters.length < 9 ? true : false);
    }
    const updateCharList = (offset, initial) => {
        initial ? setLoadingMoreItems(false) : setLoadingMoreItems(true);
        getAllCharacters(offset)
            .then(onCharactersLoaded)
        //console.log(loadingMoreItems);
    }
    const focusCharItem = (i) => {
        charRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        //this.charRefs.current[i].classList.add('char__item_selected');
        charRefs.current[i].focus();
    }
    const renderCharList = (characters) => {
        const items = characters.map((item, i) => {
            const {id, name, thumbnail} = item;
            let clazz = thumbnail.includes('image_not_available') || thumbnail.includes('4c002e0305708') ? {objectFit: 'unset'} : null;
            return (
                <li 
                    key={id}
                    tabIndex={0} 
                    ref={el => charRefs.current[i] = el}
                    className="char__item" 
                    onClick={() => {
                        props.updateId(id);
                        focusCharItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            props.updateId(id);
                            focusCharItem(i);
                        }
                    }} >
                        <img src={thumbnail} alt={name} style={clazz} />
                        <div className="char__name">{name}</div>
                </li>
            )
        });
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }
    const charList = renderCharList(characters);
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading && !loadingMoreItems ? <Spinner /> : null;

    const btnStyle = charEnded ? {display: 'none'} : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {charList}
            <button 
                className="button button__main button__long" 
                style={btnStyle}
                disabled={loadingMoreItems}
                onClick={() => updateCharList(offset)}>
                    <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    updateId: PropTypes.func.isRequired
}

export default CharList;