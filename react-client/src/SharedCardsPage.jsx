import React, { Component } from 'react';
import './listPage.css';
import ListPage from "./ListPage";

class SharedCardsPage extends Component {

    constructor (props) {
        super(props);
        this.state = {
            selected:'',
            wordList: this.props.wordList
        };
        this.currentId = this.props.currentId;
    }


    render() {
        return (
            <div className="shared-cards-page">

                <ListPage title={'Shared Cards'} wordList={this.state.wordList} clickBackButton={this.props.clickBackButton}/>

            </div>
        );
    }
}

export default SharedCardsPage;