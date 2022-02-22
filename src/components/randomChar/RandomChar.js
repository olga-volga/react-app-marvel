import {Component} from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './randomChar.scss';
//import thor from '../../resources/img/thor.jpeg';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
    /*constructor(props) {
        super(props);
        //this.updateChar();
    }*/
    state = {//=== this.state = {}
        /*name: null,
        description: null,
        thumbnail: null,
        homepage: null,
        wiki: null*/
        char: {},
        loading: true,
        error: false
    }
    marvelService = new MarvelService();//=== this.marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
        //this.timerId = setInterval(this.updateChar, 3000)
    }
    componentWillUnmount() {
        clearInterval(this.timerId)
    }

    onLoading = () => {
        this.setState({
            loading: true
        })
    }
    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false
        })
    }
    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }
    updateChar = () => {
        //const id = 1011005;
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.onLoading();
        this.marvelService
            .getCharacter(id)
            .then(this.onCharLoaded)
            .catch(this.onError);
            //.then(res => {
                //this.setState(res)
                /*this.setState({
                    name: res.data.results[0].name,
                    description: res.data.results[0].description,
                    thumbnail: res.data.results[0].thumbnail.path + '.' + res.data.results[0].thumbnail.extension,
                    homepage: res.data.results[0].urls[0].url,
                    wiki: res.data.results[0].urls[1].url
                })*/
            //})
    }
    render () {
        //const {name, description, thumbnail, homepage, wiki} = this.state;
        //const {char: {name, description, thumbnail, homepage, wiki}} = this.state;
        const {char, loading, error} = this.state;
        /*if (loading) {
            return <Spinner />
        }*/
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? <View char={char} /> : null;
        return (
            <div className="randomchar">
                {/*loading ? <Spinner /> : <View char={char} />*/}
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className="button button__main" onClick={this.updateChar}>
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki} = char;
    let clazz = thumbnail.indexOf('image_not_available') > -1 ? {objectFit: 'contain'} : null;
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