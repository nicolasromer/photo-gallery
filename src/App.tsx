import {useState, useEffect} from 'react'
import Masonry from '@mui/lab/Masonry';
import './App.css'


const baseUrl = "https://www.rijksmuseum.nl/api/nl/collection?key=yW6uq3BV&involvedMaker=Rembrandt+van+Rijn";

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


    return (
        <div className="App">
            <header><h1>Museum</h1></header>
            {loading && <div id="loading">loading...</div>}
            {error && <p className="error-message">{error}</p>}

            <Masonry id="#gallery" columns={4} spacing={2}>
                {console.log(artworks)}
                {artworks.map(artwork => (
                    <div className="artwork" key={artwork.id}>
                        <div>
                        <img src={artwork.webImage.url}/>
                        </div>
                        <p className="artwork-title">{artwork.title}</p>
                        <p className="artwork-subtext">{artwork.principalOrFirstMaker}, {parseTitle(artwork.longTitle).date}</p>
                    </div>
                ))}
            </Masonry>
        </div>
    )
}

export default App
