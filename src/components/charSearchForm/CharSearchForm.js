import React, {useState} from 'react';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import * as Yup from  'yup';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charSearchForm.scss';
import '../../style/button.scss';

const CharSearchForm = () => {
    const [char, setChar] = useState(null);
    const {loading, error, getCharacterByName, clearError} = useMarvelService();

    const updateChar = (name) => {
        clearError();
        getCharacterByName(name)
            .then(res => setChar(res));
    }
    const errorMessage = error ? <ErrorMessage /> : null;
    const message = !char ? null : char.length > 0 ?
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
            <Formik 
                initialValues={{name: ''}} 
                validationSchema={Yup.object({
                    name: Yup.string()
                        .required('This field is required')
                })} 
                onSubmit = {({name}) => {
                    updateChar(name);
                }}>
                    <Form className="form">
                        <Field id="name" name="name" type="text" placeholder="Enter name" className="form__input" />
                        <button type="submit" disabled={loading} className="button button__main">
                            <div className="inner">FIND</div>
                        </button>
                        <FormikErrorMessage className="form__message form__message_error" name="name" component="div"/>
                    </Form>
            </Formik>
            {errorMessage}
            {message}
        </div>
    )
}

export default CharSearchForm;