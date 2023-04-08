import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
    const {loading, request, error, clearError, process, setProcess} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=963c7992ad4d3d9ba2b1f5df589782ae';
    const _baseOffset = 200;

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter)
    }

    const getCharacter = async (id) => {
        const res = await request(
            `${_apiBase}characters/${id}?` + `&${_apiKey}`
        );
        return _transformCharacter(res.data.results[0])
    }

    const getSingleCharacter = async (name) => {
        const res = await request(
            `${_apiBase}characters?name=${name}` + `&${_apiKey}`
        );
        return res.data.results.map(_transformCharacter)
    }

    const getComics = async (offset) => {
        const res = await request(
            `${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`
        )
        return res.data.results.map(_transformComics)
    }

    const getComic = async (id) => {
		const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
		return _transformComics(res.data.results[0]);
	};

    const getCharacterbyNameInput =  async (pers) => {
        const res =  await request(`${_apiBase}characters?nameStartsWith=${pers}&limit=9&orderBy=name&${_apiKey}`);
        return  res.data.results.map(item => _transformCharacter(item));
    }

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items,
            comicsId: char.comics
        }
    }

    const _transformComics = (comics) => {
        return {
           id: comics.id,
           name: comics.title,
           description: comics.description ? comics.description : 'No description about this comics',
           pageCount: comics.pageCount ? `${comics.pageCount} p.` : 'No information about the number of pages',
           language: comics.textObjects.language || 'en-us',
           price: comics.prices[0].price,
           thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
        }
    }
    return {loading , 
        error,
        process,
        setProcess,
        getAllCharacters,
        getCharacter,
        clearError, 
        getComics, 
        getComic,
        getSingleCharacter,
        getCharacterbyNameInput}
}

export default useMarvelService;