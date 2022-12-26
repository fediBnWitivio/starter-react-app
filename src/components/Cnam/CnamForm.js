import React, { Component } from 'react'
import moment from 'moment'
import { addLine, getFile, searchMedecin, updateLine, searchPatient, deleteLine } from '../../actions/CnamAction'
import { connect } from 'react-redux'
import {Link} from "react-router";
import LinesList from './LinesList';

export class CnamForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            idCnam1: '',
            idCnam2: '',
            idCnam: '',
            typeCNSS: null,
            name: '',
            birthdate: '',
            apciType: '',
            codeAPCI: '',
            codeMedecin: '',
            codeMedecin1: 0,
            codeMedecin2: 0,
            codeMedecin3: 0,
            dateSoins: new Date().toJSON().slice(0,10),
            isConsultation: '',
            isInfiltration: false,
            infiltrationMontant: 24,
            adherant: '',
            montantAPCI: 45000,
            montantInfiltration: 24000,
            renduTiers: 31500,
            renduAPCI: 45000,
            renduInfiltrationAPCI: 24000,
            renduInfiltrationTiers: 16800,
            nomMedecin: '',
            openMedecins: false,
            selectedLine: 0,
            previousLine: '',
            nextLine: ''
        }
    }

    componentDidMount = () => {
        this.props.getFile(this.props.fileId)
    }

    componentDidUpdate = (prev) => {
        if (prev.file !== this.props.file) {
            this.selectLine(this.props.file)
        }
    }

    selectLine = (file) => {
        if (file && file.lines && file.lines.length) {
            if (this.props.lineId) {
                for (let i = 0; i < file.lines.length; i++) {
                    if (file.lines[i] && file.lines[i]._id === this.props.lineId) {
                        let line = {
                            ...file.lines[i],
                            dateSoins: new Date(file.lines[i].dateSoins).toJSON().slice(0,10),
                            birthdate: new Date(file.lines[i].birthdate).toJSON().slice(0,10),
                            codeMedecin1: file.lines[i].codeMedecin.slice(0,2),
                            codeMedecin2: file.lines[i].codeMedecin.slice(2,10),
                            codeMedecin3: file.lines[i].codeMedecin.slice(10,12),
                            idCnam1: file.lines[i].idCnam.slice(0,8),
                            idCnam2: file.lines[i].idCnam.slice(8,10),
                            codeAPCI: file.lines[i].codeAPCI
                        }
                        this.setState({
                            selectedLine: this.props.lineId,
                            ...line
                        })

                        if ((i - 1) >= 0) {
                            this.setState({
                                previousLine: file.lines[i - 1] ? file.lines[i - 1]._id : '',
                            })
                        }

                        if ((i + 1) <= file.lines.length) {
                            this.setState({
                                nextLine: file.lines[i + 1] ?  file.lines[i + 1]._id : '',
                            })
                        }
                    }
                }
            } else {
                this.setState({
                    previousLine: file.lines[file.lines.length - 1]._id,
                })
            }
        }
    }

    handleInput = (e) => {
        if (e.target) {
            this.setState({
                [e.target.name] : e.target.value
            })
        }

        if (e.target.name === "nomMedecin") {
            this.setState({openMedecins: true})
            this.props.searchMedecin(e.target.value)
        }
    }

    handleInputIdCnam = (e) => {
        this.setState({
            idCnam2: e.target.value,
        }, () => {
            this.setState({
                idCnam: this.state.idCnam1 + this.state.idCnam2
            })
        })
    }

    handleInputCodeMedecin = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
            openMedecins: true
        });

        this.props.searchMedecin(e.target.value)
    }

    searchPatient = (e) => {
        this.setState({openPatient: true})
        this.props.searchPatient(e.target.value)
    }

    patientBlur = () => {
        setTimeout(() => {
            this.setState({openPatient: false})
        }, 1000);
    }

    codeMedecinOnBlur = (e, length) => {
        this.setState({
            [e.target.name]: this.padWithZeros(e.target.value, length),
            //openMedecins: false
        }, () => {
            this.setState({
                codeMedecin: this.state.codeMedecin1 + this.state.codeMedecin2 + this.state.codeMedecin3
            })
        })

        setTimeout(() => {
            this.setState({
                openMedecins: false
            })
        }, 1000)
    }

    handleCheckbox = (value) => {
        this.setState({
            isInfiltration : value
        })
    }

    handleBirthDate = (date) => {
        this.setState({birthdate : date })
    }

    renderAdherant = () => {
        if (this.state.typeCNSS !== null)
            return (
                <div className="form-row">
                    <div className="form-group col-6" />
                    <div className="form-group col-6">
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" value="000" name='adherant' onChange={this.handleInput} checked={this.state.adherant == "000"}/>
                            <label className="form-check-label">Adherant</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" value="100" name='adherant' onChange={this.handleInput} checked={this.state.adherant == "100"}/>
                            <label className="form-check-label">Conjoint</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" value="20" name='adherant' onChange={this.handleInput} checked={this.state.adherant.indexOf("20") !== -1}/>
                            <label className="form-check-label">Enfant</label>
                        </div>

                        {
                            this.state.adherant.indexOf("20") !== -1 &&
                                <div className="form-check form-check-inline">
                                    <select id="inputState" className="form-control" name='adherant' onChange={this.handleInput} value={this.state.adherant}>
                                        <option selected>NB</option>
                                        <option value="201">1</option>
                                        <option value="202">2</option>
                                        <option value="203">3</option>
                                        <option value="204">4</option>
                                    </select>
                                </div>
                        }

                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" value="300" name='adherant' onChange={this.handleInput} checked={this.state.adherant == "300"}/>
                            <label className="form-check-label">Père</label>
                        </div>

                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" value="400" name='adherant' onChange={this.handleInput} checked={this.state.adherant == "400"}/>
                            <label className="form-check-label">Mère</label>
                        </div>

                    </div>
                </div>
            )
    }

    renderDonneesPatient = () => {
        return (
            <>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label for="inputState">Identifiant Unique à la CNAM</label>
                        <div style={{ display: 'inline-flex', justifyContent: 'space-between' }}>
                            <input type="text" className="form-control" placeholder='identifiant CNAM...' style={{ marginRight: '15px' }} name='idCnam1' value={this.state.idCnam1} onChange={(e) => {this.handleInput(e); this.searchPatient(e)}} onBlur={() => {this.setState({idCnam: this.state.idCnam1 + this.state.idCnam2}); this.patientBlur()} } maxLength="8"/>
                            <input type="text" className="form-control" style={{ width: '50%', marginRight: '15px' }} name='idCnam2' onChange={this.handleInputIdCnam} value={this.state.idCnam2} maxLength="2"/>
                        </div>
                        {this.renderPatientsAutocomplete()}
                    </div>

                    <div className='form-group col-md-6' style={{ margin: 'auto', marginLeft: 0, paddingTop: '10px' }}>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name='typeCNSS' value="CNSS" onChange={this.handleInput} checked={this.state.typeCNSS == "CNSS"}/>
                            <label className="form-check-label">CNSS</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name='typeCNSS' value="CNRPS" onChange={this.handleInput} checked={this.state.typeCNSS == "CNRPS"}/>
                            <label className="form-check-label" for="inlineCheckbox2">CNRPS</label>
                        </div>
                    </div>
                </div>

                {this.renderAdherant()}

                <div className="form-row">
                    <div className="form-group col-6">
                        <label for="inputAddress">Nom et Prénom</label>
                        <input type="text" className="form-control" placeholder="nom et prenom..." name='name' value={this.state.name} onChange={(e) => {this.handleInput(e); this.searchPatient(e)}}/>
                    </div>
                    <div className="form-group col-6">
                        <label for="inputAddress2">Date de naissance</label>
                        <input
                            type="date"
                            onChange={this.handleInput}
                            value={this.state.birthdate}
                            name='birthdate'
                            className="form-control"
                            closeOnSelect
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group col-3">
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name='apciType' value="APCI" onChange={this.handleInput} checked={this.state.apciType === 'APCI'}/>
                            <label className="form-check-label" for="gridCheck">
                                APCI
                            </label>
                        </div>
                        <input type="text" className="form-control" placeholder="code de l'APCI..." value={this.state.codeAPCI} name='codeAPCI' style={{ marginTop: '3px', width: '80%' }} onChange={this.handleInput}/>
                    </div>

                    <div className="form-group col-3" style={{margin: 'auto 0'}}>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name='apciType' value="TIERS" onChange={this.handleInput}  checked={this.state.apciType === 'TIERS'}/>
                            <label className="form-check-label" for="gridCheck">
                                Tiers-Payant
                            </label>
                        </div>
                    </div>

                    <div className="form-group col-6">
                        <label for="inputAddress">Code du médecin</label>
                        <div style={{ display: 'inline-flex', justifyContent: 'space-between' }}>
                            <input type="text" className="form-control" name='codeMedecin1' placeholder="code du médecin..." value={this.state.codeMedecin1} onChange={this.handleInputCodeMedecin} onBlur={(e) => this.codeMedecinOnBlur(e, 2)} maxLength='2' style={{width: '50%', marginRight: "15px"}}/>
                            <input type="text" className="form-control" style={{ marginRight: '15px' }} name='codeMedecin2' value={this.state.codeMedecin2} onChange={this.handleInputCodeMedecin} onBlur={(e) => this.codeMedecinOnBlur(e, 8)} maxLength="8"/>
                            <input type="text" className="form-control" style={{ marginRight: '15px' }} name='codeMedecin3' value={this.state.codeMedecin3} onChange={this.handleInputCodeMedecin} onBlur={(e) => {this.codeMedecinOnBlur(e, 2)}} maxLength="2"/>
                        </div>

                        {this.renderMedecinsAutocomplete()}
                    </div>

                    <div className='form-group col-6'/>

                    <div className='form-group col-6'>
                        <input type="text" className="form-control" name='nomMedecin' value={this.state.nomMedecin} onChange={this.handleInput} onBlur={() => {/*this.setState({openMedecins: false})*/}} placeholder="nom medecin..."/>
                    </div>
                </div>
            </>
        )
    }

    renderSoins = () => {
        return (
            <>
                <div className="form-row">
                    <div className="form-group col-6">
                        <label for="inputAddress2">Date des soins</label>
                        <input
                            type='date'
                            className="form-control"
                            placeholder= "date des soins"
                            name='dateSoins'
                            closeOnSelect
                            value={this.state.dateSoins}
                            onChange={this.handleInput}
                        />
                    </div>

                    <div className="form-group col-6">
                        <label for="inputAddress">Ticket Modérateur</label>
                        <div className='form-group'>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" />
                                <label className="form-check-label">Oui</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" />
                                <label className="form-check-label">Non</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-row">
                    <div className='form-group col-6' style={{margin: "auto 0"}}>
                        <div className="form-check form-check-inline" style={{marginLeft: '5px'}}>
                            <input className="form-check-input" type="checkbox" name='isInfiltration' onChange={() => this.handleCheckbox(false)} checked={!this.state.isInfiltration} />
                            <label className="form-check-label">Consulation</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" name='isInfiltration' onChange={() => this.handleCheckbox(true)} checked={this.state.isInfiltration}/>
                            <label className="form-check-label">Acte Médical</label>
                        </div>
                    </div>

                    {
                        this.state.isInfiltration &&
                        <>
                            <div className='form-group col-3'>
                                <label for="inputAddress">Code de l'acte</label>
                                <input type="text" className="form-control" placeholder="code de l'acte..." value='MKB020010'/>
                            </div>

                            <div className='form-group col-3'>
                                <label for="inputAddress">Montant de l'acte</label>
                                <input type="text" className="form-control" placeholder="montant..." name="infiltrationMontant" value={this.state.infiltrationMontant} onChange={this.handleInput}/>
                            </div>
                        </>
                    }
                </div>
            </>
        )
    }

    submitCNAM = () => {
        let first = this.state.isInfiltration ? '3' : '2'; // should be changed to only 2 or 1 and 0000 are from the rang
        let rang = this.padWithZeros(this.props.file.lines.length || 1, 5); // should be changed to index
        let cnss = this.state.typeCNSS === 'CNSS' ? 1 : 2;
        let idCnam = this.state.idCnam;
        let adherant = this.state.adherant;
        let name = this.state.name;

        let result = first + rang + cnss + idCnam + adherant + name
        console.log(result)

        let dateBirth = this.splitDate(this.state.birthdate);
        let dateSoins = this.splitDate(this.state.dateSoins);

        let codeMedecin = this.state.codeMedecin !== '' && this.state.apciType === 'TIERS' ? this.state.codeMedecin : '000000000000';

        let montant = '00000000';
        let montant2 = '00000000';
        let montant3 = '00000000';
        let montant4 = '';

        let diff;
        if (this.state.isInfiltration) {
            montant = this.padWithZeros(this.state.montantInfiltration, 10);
            montant2 = montant ;
            montant4 = this.state.apciType === 'APCI' ? this.padWithZeros(this.state.renduInfiltrationAPCI, 12) : this.padWithZeros(this.state.renduInfiltrationTiers, 12)
            if (this.state.apciType === 'TIERS') {
                montant3 = this.padWithZeros(this.state.renduInfiltrationAPCI - this.state.renduInfiltrationTiers, 9)
            } else {
                montant3 = this.padWithZeros(0, 9)
            }
        }
        else {
            montant = this.padWithZeros(this.state.montantAPCI, 10);
            montant2 = montant;
            diff = this.padWithZeros(this.calculateDifference(), 10);
            montant3 = this.state.apciType === 'TIERS' ? this.padWithZeros(diff, 10) : this.padWithZeros(0, 10);
            montant4 = this.state.apciType === 'APCI' ? this.padWithZeros(this.state.renduAPCI, 11) : this.padWithZeros(this.state.renduTiers, 11);
        }

        let code = '000';
        if (this.state.apciType !== 'TIERS') {
            code = this.padWithZeros(this.state.codeAPCI, 3)
        }

        let resultSecond = dateBirth + codeMedecin + dateSoins + montant + montant2 + montant3 + montant4 + code;
        console.log(resultSecond)

        let lineValue = this.padWithSpace(result, 80) + resultSecond + '\n';
        let line = {
            value: lineValue,
            idCnam: this.state.idCnam,
            typeCNSS: this.state.typeCNSS,
            name: this.state.name,
            birthdate: this.state.birthdate,
            apciType: this.state.apciType,
            codeMedecin: this.state.codeMedecin,
            nomMedecin: this.state.nomMedecin,
            codeAPCI: this.state.codeAPCI,
            dateSoins: this.state.dateSoins,
            isInfiltration: this.state.isInfiltration,
            montant: montant,
            montantCnam: montant4,
            adherant: this.state.adherant,
        }

        let medecin = {
            code: this.state.codeMedecin,
            name: this.state.nomMedecin
        }

        if (this.props.lineId && this.props.lineId !== '' && this.state._id && this.state._id !== null && this.state._id === this.props.lineId) {
            this.props.updateLine(line, medecin, this.props.fileId, this.state._id)
        } else
            this.props.addLine(line, medecin, this.props.fileId)
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

    /**
     * REMEMBER!!!!!
     * @returns
     */
    calculateDifference = () => {
        return this.state.montantAPCI - this.state.renduTiers
    }

    saveTxtFile = (isApercu) => {
        if (this.props.file) {
            let input = this.getFirstFileLine();
            this.props.file.lines.map(line => {
                input += line.value
            });

            if (!isApercu) {
                const element = document.createElement("a");
                const file = new Blob([input], {type: 'text/plain'});
                element.href = URL.createObjectURL(file);
                element.download = this.props.file.name + ".txt";
                document.body.appendChild(element);
                element.click();
            } else {
                console.log(input)
                const win = window.open('about:blank', '_blank');
                win.document.write('<div style="white-space: pre-wrap;">' + input + '</div>');
                win.focus();
            }
        }
    }

    getFirstFileLine = () => {
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
        console.log("diff", sommeTotale, "sommeCnamTotale:", sommeCnamTotale,  sommeTotale - sommeCnamTotale, diff)

        let secondPart = totalLines + this.padWithZeros(sommeTotale, 10) +this.padWithZeros(diff, 10) + this.padWithZeros(sommeCnamTotale, 10)

        let line = this.padWithSpace(firstPart, 57) + secondPart + '\n\n';

        return line
    }

    renderMedecinsAutocomplete = () => {
        if (this.props.medecins && this.props.medecins.length && this.state.openMedecins) {
            return (
                <div className='autocomplete'>
                    {this.renderMedecins()}
                </div>
            )
        }
    }

    renderMedecins = () => {
        return this.props.medecins.map(medecin => {
            return (
                <div onClick={() => this.selectMedecin(medecin)}>
                    {medecin.name} {medecin.code}
                </div>
            )
        })
    }

    selectMedecin = (medecin) => {
        this.setState({
            nomMedecin: medecin.name,
            codeMedecin: medecin.code,
            codeMedecin1: medecin.code.slice(0,2),
            codeMedecin2: medecin.code.slice(2,10),
            codeMedecin3: medecin.code.slice(10,12),
            openMedecins: false
        })
    }

    renderPatientsAutocomplete = () => {
        if (this.props.patients && this.props.patients.length && this.state.openPatient) {
            return (
                <div className='autocomplete'>
                    {this.renderPatients()}
                </div>
            )
        }
    }

    renderPatients = () => {
        return this.props.patients.map(patient => {
            return (
                <div onClick={() => this.selectPatient(patient)}>
                    {patient.name} {patient.idCnam}
                </div>
            )
        })
    }

    selectPatient = (patient) => {
        console.log(patient)
        this.setState({
            ...patient,
            dateSoins: new Date(patient.dateSoins).toJSON().slice(0, 10),
            birthdate: new Date(patient.birthdate).toJSON().slice(0, 10),
            codeMedecin1: patient.codeMedecin ? patient.codeMedecin.slice(0, 2) : '',
            codeMedecin2: patient.codeMedecin ? patient.codeMedecin.slice(2, 10) : '',
            codeMedecin3: patient.codeMedecin ? patient.codeMedecin.slice(10, 12) : '',
            idCnam1: patient.idCnam.slice(0, 8),
            idCnam2: patient.idCnam.slice(8, 10)
        })
    }

    deleteLine = (lineId) => {
        this.props.deleteLine(lineId);
        window.location.href='/cnam/' + this.props.fileId
    }

    renderForm = () => {
        return (
            <div className='dashboard'>
                <Link to={'/'}> <i className="fas fa-home"/> Accueil</Link>
                {
                    this.props.lineId &&
                    <i className="fas fa-trash-alt" onClick={() => this.deleteLine(this.props.lineId)} style={{float: "right", cursor: "pointer", color: "#ed7883"}}/>
                }
                <h1>Saisie d'information pour le borderau de la CNAM</h1>
                <h3>{this.props.lineId ? 'Modifier ' : 'Ajouter '} données du patient</h3>
                {this.renderDonneesPatient()}
                <h3>Soins</h3>
                {this.renderSoins()}
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: "20px", float: 'left' }} onClick={this.submitCNAM}>{this.props.lineId ? 'Modifier' : 'Ajouter'}</button>
                    <div style={{float: 'right'}}>
                        <button type="submit" className="btn btn-secondary" style={{ marginTop: "20px", marginRight: '5px'}} onClick={() => this.saveTxtFile(false)}><i className="fas fa-file-download" style={{ marginRight: "5px" }} />Telecharger</button>
                        <button type="submit" className="btn btn-secondary" style={{ marginTop: "20px"}} onClick={() => this.saveTxtFile(true)}><i className="fas fa-eye" style={{ marginRight: "5px" }} />Aperçu</button>
                    </div>
                </div>

                <div className='arrows' style={{width: '20%', height: '100vh', display: 'flex', position: 'absolute', left: '0', top: '0'}}>
                    <a onClick={() => {window.location.href='/cnam/' + this.props.fileId + '/' + this.state.previousLine}} style={{margin: 'auto', fontSize: '50px'}}><i class="fas fa-chevron-left"></i></a>
                </div>

                <div className='arrows' style={{width: '20%', height: '100vh', display: 'flex', position: 'absolute', right: '0', top: '0'}}>
                    <a onClick={() => {window.location.href='/cnam/' + this.props.fileId + '/' + this.state.nextLine}} style={{margin: 'auto', fontSize: '50px'}}> <i class="fas fa-chevron-right"></i></a>
                </div>
            </div>
        )
    }

    render() {
        return (
            <>
                {this.renderForm()}
                <LinesList 
                    lines={this.props.file?.lines}
                    fileId={this.props.fileId}
                />
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    file: state.cnam.file,
    medecins: state.cnam.medecins,
    patients: state.cnam.patients
})

const mapDispatchToProps = {
    addLine,
    getFile,
    searchMedecin,
    searchPatient,
    updateLine,
    deleteLine
}

export default connect(mapStateToProps, mapDispatchToProps)(CnamForm)
