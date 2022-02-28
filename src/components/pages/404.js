import ErrorMessage from '../errorMessage/ErrorMessage';
import {Link} from 'react-router-dom';

const Page404 = () => {
    return (
        <div>
            <ErrorMessage />
            <p style={{'fontWeight': 'bold', 'textAlign': 'center', 'marginTop': '10px'}}>Page doesn't exist</p>
            <Link style={{'display': 'block', 'fontWeight': 'bold', 'textAlign': 'center', 'textDecoration': 'underline', 'marginTop': '20px'}} to="/">Back to main page</Link>
        </div>
    )
}

export default Page404;