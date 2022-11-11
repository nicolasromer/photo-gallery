import {useState, useEffect} from 'react'
import Masonry from '@mui/lab/Masonry';
import './App.css'


const baseUrl = "https://www.rijksmuseum.nl/api/nl/collection?key=yW6uq3BV&involvedMaker=Rembrandt+van+Rijn";
const requestImageWidth = 300;

function App() {
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);

        fetch(baseUrl)
            .then((response) => {
                if (!response.ok) {
                    setError(`something went wrong, ${response.status} error`);
                }

                return response.json()
            })
            .then(json => {
                setArtworks(json.artObjects);
                setError(null);
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const parseTitle = (title: string) => {
        const data = title.split(', ');
        return ({
            artist: data[1],
            date: data[2]
        })
    }

    const smallImageRequestUrl = (imageUrl:string ): string => {
        const parts = imageUrl.split('=');
        parts[1] = 'w' + requestImageWidth;
        return parts.join('=');
    }


    return (
        <div className="App">
            <header><h1>Museum</h1></header>
            {loading && <div id="loading">loading...</div>}
            {error && <p className="error-message">{error}</p>}

            <Masonry id="#gallery" columns={5} spacing={3}>
                    {artworks.map(({id, webImage, title, longTitle, principalOrFirstMaker: artist}) => (
                        <div className="artwork" key={id}>
                            <div>
                                <img src={smallImageRequestUrl(webImage.url)}/>
                            </div>
                            <p className="artwork-title">{title}</p>
                            <p className="artwork-subtext">{artist}, {parseTitle(longTitle).date}</p>
                        </div>
                    ))}
            </Masonry>
        </div>
    )
}

export default App
