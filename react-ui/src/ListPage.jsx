import React, { Component } from 'react';
import './listPage.css';
import Table from "./Table";
import Banner from "./Banner";
import Alert from "./Alert";
import { EditPage, updateCard, saveCtmCard } from './EditPage';

class ListPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            wordList: this.props.wordList,
            selectedWordId: this.props.selectedWordId,
            isValidToEdit: false,
            isValidToStudy: false,
            showAddPage: false,
            showEditPage: false
        };

        this.currentId = this.props.currentId;
        this.handleSelected = this.handleSelected.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ wordList: nextProps.wordList, selectedWordId: nextProps.selectedWordId });
    }

    componentDidMount() {
        this.initial();
    }

    initial() {
        let title = `.list-page-${this.state.title.split(" ").join("")} `;
        if (this.state.title === 'Favorite') {
            this.hideElement(title + '.list-page-add');
        }
        if (this.state.title === "Shared Cards") {
            this.hideElement(title + '.list-page-add');
            this.hideElement(title + '.list-page-edit');
        }
    }

    handleSelected(id) {
        this.setState({ selectedWordId: id }, () => console.log(id));
    }

    handleEditButton() {
        return this.state.wordList && this.state.selectedWordId;
    }

    handleStudyButton() {
        return this.state.wordList;
    }

    hideElement(queryString) {
        document.querySelector(queryString).classList.add('hidden');
    }

    showElement(queryString) {
        document.querySelector(queryString).classList.remove('hidden');
    }

    render() {
        return (

            <div className={"list-page-"+this.state.title.split(" ").join("")}>
                <Banner text={this.state.title} />
                    <Table className="list"
                        onClick={this.handleSelected}
                        wordList={this.state.wordList}
                        selectedWordId={this.state.selectedWordId}
                    />

                <div className="list-page-buttons">
                    <button className="list-page-back" onClick={this.props.clickBackButton}>Back</button>
                    <button className="list-page-add"
                        onClick={() => this.setState({
                            showAddPage: true,
                        })} > Add</button>
                    <button className="list-page-edit"
                        onClick={() => {
                            this.setState({
                                showEditPage: true,
                            })
                        }} disabled={this.handleEditButton() ? false : "disabled"}>Edit</button>
                    <button className="list-page-study"
                        onClick={() => this.props.setStudyList(this.state.wordList)}
                        disabled={this.handleStudyButton() ? false : "disabled"}>Study</button>
                </div>

                {/*please add "hidden" in the className of EditPage*/}
                <EditPage
                    selectedId={null}
                    currentUserId={this.currentId}
                    hidden={!this.state.showAddPage}
                    onCancelClick={() => {
                        this.setState({
                            showAddPage: false,
                        })
                    }}
                    onAccessDenied={() => {
                        // Add code here when user ownership is false
                        this.setState({
                            showAddPage: false,
                            selectedWordId: null
                        });
                        setTimeout(() => {
                            this.hideElement('.alert');
                        },3000);
                        this.showElement('.alert');
                    }}
                    onSaveClick={(data) => {
                        this.setState({
                            showAddPage: false,
                        });

                        saveCtmCard(data, this.currentId).then(() => {
                            // Save completed.
                            this.props.updateWordList();
                        });
                    }
                    } />
                <EditPage
                    selectedId={this.state.selectedWordId}
                    currentUserId={this.currentId}
                    hidden={!this.state.showEditPage}
                    onCancelClick={() => {
                        this.setState({
                            showEditPage: false,
                        })
                    }}
                    onAccessDenied={() => {
                        // Add code here when user ownership is false
                        this.setState({
                            showEditPage: false,
                            selectedWordId: null
                        });
                        setTimeout(() => {
                            this.hideElement('.alert');
                        },3000);
                        this.showElement('.alert');
                    }}
                    onSaveClick={(data) => {
                        this.setState({
                            showEditPage: false,
                        });

                        updateCard(this.state.selectedWordId, data, this.currentId).then(() => {
                            // Update completed
                            this.props.updateWordList();
                        })
                    }} />
                <Alert message="Sorry, you can not edit preset or other users' cards " onClick={() => this.hideElement('.alert')} />
            </div >
        );
    }
}

export default ListPage;