//MAIN View
import axios from 'axios';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './main-view.scss';
import { RegistrationView } from '../registration-view/registration-view';
export class MainView extends React.Component{
    constructor() {
      super();
      this.state = {
        movies: [],
        user: null,
        selectedMovie: null

      };
    }
    componentDidMount() {
      let accessToken = localStorage.getItem('token');
      if (accessToken !== null) {
        this.setState({
          user: localStorage.getItem('user')
        });
        this.getMovies(accessToken);
      }
    }
      getMovies(token) {
        axios.get('https://muvies-app.herokuapp.com/Movies', {
          headers: { Authorization: `Bearer ${token}`}
        })
        .then(response => {
          // Assign the result to the state
          this.setState({
            movies: response.data
          });
        })
        .catch(function (error) {
          console.log(error);
        });
      }

      setSelectedMovie(newSelectedMovie) {
        this.setState({
          selectedMovie: newSelectedMovie
        });
      }

      onLoggedIn(authData) {
        console.log(authData);
        this.setState({
          user: authData.user.Username
        });
      
        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', authData.user.UserName);
        this.getMovies(authData.token);
      }
      onLoggedOut() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.setState({
          user: null
        });
      }
      
      render() {
        const { movies, user } = this.state;
    
        if (!user) return <Row>
          <Col>
            <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
          </Col>
        </Row>
        if (movies.length === 0) return <div className="main-view" />;
      
      if (!user) return <Row>
        <Col>
          <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
        </Col>
      </Row>
    return (
        <div className="main-view">
        {/*If the state of `selectedMovie` is not null, that selected movie will be returned otherwise, all *movies will be returned*/}
        {selectedMovie
          ? <MovieView movie={selectedMovie} onBackClick={newSelectedMovie => { this.setSelectedMovie(newSelectedMovie); }}/>
          : movies.map(movie => (
            <MovieCard key={movie._id} movie={movie} onMovieClick={(newSelectedMovie) => { this.setSelectedMovie(newSelectedMovie) }}/>
         ))
        }
      </div>
    );
      
  }
}
export default MainView;
