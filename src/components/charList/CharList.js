
import {useState, useEffect, useMemo} from 'react'
import {CSSTransition, TransitionGroup} from 'react-transition-group'

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charList.scss';

const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting': 
            return  <Spinner/>;
        case 'loading':
            return newItemLoading ? <Component /> : <Spinner/>;
        case 'confirmed':
            return <Component/>;
        case 'error':
            return <ErrorMessage/>;
        default:
            throw new Error('Unexpected process state');
    }
}

const CharList = (props) => {

    const [charList, setCharist] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(193);
    const [charEnded, setCharEnded] = useState(false);
    const {getAllCharacters, process, setProcess} = useMarvelService();

   useEffect(() => {
        onRequest(offset, true);
   },[])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharListLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if(newCharList.length < 9) {
            ended = true;
        }

        setCharist(charList => [...charList, ...newCharList])
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended)
    }

    function renderItems(arr) {
        const items =  arr.map((item) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            let key = item.id;

            return (
                <CSSTransition key={item.id} timeout={500} classNames="char__item">
                        <li
                        className="char__item"
                        tabIndex={0}
                        key={key}
                        onClick={() => props.onCharSelected(item.id)}>
                            <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                            <div className="char__name">{item.name}</div>
                        </li>
                </CSSTransition>
            )
        });
        return (
            <TransitionGroup className="char__grid">
                {items}
            </TransitionGroup>
        )
    }
        const elements = useMemo(() => {
            return setContent(process, () => renderItems(charList), newItemLoading)
        },[process])

        return (
            <div className="char__list">
                {elements}
                <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display' : charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
}


export default CharList;