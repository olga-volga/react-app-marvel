import {useState} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";
import AppBanner from "../appBanner/AppBanner";
import ComicsList from "../comicsList/ComicsList";

import decoration from '../../resources/img/vision.png';

const App = () => {
    const [id, setId] = useState(null);

    const updateId = (id) => {
        setId(id);
    }
    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Switch>
                        <Route exact path="/">
                            <RandomChar/>
                            <div className="char__content">
                                <CharList updateId={updateId} />
                                <ErrorBoundary>
                                    <CharInfo id={id} />
                                </ErrorBoundary>
                            </div>
                            <img className="bg-decoration" src={decoration} alt="vision"/>
                        </Route>
                        <Route exact path="/comics">
                            <AppBanner />
                            <ComicsList />
                        </Route>
                    </Switch>
                </main>
            </div>
        </Router>
    )
}

export default App;