import React from 'react';
import {useContext} from 'react';

import {UserContext} from '../lib/context';

import {auth, googleAuthProvide} from '../lib/firebase';

function EnterPage(props) {
    const {user, username} = useContext(UserContext);
    if (user) {
        return (
            <main>
                {username ? <SignOutButton/> : <UsernameForm/>}
            </main>
        );
    }
    return (
        <main>
            <SignInButton/>
        </main>
    );
}

function SignInButton() {
    const signInWithGoogle = async () => await auth.signInWithPopup(googleAuthProvide);

    return (
        <button className="btn-google" onClick={signInWithGoogle}>
            <img src={'/google.png'}/> Sign in with Google
        </button>
    );
}

function SignOutButton() {
    return <button onClick={() => auth.signOut()}>Sign Out!</button>;
}

function UsernameForm() {
    return 'user name form here';
}

export default EnterPage;