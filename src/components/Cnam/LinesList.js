import React, { Component } from 'react'
import {Link} from "react-router";

export default class LinesList extends Component {
    renderList = () => {
        return this.props.lines.map((line, index) => {
            return (
                <a onClick={() => {window.location.href='/cnam/' + this.props.fileId + '/' + line?._id}} style={{display: 'table-row', color: 'black', cursor: 'pointer'}}>
                        <th scope="row">{index + 1}</th>
                        <td>{line?.name}</td>
                        <td>{line?.idCnam}</td>
                        <td>{new Date(line?.dateSoins).toJSON().slice(0, 10)}</td>
                </a>
            )
        })
    }

    render() {
        if (this.props.lines?.length)
            return (
                <div style={{padding: '0 10%'}}>
                    <table class="table" >
                        <thead class="thead-dark">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Nom & prenom</th>
                                <th scope="col">ID cnam</th>
                                <th scope="col">Date soins</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderList()}
                        </tbody>
                    </table>
                </div>
                
            )
        
        return 'Fichier encore vide...'
    }
}
