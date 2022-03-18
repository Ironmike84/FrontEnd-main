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
        user: null
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

      onLoggedIn(authData) {
        console.log(authData);
        this.setState({
          user: authData.user.Username
        });
      
        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', authData.user.Userame);
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

          <Router>
            <Row className="main-view justify-content-md-center">
              <Routes exact path="/movies" render={() => {
                return movies.map(m => (
                  <Col md={3} key={m._id}>
                    <MovieCard movie={m} />
                  </Col>
                ))
              }} />
              <Routes path="/movies/:movieId" render={({ match }) => {
                return <Col md={8}>
                  <MovieView movie={movies.find(m => m._id === match.params.movieId)} />
                </Col>
              }} />
    
            </Row>
          </Router>
        );
      }
    }

export default MainView;