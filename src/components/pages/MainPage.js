import {useState} from 'react';
import {Helmet} from "react-helmet";

import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";
import CharSearchForm from "../charSearchForm/CharSearchForm";

import decoration from '../../resources/img/vision.png';

const MainPage = () => {
    const [id, setId] = useState(null);

    const updateId = (id) => {
        setId(id);
    }
    return (
        <>
            <Helmet>
                <meta
                    name="description"
                    content="Marvel information portal"
                    />
                <title>Marvel information portal</title>
            </Helmet>
            <RandomChar/>
            <div className="char__content">
                <CharList updateId={updateId} />
                <ErrorBoundary>
                    <CharInfo id={id} />
                </ErrorBoundary>
                <CharSearchForm />
            </div>
            <img className="bg-decoration" src={decoration} alt="vision"/>
        </>
    )
}

export default MainPage;