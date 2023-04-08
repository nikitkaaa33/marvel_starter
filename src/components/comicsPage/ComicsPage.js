
import {useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage'
import useMarvelService from '../../services/MarvelService';

import './comicsPage.scss'
 
const ComicsPage = () => {
    const {loading, error, getComics, getComicsbyNameInput} = useMarvelService();
    const [comicsList, setComicsList] = useState ([]);
    const [offset, setOffset] = useState(300);
    const [data, setData] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        if(input === '') {
            setData([]);
            setInput("")
        }
        onComicsRequest(input)
    }, [input])

    useEffect(() => {
        onRequest(offset)
    },[])

    const onRequest = (offset) => {
        getComics(offset)
            .then(onComicsListLoaded)
    }

    const onComicsRequest = (title) => {
        if(!title) {
            return
        }
        getComicsbyNameInput(title)
            .then(data => setData(data))
    }

    console.log(data)

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

    function renderInput (data) {
        let list = data.map(({id, name, thumbnail}) => {
            return (
                <Link to={`/comics/${id}`}>
                    <div key={id} className='input__wrapper'>
                        <img src={thumbnail} alt={name}/>
                        <div className='input__desc'>{name}</div>
                    </div>
                </Link>
            )
        })
        return (
            <div className='input__results'>
                    {list}
            </div>
        )
    }

    const items = renderList(comicsList);
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading  ? <Spinner/> : null;
    const inputForm = () => {
        return (
            <div className='input'>
                 <input
                    id="comicsName" 
                    name='comicsName' 
                    type='text' 
                    value={input} 
                    onChange={(e)=> setInput(e.target.value)} 
                    placeholder="Search your comics"/>
                </div>

            )
    }
    const inputResults = input ? renderInput(data) : null
    const inputSearchForm = inputForm()

    return (
    <>
            {inputSearchForm}
            {inputResults}
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