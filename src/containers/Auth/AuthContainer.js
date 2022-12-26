import React, { Component } from 'react';
import Login from '../../components/Auth/Login';
import SignUp from '../../components/Auth/SignUp';
import ConfirmationEmail from '../../components/Auth/ConfirmationEmail';
import ForgotPassword from "../../components/Auth/ForgotPassword";
import ResetPassword from "../../components/Auth/ResetPassword";
import TeamInvitation from "../../components/Auth/TeamInvitation";

export default class AuthContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            stars: []
        };
    }

    componentDidMount = () => {
        this.initShootingStars();
    }

    initShootingStars = () => {
        let total = Math.floor(Math.random() * 35) + 25;
        let stars = [];
        for(let i = 0; i < total; i++) {
            let star = {
                type: Math.floor(Math.random() * 2) + 1,
                speed: ((Math.random() * 2.5) + 1).toFixed(2),
                top: (Math.floor(Math.random() * window.innerHeight) + 0).toFixed(2),
                delay: (Math.floor(Math.random() * 10) + 0).toFixed(2),
                zIndex: Math.floor(Math.random() * 2) + 1,
                opacity: 1,
            }
            stars.push(star);
        }
        this.setState({stars: stars})
    }

    renderShootingStars = () => {
        return (this.state.stars.map((star) => {
            if (star.type === 1)
                star.opacity = ((Math.random() * 0.7) + 0.3).toFixed(2)
            return(
                <div className='shooting-stars' style={{
                    background: "url('/icons/shooting_star"+star.type+".svg')",
                    animationDuration: star.speed + 's',
                    top: star.top+'px',
                    animationDelay: star.delay+'s',
                    // zIndex: star.zIndex,
                    // opacity: star.opacity
                }}/>
            )
        }))
    }

    renderContent = () => {
        if((this.props.params !== undefined && this.props.params.login === 'login') || (this.props.login !== undefined && this.props.login)) {
            return (<Login />)
        }
        else if ((this.props.params !== undefined && this.props.params.confirmation === 'confirmation')) {
            return (<ConfirmationEmail token={this.props.params.token}/>)
        } else if ((this.props.params !== undefined && this.props.params.login === 'forgot-password')) {
            return (<ForgotPassword/>)
        } else if ((this.props.params !== undefined && this.props.params.confirmation === 'change')) {
            return (<ResetPassword token={this.props.params.token}/>)
        } else if ((this.props.params !== undefined && this.props.params.confirmation === 'invitation')) {
            return (<TeamInvitation token={this.props.params.token} email={this.props.params.email}/>)
        } else {
            return (<SignUp />)
        }
    }

    render() {
        return (
            <div className='login-container'>
                <div className='panel night'>
                    <p className='title'>Start your Journey with Slyde</p>
                    <div className='figures-container'>
                        <div className='rocket'/>
                        <div className='fumes' />
                    </div>
                    <div className='fumes-base' />
                    <div className='bg'/>
                    <div className='shooting-stars'></div>
                    <div className='shooting-stars second-wave'></div>
                    {this.renderShootingStars()}
                    <div className='credits'>
                        Art by <a href='https://freepik.com/pikisuperstar' target="_blank">pikisuperstar</a>
                    </div>
                </div>
                {
                    this.renderContent()
                }
            </div>
        );
    }
}
