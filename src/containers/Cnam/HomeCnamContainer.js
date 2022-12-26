import React, { Component } from 'react'
import { connect } from 'react-redux'
import HomeCnam from '../../components/Cnam/HomeCnam'

import { getAllFiles, addFile, deleteFile } from '../../actions/CnamAction'

export class HomeCnamContainer extends Component {
    componentDidMount() {
        this.props.getAllFiles();
    }

    render() {
        return (
            <div className='dashboard-container'>
                <HomeCnam files={this.props.files} addFile={this.props.addFile} deleteFile={this.props.deleteFile}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    files: state.cnam.files,
})

const mapDispatchToProps = {
    getAllFiles,
    addFile,
    deleteFile
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeCnamContainer)
