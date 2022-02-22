class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=f506b66f5417035c98c0ee06ddf4c0f4';
    _baseCharOffset = 210;

    // получаем данные с сервера
    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
        return await res.json();
    }
    // получаем данные всех персонажей
    getAllCharacters = async (offset = this._baseCharOffset) => {
        //return this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
        // возвращаем тарнсформированный массив с объектами-персонажами
        return res.data.results.map(this._transformCharacter);
    }
    // получаем данные одного персонажа по id
    getCharacter = async (id) => {
        //return this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        // записываем данные персонажа в res
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        // возвращаем трансформированные данные 
        //return this._transformCharacter(res);
        return this._transformCharacter(res.data.results[0]);
    }
    // трансформируем данные для отображения случайного персонажа
    _transformCharacter = (char) => {
        return {
            //char = res.data.results[0]
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 200)}...` : 'The description will be added soon.',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }
}

export default MarvelService;