import {useState, useEffect} from 'react';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage, setIn } from 'formik';
import {Link} from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './formChar.scss'

const FormChar = () => {
    const {loading, error,getCharacterbyNameInput} = useMarvelService();
    const [data, setData] = useState([]);
    const [input, setInput] = useState("");

    const loadCharacterbyName = (name) => {
        if(!name) {
            return
        }
        getCharacterbyNameInput(name).then(data => {setData(data); })
        
    }

    useEffect(()=> {
        if(!input){
            setData([])
            ;setInput("")
        }else{
            loadCharacterbyName(input)
        }},[input])

    const errorMessage = error ? <div className="char__search-critical-error"><ErrorMessage /></div> : null;

     const renderCharacter = (data) => data.map(({id, name, thumbnail}) => 
     <Link to={`characters/${id}`} key={name}>
         <div  className='findCharacter__results-wrapper'>
             <img src={thumbnail} alt={name}/>
             <div className='findCharacter__desc'>{name}</div>
         </div>
     </Link>);

    return (
        <div className="char__search-form">
        <Formik>
            <Form>
                <label className="char__search-label" htmlFor="charName">Or find a character by name:</label>
                <div className="char__search-wrapper">
                    <Field 
                        id="charName" 
                        name='charName' 
                        type='text' 
                        value={input} 
                        onChange={(e)=> setInput(e.target.value)} 
                        placeholder="Enter name: Hulk"/>
                </div>
            </Form>
        </Formik>
        {errorMessage}
        {<ul className='findCharacter__results'>
            {loading && data.length ? <Spinner/> : renderCharacter(data)}
            {!data.length && input && !loading ? 'there is no search character' : null}   
        </ul>}
    </div>
    )
}

export default FormChar;