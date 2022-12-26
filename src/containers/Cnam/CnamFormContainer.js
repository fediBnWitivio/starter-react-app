import React, { Component } from 'react'
import { connect } from 'react-redux'
import CnamForm from '../../components/Cnam/CnamForm'


export class CnamFormContainer extends Component {
    render() {
        return (
            <div className='dashboard-container'>
                <CnamForm
                    fileId={this.props.params.fileId}
                    lineId={this.props.params.patient}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CnamFormContainer)
