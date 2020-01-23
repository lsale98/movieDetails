const API_KEY = "6cbf17dc4f84e5c29ba17b4020a6f263";
const url =
  "https://api.themoviedb.org/3/search/movie?api_key=6cbf17dc4f84e5c29ba17b4020a6f263";
const IMAGE_URL = "https://image.tmdb.org/t/p/w200";

$(document).ready(() => {
  $("#searchButton").on("click", e => {
    let searchText = $("#inputValue").val();
    getMovies(searchText);
    e.preventDefault();
  });
});

function getMovies(searchText) {
  axios
    .get(url + "&query=" + searchText)
    .then(response => {
      console.log(response);
      let movies = response.data.results;
      let output = "";

      $.each(movies, (index, movie) => {
        if (movie.poster_path) {
          output += `
          <div class="col-md-3">
            <div class="well text-center">
              <img src="${IMAGE_URL + movie.poster_path}" />
              <h5>${movie.title}</h5>
              <a onClick="movieSelected('${
                movie.id
              }')" class="btn btn-primary" href="#">Details</a>
            </div>
          </div>
        `;
        }
      });
      $("#movies").html(output);
    })
    .catch(err => {
      console.log(err);
    });
}

function movieSelected(id) {
  sessionStorage.setItem("movieId", id);
  window.location = "movieDetails.html";
  console.log("click");
  return false;
}

function getGenres(genres) {
  let genreMovies = "";
  for (let i = 0; i < genres.length; i++) {
    genreMovies += genres[i].name + " ";
  }

  return genreMovies;
}

function getProduction(production_companies) {
  let production = "";

  if (production_companies.length > 0) {
    for (let i = 0; i < production_companies.length; i++) {
      production += production_companies[i].name + " | ";
    }
  } else {
    production = "No production to displayed";
  }
  return production;
}

function getMovie() {
  let movieId = sessionStorage.getItem("movieId");

  const newUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=6cbf17dc4f84e5c29ba17b4020a6f263`;
  axios
    .get(newUrl)
    .then(response => {
      console.log(response);
      let movie = response.data;
      let genres = response.data.genres;
      const genre = getGenres(genres);
      let production_companies = response.data.production_companies;
      const prod = getProduction(production_companies);
      console.log(genre);
      let output = `
        <div class="row">
          <div class="col-md-4">
         
            <img src="${IMAGE_URL + movie.poster_path}" class"thumbnail" />
          </div>
          <div class="col-md-8">
           
            <h1>${movie.title}</h1>
            <h3>${movie.tagline}</h3>
            <ul class="list-group mt-3">
            <li class="list-group-item bg-dark">Genres: ${genre}</li>
                <li class="list-group-item bg-dark">Runtime: ${
                  movie.runtime
                } min</li>
                <li class="list-group-item bg-dark">Release: ${
                  movie.release_date
                }</li>
                <li class="list-group-item bg-dark">Rating: ${
                  movie.vote_average
                }</li>
                <li class="list-group-item bg-dark">Production: ${prod}</li>
                <li class="list-group-item bg-dark">Status: ${movie.status}</li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="well">
                <h3 class="mt-4">Overview</h3>
                <p>${movie.overview}</p>
                <hr>
                <a href="http://imdb.com/title/${
                  movie.imdb_id
                }" target="_blank" class="btn btn-primary">View IMDB</a>
                <a href="movies.html" class="btn btn-danger">Go Bact To Search</a>
          </div>
        </div>
        `;
      $("#movie").html(output);
    })
    .catch(err => {
      console.log(err);
    });
}
