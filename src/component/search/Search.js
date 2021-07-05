
// const [movies, setMovies] = useState([]);
// const [loading, setLoading] = useState(false);
// const [query, setQuery] = useState('');
// const [error, setError] = useState(false);
// const [pagination, setPagination] = useState(false);

// const limitMovie = 6

// const onError = (e) => {
//   setError(true)
//   setLoading(false)
// }

// useEffect(() => {
//   fetch(SEARCH_MOVIE_BEGIN)
//   .then(res => res.json())
//   .then(data => {
//         setMovies(data.results.slice(0, limitMovie)) 
//         setLoading(false)})
        
// }, [query])

// const onSubmitValue = (e) => {
//   e.preventDefault()

//   fetch(SEARCH_MOVIE + query)
//   .then(res => res.json())
//   .then(data => {
//     setMovies(data.results.slice(0, limitMovie))
//     setLoading(false)
//     setQuery('')})
// }

// const onChange = (e) => {
//   setQuery(e.target.value)
//   const search = _.debounce(onSubmitValue, 300);
//   search()
// }




// return (
//   <div className="wrapper">
//     {loading && <Spin size="large" className="loading" />}
//     <form onSubmit={onSubmitValue}>
//       <Input 
//         type="search"
//         placeholder="Type to search..." 
//         className="search-input"
//         value={query} 
//         onChange={onChange} 
//       />
//     </form>
//     {movies.map(movie => ( 
//       <Movie key={movie.id} {...movie}/> 
//     ))}
//     <Pagination 
//       className="pagination" 
//       size="small" 
//       total={50} 
//       defaultPageSize={6}/>
//   </div>
// );

// if(!res.ok) {
//   throw new Error(`Couild not fetch ${searchString}` + `, received ${res.status}`)
// }