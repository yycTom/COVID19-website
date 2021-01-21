import React, { Component } from 'react'

import {Auth0Provider, useAuth0} from '@auth0/auth0-react'
import LoginButton from './button'
const domain = process.env.REACT_APP_AUTH0_DOMAIN
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID
export default class Login extends Component {
 
    render() {
        return (
            <div>
                <Auth0Provider
                domain={domain}
                clientId={clientId}
                redirectUri={window.location.origin}
                >
                <LoginButton />
                </Auth0Provider>
    
            </div>
        )
    }
}
