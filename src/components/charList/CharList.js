import React, {useState, useEffect, useRef} from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './charList.scss';

const createContent = (process, Component, loadingMoreItems) => {
    switch(process) {
        case 'waiting':
            return <Spinner />;
            break;
        case 'loading':
            return loadingMoreItems ? <Component /> : <Spinner />;
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

const CharList = (props) => {
    const [characters, setCharacters] = useState([]);
    const [loadingMoreItems, setLoadingMoreItems] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const charRefs = useRef([]);

    const {getAllCharacters, process, setProcess} = useMarvelService();

    useEffect(() => {
        if (!charEnded) {
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
            .then(() => setProcess('confirmed'))
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
                <CSSTransition key={id} timeout={500} classNames="char__item">
                    <li 
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
                </CSSTransition>
            )
        });
        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )
    }
    const btnStyle = charEnded ? {display: 'none'} : null;
    return (
        <div className="char__list">
            {createContent(process, () => renderCharList(characters), loadingMoreItems)}
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