import { useEffect, useState } from 'react'
import { db } from './config/firebase'
import './App.css'
import Auth from './components/Auth'
import { getDocs,collection,addDoc } from 'firebase/firestore'

function App() {
  const [movieList, setMovieList] = useState([])

  const [movieTile, setMovieTitle] = useState("");
  const [movieReleaseDate, setMovieReleaseDate] = useState(0);
  const [movieOscar, setMovieOscar] = useState(false);



  const moviesCollectionRef = collection(db, "movies");
  useEffect(() => {
    getMovies();
  }, []);
  const getMovies =async () => {
   const data = await getDocs(moviesCollectionRef);
   const filteredData = data.docs.map((doc)=>({...doc.data(), id: doc.id}));
    console.log({filteredData});
   setMovieList(filteredData);
  }
  const addMovie = async () => {
    try {await addDoc(moviesCollectionRef, {
      title: movieTile,
      releaseDate: movieReleaseDate,
      oscar: movieOscar
    });
      setMovieTitle("");
      setMovieReleaseDate(0);
      setMovieOscar(false);
      getMovies(); // Refresh the movie list after adding a new movie
      console.log("Movie added successfully");
    } catch (error) {
      console.error("Error adding movie: ", error);
      
    }
    
  }
  return (
    <div>
      <Auth/>
      <div>
        <input type="text" placeholder='movie title' onChange={(e)=>{setMovieTitle(e.target.value)}} />
        <input type="number" placeholder='released date' onChange={(e)=>{setMovieReleaseDate(e.target.value)}} />
        <input type="checkbox" name="" id="" onChange={(e)=>{setMovieOscar(e.target.checked)}} />
        <label >oscar?</label>
        <button className='cursor-pointer' onClick={addMovie}>Add Movie</button>
      </div>
      <div>{
        movieList.map((movie) => (
          <div key={movie.id}>
            <h1>{movie.title}</h1>
            <p>{movie.description}</p>
            <img src={movie.image} alt={movie.title} />
          </div>
        ))}
      </div>
      
     </div>

  )
}



export default App
