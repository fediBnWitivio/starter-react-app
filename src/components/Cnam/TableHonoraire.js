import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getFile } from '../../actions/CnamAction'

export class TableHonoraire extends Component {
    componentDidMount = () => {
        this.props.getFile(this.props.fileId)
    }

    renderTable = () => {
        return (
            <table class="table table-bordered" style={{textAlign: 'center'}}>
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Date des soins</th>
                        <th scope="col">L'IU de l'assuré</th>
                        <th>Prénom</th>
                        <th>Qualité*</th>
                        <th style={{maxWidth: '84px', overflowWrap: 'break-word'}}>Code APCI</th>
                        <th style={{maxWidth: '84px', overflowWrap: 'break-word'}}>Code acte</th>
                        <th style={{maxWidth: '84px', overflowWrap: 'break-word'}}>Cotation</th>
                        <th style={{maxWidth: '90px', overflowWrap: 'break-word'}}>MONTANT TOTAL</th>
                        <th style={{maxWidth: '84px', overflowWrap: 'break-word'}}>Ticket modérateur Perçu de l’assuré</th>
                        <th style={{maxWidth: '84px', overflowWrap: 'break-word'}}>Montant à la charge de la CNAM</th>
                        <th style={{maxWidth: '84px', overflowWrap: 'break-word'}}>code conventionnel du médecin traitant **</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderList()}
                    {this.renderFooter()}
                </tbody>
            </table>
        )
    }

    translationQualite = (qualite) => {
        if (qualite.indexOf("20") !== -1 ) 
            return 'Enfant'

        switch (qualite) {
            case '000' : 
                return 'Adherant';
            case '100' : 
                return 'Conjoint';
            case '300':
                return 'Père'
            case '400':
                return 'Mère'
        }
    }

    renderList = () => {
        if (this.props.file?.lines?.length)
            return this.props.file?.lines.map((line, index) => {
                return (
                    <tr>
                        <td scope="row">{index + 1}</td>
                        <td>{this.getDate(new Date(line?.dateSoins).toJSON().slice(0, 10))}</td>
                        <td>{line?.idCnam}</td>
                        <td>{line?.name}</td>
                        <td>{this.translationQualite(line?.adherant)}</td>
                        <td>{line?.codeAPCI}</td>
                        <td>{line?.isInfiltration && 'MKB020010'}</td>
                        <td>{line?.isInfiltration && 24}</td>
                        <td>45</td>
                        <td>{this.getTicketAndMontant(line)?.ticket}</td>
                        <td>{this.getTicketAndMontant(line)?.montant}</td>
                        <td>{line?.codeMedecin}</td>
                    </tr>
                )
            })
    }

    getTicketAndMontant = (line) => {
        // case acte mediacal & apci
        if (line?.apciType === 'APCI' && line?.isInfiltration) {
            return {
                ticket: 0,
                montant: 24
            }
        }
        // case APCI normal sans acte
        else if (line?.apciType === 'APCI' && !line?.isInfiltration) {
            return {
                ticket: 0,
                montant: 45
            }
        }
        // case acte medical & tiers payant
        else if (line?.apciType === 'TIERS' && line?.isInfiltration) {
            return {
                ticket: 7.2,
                montant: 16.8
            }
        }
        // case tiers payant normal
        if (line?.apciType === 'TIERS' && !line?.isInfiltration) {
            return {
                ticket: 13.5,
                montant: 31.5
            }
        }
    }

    renderFooter = () => {
        return (
            <>
                <tr style={{textAlign: 'center'}}>
                    <td></td>
                    <td colspan="9"><b>TOTAL A REPORTER</b></td>
                    <td colspan="2"><b></b></td>
                </tr>
                <tr style={{textAlign: 'center'}}>
                    <td></td>
                    <td colspan="9"><b>Total à payer</b></td>
                    <td colspan="2">
                        <b>{ parseFloat(this.getMontantTotalCNAM(this.props.file?.lines)).toFixed(3)} Dtn</b>
                    </td>
                </tr>
            </>
        )
    }

    getMontantTotalCNAM = (lines) => {
        let montant = 0;
        if (lines?.length) {
            lines.map(line => {
                montant += this.getTicketAndMontant(line)?.montant;
            })
        }
        
        return montant;
    }

    renderHeader = (file) => {
        return (
            <>
                <h2 style={{textAlign: 'center', fontSize: '25px', marginBottom: '25px', padding: '5%'}}>NOTE D’HONORAIRES DES CONSULATATIONS ET DES ACTES AMBULATOIRES EFFECTUES PAR MEDECIN CONVENTIONNE DANS LE CADRE DU TIERS PAYANT</h2>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '500', padding: '0 7%'}}>
                    <div style={{width: '33%'}}>
                        <p>Médecin: Dr Ben Nejma Mohamed Salah</p>
                        <p>Période du {this.getDate(file?.creationDate)} au {this.getDate(file?.modificationDate)}</p>
                    </div>

                    <div style={{width: '33%', textAlign: 'center'}}>
                        <p style={{margin: 0}}>Code conventionnel: 1/13951/80</p>
                        <p><b>REPORT</b></p>
                    </div>
                    <p style={{width: '33%', textAlign: 'right'}}><b>PAGE:</b></p>
                </div>
            </>
        )
    }

    getDate = (date) => {
        if (date === null || date === undefined) return ''
        return this.splitDate(new Date(date).toJSON().slice(0, 10));
    }

    splitDate = (date) => {
        if (date !== '') {
            let parts = date.split('-')
            let yearBirth = parts[0];
            let monthBirth = parts[1];
            let dayBirth = parts[2];
            return dayBirth + '-' + monthBirth + '-' + yearBirth ;
        }

        return ''
    }

    renderFooterText = () => {
        return (
            <div style={{fontWeight: '500', padding: '0 7%'}}>
                <p style={{overflow: 'hidden'}}>
                    Arrêté le présent décompte à la somme de (en toutes lettres) <br/>
                    ……………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………
                </p>
                <hr style={{borderTop: '1px solid'}} />
                <p style={{fontSize: '13px'}}>
                    * assuré social, conjoint, enfant, père ou mère à charge.<br/>
                    ** dans le cas où le malade (APCI) vous a été orienté par son médecin traitant (joindre la lettre de liaison).
                </p>
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.renderHeader(this.props.file)}
                {this.renderTable()}
                {this.renderFooterText()}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    file: state.cnam.file,
})

const mapDispatchToProps = {
    getFile,
}

export default connect(mapStateToProps, mapDispatchToProps)(TableHonoraire)
