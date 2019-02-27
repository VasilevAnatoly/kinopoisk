import React from 'react';
import { connect } from 'react-redux';
import {
    Row, Col, Button, Form, FormGroup, Label, Input, Card, CardText, CardBody,
    CardTitle, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'


import { getMovieById } from 'kinopoisk/store/actions/apiActions/apiMoviesActions';
import { addCommentToMovie, addMovieLikeDislike, addCommentLikeDislike } from 'kinopoisk/store/actions/socketActions';

class Movie extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            movieId: window.location.pathname.slice(window.location.pathname.indexOf('movies/') + 7),
            author: '',
            comment: '',
            modal: false,
        }
        this.toggle = this.toggle.bind(this);
    }

    componentDidMount() {
        this.props.getMovieById(this.state.movieId);
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    onChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    onMovieLikeDislikeClick(like) {
        this.props.addMovieLikeDislike({
            movieId: this.state.movieId,
            like: like
        });
    }

    onCommentLikeDislikeClick(commentId, like) {
        this.props.addCommentLikeDislike({
            commentId: commentId,
            like: like
        });
    }


    addComment(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!this.state.author.trim().length || !this.state.comment.trim().length) {
            this.toggle();
        } else {
            this.props.addCommentToMovie(this.state);
            this.setState({
                author: '',
                comment: ''
            });
        }
    }

    render() {
        const movie = this.props.movieStore.movie;
        return (
            <React.Fragment>
                <Row>
                    <Col md={4} className="text-center">
                        <Row>
                            <Col md={{ size: 10, offset: 1 }}>
                                <img src={"http://localhost:3000" + movie.image} alt={movie.name} width="180" height="270" />
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col md={{ size: 10, offset: 1 }}>
                                <Label style={{ marginRight: 10 }}>{movie.likes}</Label>
                                <FontAwesomeIcon
                                    icon={faThumbsUp}
                                    style={{ marginRight: 10 }}
                                    onClick={(e) => {
                                        this.onMovieLikeDislikeClick("like");
                                    }}
                                />
                                <Label style={{ marginRight: 10 }}>{movie.dislikes}</Label>
                                <FontAwesomeIcon
                                    icon={faThumbsDown}
                                    style={{ marginRight: 10 }}
                                    onClick={(e) => {
                                        this.onMovieLikeDislikeClick("dislike");
                                    }}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col md={8} className="text-center">
                        <Row>
                            <Col md={6} className="text-center">
                                <Row className="text-center">
                                    Название
                        </Row>
                                <Row className="text-center">
                                    Оригинальное название
                        </Row>
                                <Row className="text-center">
                                    Год выхода
                        </Row>
                                <Row className="text-center">
                                    Рейтинг
                        </Row>
                            </Col>
                            <Col md={6} className="text-center">
                                <Row className="text-center">
                                    {movie.name}
                                </Row>
                                <Row className="text-center">
                                    {movie.origin_name}
                                </Row>
                                <Row className="text-center">
                                    {movie.year}
                                </Row>
                                <Row className="text-center">
                                    {movie.rate}
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12} className="text-center" style={{ marginTop: 40 }}>{movie.description}</Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{ marginTop: 40 }}>
                    <Col md={12} className="text-center">Комментарии</Col>
                    {
                        movie.comments ? movie.comments.map(comment => {
                            return (
                                <Col md={6} key={comment.id}>
                                    <Card>
                                        <CardBody>
                                            <CardTitle>
                                                {comment.author}
                                                <div style={{ position: "relative", float: "right" }}>
                                                    <Label style={{ marginRight: 10 }}>{comment.likes}</Label>
                                                    <FontAwesomeIcon
                                                        icon={faThumbsUp}
                                                        style={{ marginRight: 10 }}
                                                        onClick={(e) => {
                                                            this.onCommentLikeDislikeClick(comment.id, "like");
                                                        }}
                                                    />
                                                    <Label style={{ marginRight: 10 }}>{comment.dislikes}</Label>
                                                    <FontAwesomeIcon
                                                        icon={faThumbsDown}
                                                        style={{ marginRight: 10 }}
                                                        onClick={(e) => {
                                                            this.onCommentLikeDislikeClick(comment.id, "dislike");
                                                        }}
                                                    />
                                                </div>
                                            </CardTitle>
                                            <CardText>{comment.comment}</CardText>
                                        </CardBody>
                                    </Card>
                                </Col>
                            );
                        }) : null
                    }
                </Row>
                <Row style={{ marginTop: 40, marginBottom: 40 }}>
                    <Col md={{ size: 6, offset: 3 }}>
                        <Col md={12} className="text-center">Оставить комментарий</Col>
                        <Form autoComplete="off" onSubmit={(e) => this.addComment(e)}>
                            <FormGroup>
                                <Label for="author">Имя <span style={{ color: "red" }}>*</span></Label>
                                <Input
                                    type="text"
                                    name="author"
                                    value={this.state.author}
                                    id="author"
                                    placeholder="Введите ваше имя"
                                    onChange={(e) => {
                                        this.onChange(e);
                                    }} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="comment">Комментарий <span style={{ color: "red" }}>*</span></Label>
                                <Input
                                    type="textarea"
                                    name="comment"
                                    value={this.state.comment}
                                    id="comment"
                                    placeholder="Введите ваш комментарий"
                                    onChange={(e) => {
                                        this.onChange(e);
                                    }} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="comment"><span style={{ color: "red" }}>*</span> - поля, обязательные для заполнения</Label>
                            </FormGroup>
                            <Button color="primary">Отправить</Button>
                        </Form>
                    </Col>
                </Row>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Ошибка</ModalHeader>
                    <ModalBody>
                        Пожалуйста, заполните обязательные поля!
                    </ModalBody>
                </Modal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = ({ apiStore }) => ({
    movieStore: apiStore.movies.movie
});

const mapActionCreators = {
    getMovieById,
    addCommentToMovie,
    addMovieLikeDislike,
    addCommentLikeDislike
};


export default connect(mapStateToProps, mapActionCreators)(Movie);