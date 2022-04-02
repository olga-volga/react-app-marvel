import {useHttp} from '../hooks/http.hook';

const useMarvelService = () => {
    const {loading, error, request, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=f506b66f5417035c98c0ee06ddf4c0f4';
    const _baseCharOffset = 210;
    const _baseComicsOffset = 10;

    // получаем данные всех персонажей
    const getAllCharacters = async (offset = _baseCharOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        // возвращаем тарнсформированный массив с объектами-персонажами
        return res.data.results.map(_transformCharacter);
    }
    // получаем данные одного персонажа по id
    const getCharacter = async (id) => {
        // записываем данные персонажа в res
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        // возвращаем трансформированные данные 
        return _transformCharacter(res.data.results[0]);
    }
    // получаем данные одного персонажа по name
    const getCharacterByName = async (name) => {
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }
    // трансформируем данные для отображения случайного персонажа
    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            //description: char.description ? `${char.description.slice(0, 200)}...` : 'The description will be added soon.',
            description: char.description || 'The description will be added soon.',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }
    // получаем данные всех комиксов
    const getAllComics = async (offset = _baseComicsOffset) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        // возвращаем тарнсформированный массив с объектами-комиксами
        return res.data.results.map(_transformComics);
    }
    // получаем данные комиксa
    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }
    // трансформируем данные для отображения комикса
    const _transformComics = (comic) => {
        return {
            id: comic.id,
            name: comic.title,
            description: comic.description || 'There is no description',
            pageCount: comic.pageCount ? comic.pageCount + ' pages' : 'No info about pages',
            language: comic.textObjects.language || 'en-us',
            thumbnail: comic.thumbnail.path + '.' + comic.thumbnail.extension,
            price: comic.prices[0].price ? comic.prices[0].price + '$' : 'Not available'
        }
    }

    return {loading, error, clearError, getAllCharacters, getCharacter, getCharacterByName, getAllComics, getComic};
}

export default useMarvelService;