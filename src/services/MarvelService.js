import md5 from "blueimp-md5";

class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=963c7992ad4d3d9ba2b1f5df589782ae';

    getResource = async (url) => {
        let res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
        return await res.json();
    }

    getHash = (timeStamp) => {
        return md5( timeStamp + "963c7992ad4d3d9ba2b1f5df589782ae" + "c19d215a353e1e39fc2970c6a9bb506deb30ddbb");
    }

    getAllCharacters = () => {
        return this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
    }

    getCharacter = (id) => {
        const timeStamp = + new Date();
        const hash = this.getHash(timeStamp);

        return this.getResource(
            `${this._apiBase}${id}?`+
            "&ts=" + timeStamp +
            `&${this._apiKey}`+
            "&hash=" + hash
            // `${this._apiBase}characters/${id}?${this._apiKey}`
            // `characters/${id}?${this._apiKey}&ts=${timeStamp}&hash=${hash}`
            // "https://gateway.marvel.com:443/v1/public/characters/201?apikey=963c7992ad4d3d9ba2b1f5df589782ae"
            );
    }
}

export default MarvelService;