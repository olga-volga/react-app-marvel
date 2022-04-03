import {useParams} from 'react-router-dom';
import {useState, useEffect} from 'react';
import AppBanner from '../appBanner/AppBanner';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './singlePage.scss';

const SinglePage = ({service, Component}) => {
    const {id} = useParams();
    const [data, setData] = useState(null);

    const {loading, error, clearError, getCharacter, getComic} = useMarvelService();

    useEffect(() => {
        updateData();
    }, [id])

    const onDataLoaded = (data) => {
        setData(data);
    }
    const updateData = () => {
        clearError();
        switch (service) {
            case 'getCharacter':
                getCharacter(id).then(onDataLoaded);
                break;
            case 'getComic':
                getComic(id).then(onDataLoaded);
                break;
        }
    }
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(!data || loading || error) ? <Component data={data} /> : null;
    return (
        <>
            <AppBanner />
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

export default SinglePage;