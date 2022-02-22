import {Component} from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import MarvelService from '../../services/MarvelService';

import './charInfo.scss';
//import thor from '../../resources/img/thor.jpeg';

class CharInfo extends Component {
    state = {
        info: null,
        loading: false,
        error: false
    }
    marvelService = new MarvelService();
    
    componentDidMount() {
        this.updateCharInfo();
    }
    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id) {
            this.updateCharInfo();
        }
    }
    onLoading = () => {
        this.setState({
            loading: true
        })
    }
    onInfoLoaded = (info) => {
        this.setState({
            info,
            loading: false
        })
    }
    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }
    updateCharInfo = () => {
        if (!this.props.id) {
            return;
        }
        this.onLoading();
        this.marvelService.getCharacter(this.props.id)
            .then(this.onInfoLoaded)
            .catch(this.onError);

        // for Error Boundary
        //this.foo.bar = 0;
    }
    render() {
        const {info, loading, error} = this.state;

        const defaultContent = info || loading || error ? null : <Skeleton />;
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(!info || loading || error) ? <View info={info} /> : null;
        return (
            <div className="char__info">
                {defaultContent}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )
    }
}

const View = ({info}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = info;
    const items = comics.slice(0, 10).map((item, i) => {
        return (
            <li key={i} className="char__comics-item">
                {item.name}
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