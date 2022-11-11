import {useState, useEffect} from 'react'
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
            title: data[0],
            artist: data[1],
            date: data[2]
        })
    }

    return (
        <div className="App">
            <header><h1>Museum</h1></header>
            {loading && <div id="loading">loading</div>}
            {error && <p className="error-message">{error}</p>}

            <section id="gallery">
                {console.log(artworks)}
                {artworks.map(artwork => (
                    <figure>
                        <img src={artwork.headerImage.url}/>
                        <figcaption>
                            <p className="artwork-title">{artwork.title}</p>
                            <p className="artwork-subtext">{artwork.principalOrFirstMaker}, {parseTitle(artwork.longTitle).date}</p>
                        </figcaption>
                    </figure>

                ))}
            </section>
        </div>
    )
}

export default App
