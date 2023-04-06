
import {useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage'
import useMarvelService from '../../services/MarvelService';

import './comicsPage.scss'
 
const ComicsPage = () => {
    const {loading, error, getComics, process, setProcess} = useMarvelService();
    const [comicsList, setComicsList] = useState ([]);
    const [offset, setOffset] = useState(111);

    useEffect(() => {
        onRequest(offset)
    },[])

    const onRequest = (offset) => {
        getComics(offset)
            .then(onComicsListLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onComicsListLoaded = (newcomicsList) => {
        setComicsList ([...comicsList, ...newcomicsList]);
        setOffset((offset) => offset + 9);
    }
    
    function renderList (arr) {
        let list = arr.map((item, i) => {
            return (
                <div className="comics_item" key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt='Comics item'/>
                        <h2>{item.name}</h2>
                        <p>{item.price}$</p>
                    </Link>
                </div>
            )
        })
        return (
            <div className="comics_container">
                {list}
            </div>
        )
    }

    const items = renderList(comicsList);
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading  ? <Spinner/> : null;

    return (
    <>
            {items}
            {errorMessage}
            {spinner}

        <button 
            className="button button__main button__long"
            onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
        </button>
    </>
    )
}

export default ComicsPage;