import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Table, Form, FormGroup, Label, Input, Button } from 'reactstrap';

import { getMovies } from 'kinopoisk/store/actions/apiActions/apiMoviesActions';

class TopMovies extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: ''
        }
    }

    getCurrentDate() {
        var d = new Date();
        return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    }

    onСhangeDateClick = (val) => {
        const value = val.target ? val.target.value : val;
        this.setState({
            date: value
        });
    };

    findMovies(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.getMovies({
            date: this.state.date
        });
    }

    componentDidMount() {
        const date = this.getCurrentDate();
        this.props.getMovies({
            date: date
        });
        this.setState({
            date: date
        });
    }

    render() {
        const movies = this.props.topMovies.movies;
        return (
            <React.Fragment>
                <Form inline style={{ marginBottom: 20 }} autoComplete="off" onSubmit={(e) => this.findMovies(e)}>
                    <FormGroup>
                        <Label for="date" style={{ marginRight: 20 }}>Дата</Label>
                        <Input
                            type="date"
                            name="date"
                            id="date"
                            value={this.state.date}
                            placeholder="Выберите дату"
                            onChange={(e) => {
                                this.onСhangeDateClick(e);
                            }}
                            style={{ marginRight: 20 }}
                        />
                        <Button color="primary">Найти</Button>
                    </FormGroup>
                </Form>
                <Table striped bordered hover responsive className="text-center">
                    <thead>
                        <tr>
                            <th>N</th>
                            <th>Название</th>
                            <th>Оригинальное название</th>
                            <th>Год выхода</th>
                            <th>Рейтинг</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies && movies.length ? movies.map(movie => {
                            return (
                                <tr key={movie.id}>
                                    <td>{movie.dates[0].date_rate.position}</td>
                                    <td>
                                        <Link to={'/movies/' + movie.id} href='javascript:void(0)'>
                                            {movie.name}
                                        </Link>
                                    </td>
                                    <td>{movie.origin_name}</td>
                                    <td>{movie.year}</td>
                                    <td>{movie.rate}</td>
                                </tr>
                            );
                        }) : <tr>
                                <td colSpan="5">Ничего не найдено</td>
                            </tr>}
                    </tbody>
                </Table>
            </React.Fragment>
        );
    }
}

const mapStateToProps = ({ apiStore }) => ({
    topMovies: apiStore.movies.topMovies,
});

//Пробрасываем actions в props компонента
const mapActionCreators = {
    getMovies
};


export default connect(mapStateToProps, mapActionCreators)(withRouter(TopMovies));