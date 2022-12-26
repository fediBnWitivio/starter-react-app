import React, { Component } from 'react'
import {Link} from "react-router";

export default class HomeCnam extends Component {
    constructor(props) {
        super(props)

        this.state = {
            newFile: 'Ben_Nejma'
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.files !== prevProps.files && this.props.files) {
            this.setState({
                newFile: 'Ben_Nejma_' + (this.props.files.length + 1)
            })
        }
    }

    // copy of the one in Form
    saveTxtFile = (selectedFile) => {
        if (selectedFile) {
            let input = this.getFirstFileLine(selectedFile);
            selectedFile.lines.map(line => {
                input += line.value
            });
            const element = document.createElement("a");
            const file = new Blob([input], {type: 'text/plain'});
            element.href = URL.createObjectURL(file);
            element.download = selectedFile.name + ".txt";
            document.body.appendChild(element);
            element.click();
        }
    }

    getFirstFileLine = (selectedFile) => {
        let codeMedecin = '1';
        let codeMS = '010001395180';
        let creationDate = this.splitDate(new Date(this.props.file.creationDate).toJSON().slice(0,10));
        let modificationDate = this.splitDate(new Date(this.props.file.modificationDate).toJSON().slice(0,10));
        let name = '';
        if (this.props.file.isClosed) {
            let rank = '' // temp. Should be from model memoire
            name += new Date() + rank
        } else {
            name = this.props.file.name[this.props.file.name.length - 1]
        }

        let firstPart = codeMedecin + codeMS + modificationDate + creationDate + modificationDate + name;

        let totalLines = this.padWithZeros(this.props.file.lines.length, 5);
        let sommeTotale = 0;
        let sommeCnamTotale = 0;
        this.props.file.lines.map(line => {
            sommeTotale += line.montant;
            console.log("line.montantCnam", line.montantCnam)
            sommeCnamTotale += line.montantCnam;
        })
        let diff = sommeTotale - sommeCnamTotale;

        let secondPart = totalLines + this.padWithZeros(sommeTotale, 10) +this.padWithZeros(diff, 10) + this.padWithZeros(sommeCnamTotale, 10)

        let line = this.padWithSpace(firstPart, 57) + secondPart + '\n\n';

        return line
    }

    splitDate = (date) => {
        if (date !== '') {
            let parts = date.split('-')
            let yearBirth = parts[0];
            let monthBirth = parts[1];
            let dayBirth = parts[2];
            return yearBirth + monthBirth + dayBirth;
        }

        return '00000000'
    }

    padWithZeros = (number, length) => {
        var myString = '' + number;
        while (myString.length < length) {
            myString = '0' + myString;
        }

        return myString;
    }

    padWithSpace = (number, length) => {
        var myString = '' + number;
        while (myString.length < length) {
            myString += ' ';
        }

        return myString;
    }

    renderTable = () => {
        return (
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nom</th>
                        <th scope="col">Date de Creation</th>
                        <th scope="col">Derniere de modification</th>
                        <th scope="col">Nb lignes</th>
                        <th scope="col">Ajouter patient</th>
                        <th scope="col">Telecharger</th>
                        <th scope="col">Honoraires</th>
                        <th scope="col">Supprimer</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.renderFiles()
                    }
                </tbody>
            </table>
        )
    }

    renderFiles = () => {
        if (this.props.files && this.props.files.length) {
            return this.props.files.map((file, index) => {
                return (
                    <tr style={{textAlign: 'center'}}>
                        <th scope="row">{index + 1}</th>
                        <td>{file.name}</td>
                        <td>{new Date(file.creationDate).toJSON().slice(0,10)}</td>
                        <td>{new Date(file.modificationDate).toJSON().slice(0,10)}</td>
                        <td>{file.lines.length}</td>
                        <td>
                            <Link to={`/cnam/${file._id}`}>Ajouter Patient</Link>
                        </td>

                        <td>
                            <button type="submit" className="btn btn-secondary" onClick={() => this.saveTxtFile(file)}>
                                <i className="fas fa-file-download" style={{ marginRight: "5px" }} />Telecharger
                            </button>
                        </td>

                        <td>
                            <Link to={`/honoraires/${file._id}`}>Consulter tableau</Link>
                        </td>

                        <td style={{padding: "4%"}}>
                            <i className="fas fa-trash-alt" onClick={() => this.props.deleteFile(file._id)} style={{margin: "auto", cursor: "pointer", color: "#ed7883"}}/>
                        </td>
                    </tr>
                )
            })
        }

        return 'Chargement...'
    }

    renderAddfile = () => {
        return (
            <div className="form-row">
                <div className="form-group col-6" style={{display: 'inline-flex'}}>
                    <input type="text" className="form-control" value={this.state.newFile} placeholder="nom du fichier...." onChange={this.handleFileName} style={{width: '50%'}}/>
                    <button type="submit" className="btn btn-primary" style={{ marginLeft: "20px" }} onClick={this.addFile}><i class="fas fa-file-medical" style={{marginRight: '5px'}}/>Ajouter Fichier</button>
                </div>
            </div>
        )
    }

    handleFileName = (e) => {
        this.setState({
            newFile: e.target.value
        })
    }

    addFile = () => {
        this.props.addFile(this.state.newFile)
    }

    render() {
        return (
            <div className='dashboard'>
                <h1>Liste des fichiers CNAM</h1>
                {this.renderTable()}
                {this.renderAddfile()}
            </div>
        )
    }
}
