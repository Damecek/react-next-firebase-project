import React, {useCallback, useEffect, useState} from 'react';
import {useContext} from 'react';

import {UserContext} from '../lib/context';

import {auth, firestore, googleAuthProvide} from '../lib/firebase';

import debounce from 'lodash.debounce';

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
            <img src={'/google.png'} alt="Google logo"/> Sign in with Google
        </button>
    );
}

function SignOutButton() {
    return <button onClick={() => auth.signOut()}>Sign Out!</button>;
}

function UsernameForm() {
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const {user, username} = useContext(UserContext);

    const handleChange = (event) => {
        const val = event.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        if (val.length < 3) {
            setFormValue(val);
            setLoading(false);
            setIsValid(false);
        }

        if (re.test(val)) {
            setFormValue(val);
            setLoading(true);
            setIsValid(false);
        }
    };

    const checkUsername = useCallback(debounce(async (username) => {
        if (username.length >= 3) {
            const ref = firestore.doc(`usernames/${username}`);
            const {exists} = await ref.get();
            setIsValid(!exists);
            setLoading(false);
        }
    }, 500), []);

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const userDoc = firestore.doc(`users/${user.uid}`);
        const usernameDoc = firestore.doc(`usernames/${formValue}`);

        const batch = firestore.batch();
        batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
        batch.set(usernameDoc, {uid: user.uid});
        await batch.commit();
    };

    if (username) return '';
    return (
        <section>
            <h3>Choose Username</h3>
            <form onSubmit={handleSubmit}>
                <input name="username" placeholder="username" value={formValue} onChange={handleChange}/>
                <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
                <button type="submit" className="btn-green" disabled={!isValid}>Choose</button>
            </form>
            <h3>Debug State</h3>
            <div>
                Username: {formValue}
                <br/>
                Loading: {loading.toString()}
                <br/>
                Username Valid: {isValid.toString()}
            </div>
        </section>
    );
}

function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
        return <p>Checking...</p>;
    } else if (isValid) {
        return <p className="text-success">{username} is available!</p>;
    } else if (username && !isValid) {
        return <p className="text-danger">That username is taken!</p>;
    } else {
        return <p></p>;
    }
}

export default EnterPage;