import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';
//import abyss from '../../resources/img/abyss.jpg';

class CharList extends Component {
    state = {
        characters: [],
        loading: true,
        error: false,
        loadingMoreItems: false,
        offset: 210,
        charEnded: false
    }
    charRefs = [];

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateCharList();
        window.addEventListener('scroll', this.onScroll);
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll);
    }
    onScroll = () => {
        let scrollHeight = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        );
        if (this.state.loadingMoreItems) return;

        if (window.pageYOffset + document.documentElement.clientHeight >= scrollHeight) {
            this.updateCharList(this.state.offset);
        }
        if (this.state.charEnded) {
            window.removeEventListener('scroll', this.onScroll);
        }
    }
    onLoadingMoreItems = (value) => {
        this.setState({
            loadingMoreItems: value
        })
    }
    onCharactersLoaded = (newCharacters) => {
        this.setState(({offset, characters}) => ({
            characters: [...characters, ...newCharacters],
            loading: false,
            loadingMoreItems: false,
            offset: offset + 9,
            charEnded: newCharacters.length < 9 ? true : false 
        }))
    }
    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }
    setCharRef = ref => {
        this.charRefs.push(ref);
    }
    focusCharItem = (i) => {
        this.charRefs.forEach(item => item.classList.remove('char__item_selected'));
        //this.charRefs[i].classList.add('char__item_selected');
        this.charRefs[i].focus();
    }
    updateCharList = (offset) => {
        this.onLoadingMoreItems(true);
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharactersLoaded)
            .catch(this.onError)
            .finally(() => this.onLoadingMoreItems(false));
        //console.log(this.state.loadingMoreItems)
    }
    renderCharList = (characters) => {
        const items = characters.map((item, i) => {
            const {id, name, thumbnail} = item;
            let clazz = thumbnail.includes('image_not_available') || thumbnail.includes('4c002e0305708') ? {objectFit: 'unset'} : null;
            return (
                <li 
                    key={id}
                    tabIndex={0} 
                    ref={this.setCharRef}
                    className="char__item" 
                    onClick={() => {
                        this.props.updateId(id);
                        this.focusCharItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            this.props.updateId(id);
                            this.focusCharItem(i);
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

    render() {
        const {characters, loading, error, loadingMoreItems, offset, charEnded} = this.state;

        const charList = this.renderCharList(characters);
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? charList : null;

        const btnStyle = charEnded ? {display: 'none'} : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    className="button button__main button__long" 
                    style={btnStyle}
                    disabled={loadingMoreItems}
                    onClick={() => this.updateCharList(offset)}>
                        <div className="inner">load more</div>
                </button>
            </div>
        )
        
        /*return (
            <div className="char__list">
                <ul className="char__grid">
                    {errorMessage}
                    {spinner}
                    {content}
                </ul>
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )*/
    }
}

/*const CharItems = ({characters}) => {
    const items = characters.map(item => {
        const {id, name, thumbnail} = item;
        let clazz = thumbnail.indexOf('image_not_available') > -1 ? {objectFit: 'unset'} : null;
        return (
            <li key={id} className="char__item">
                <img src={thumbnail} alt={name} style={clazz} />
                <div className="char__name">{name}</div>
            </li>
        )
    })
    return items;
}*/

CharList.propTypes = {
    updateId: PropTypes.func.isRequired
}

export default CharList;