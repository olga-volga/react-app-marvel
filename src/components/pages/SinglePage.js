import {useParams} from 'react-router-dom';
import {useState, useEffect} from 'react';

import AppBanner from '../appBanner/AppBanner';
import useMarvelService from '../../services/MarvelService';
import createContent from '../../utils/createContent';

import './singlePage.scss';

const SinglePage = ({service, Component}) => {
    const {id} = useParams();
    const [data, setData] = useState(null);

    const {clearError, getCharacter, getComic, process, setProcess} = useMarvelService();

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
                getCharacter(id).then(onDataLoaded).then(() => setProcess('confirmed'));
                break;
            case 'getComic':
                getComic(id).then(onDataLoaded).then(() => setProcess('confirmed'));
                break;
        }
    }
    return (
        <>
            <AppBanner />
            {createContent(process, Component, data)}
        </>
    )
}

export default SinglePage;