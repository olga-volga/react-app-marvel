import React, {useState} from 'react';
import { useFormik } from 'formik';
import * as Yup from  'yup';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charSearchForm.scss';
import '../../style/button.scss';

const CharSearchForm = () => {
    const [char, setChar] = useState(null);
    const {loading, error, getCharacterByName, clearError} = useMarvelService();
    
    const formik = useFormik({
        initialValues: {name: ''},
        validationSchema: Yup.object({
            name: Yup.string()
                .required('This field is required')
        }),
        onSubmit: ({name}) => updateChar(name)
    });

    const updateChar = (name) => {
        clearError();
        getCharacterByName(name)
            .then(res => setChar(res));
    };
    const errorMessage = error ? <ErrorMessage /> : null;
    const message = (!char) ? null : char.length > 0 ?
                    <div className="form__message-block">
                        <div className="form__message form__message_success">There is! Visit {char[0].name} page?</div>
                        <a href="#" className="button button__secondary">
                            <div className="inner">TO PAGE</div>
                        </a>
                    </div> : 
                    <div className="form__message form__message_error">
                        The character was not found. Check the name and try again
                    </div>;
    return (
        <div className="search-form">
            <div className="search-form__title">Or find a character by name:</div>
            <form onSubmit={formik.handleSubmit} className="form">
                <input 
                    id="name" 
                    name="name" 
                    type="text" 
                    placeholder="Enter name" 
                    value={formik.values.name}
                    onChange={(e) => {
                        formik.handleChange(e);
                        setChar(null);
                    }} 
                    onBlur={formik.handleBlur}
                    className="form__input" />
                <button type="submit" disabled={loading} className="button button__main">
                    <div className="inner">FIND</div>
                </button>
                {formik.errors.name && formik.touched.name ? <div className="form__message form__message_error">{formik.errors.name}</div> : null}
            </form>
            {errorMessage}
            {message}
        </div>
    )
}

export default CharSearchForm;