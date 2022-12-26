import React, { Component } from 'react'
import { connect } from 'react-redux'
import TableHonoraire from '../../components/Cnam/TableHonoraire'

export class Honoraires extends Component {
    render() {
        return (
            <TableHonoraire 
                fileId={this.props.params.fileId}
            />
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Honoraires)
