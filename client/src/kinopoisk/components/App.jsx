import React from 'react';
import { connect } from 'react-redux';
import { connectToSocket } from 'kinopoisk/store/actions/socketActions';
import $ from 'jquery'

import { Container } from 'reactstrap'
import { Navbar } from 'reactstrap'

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    componentDidMount(prevProps) {
        $('body').css('overflow', 'hidden');
        if (!this.props.onlyChild) {
            setTimeout(() => {
                this.setState({ loading: false });
                $('body').css('overflow', 'auto');
            }, 501);
        }
        this.props.connectToSocket();
    }

    componentDidUpdate(prevProps) {
        // this.props.connectToSocket();
    }
    render() {
        if (this.props.onlyChild) {
            return this.props.children
        } else {
            return (
                <React.Fragment>
                    <Container>
                        <div className="navbar">
                            <div className="navbar-header">
                                Kinopisk App
                        </div>
                        </div>
                        <div style={{ marginTop: 40 }}>
                            {this.props.children}
                        </div>
                    </Container>
                </React.Fragment>
            )
        }
    }
}

const mapStateToProps = ({ apiStore }) => ({});

//Пробрасываем actions в props компонента
const mapActionCreators = {
    connectToSocket
};

export default connect(mapStateToProps, mapActionCreators)(App);