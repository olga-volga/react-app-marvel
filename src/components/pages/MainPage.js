import {useState} from 'react';
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";

import decoration from '../../resources/img/vision.png';

const MainPage = () => {
    const [id, setId] = useState(null);

    const updateId = (id) => {
        setId(id);
    }
    return (
        <>
            <RandomChar/>
            <div className="char__content">
                <CharList updateId={updateId} />
                <ErrorBoundary>
                    <CharInfo id={id} />
                </ErrorBoundary>
            </div>
            <img className="bg-decoration" src={decoration} alt="vision"/>
        </>
    )
}

export default MainPage;