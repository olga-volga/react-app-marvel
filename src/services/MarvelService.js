import {useHttp} from '../hooks/http.hook';

const useMarvelService = () => {
    const {loading, error, request, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=f506b66f5417035c98c0ee06ddf4c0f4';
    const _baseCharOffset = 210;

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
    // трансформируем данные для отображения случайного персонажа
    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 200)}...` : 'The description will be added soon.',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    return {loading, error, clearError, getAllCharacters, getCharacter};
}

export default useMarvelService;