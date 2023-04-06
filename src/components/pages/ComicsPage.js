import { Helmet } from "react-helmet";


import AppBanner from '../appBanner/AppBanner';
import ComicsPage from '../comicsPage/ComicsPage';

const ComicsList = () => {
    return (
        <>
            <Helmet>
                <meta
                name="description"
                content="Page with list of our comics"
                />
                <title>Comics page</title>
            </Helmet>
            <AppBanner/>
            <ComicsPage/>
        </>
    )
}

export default ComicsList;