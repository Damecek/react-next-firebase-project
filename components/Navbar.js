import React from 'react';
import {useContext} from 'react';

import Link from 'next/link';

import {UserContext} from '../lib/context';

function Navbar(props) {
    const {user, username} = useContext(UserContext);
    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/">
                        <button className="btn-logo">FEED</button>
                    </Link>
                </li>
                {user && (
                    <>
                        <li className="push-left">
                            <Link href="/admin">
                                <button className="btn-blue">Write Posts</button>
                            </Link>
                        </li>
                        <li>
                            <Link href={`${username}`}>
                                <img src={user?.photoURL}/>
                            </Link>
                        </li>
                    </>
                )}
                {!user && (
                    <li>
                        <Link href="/enter">
                            <button className="btn-blue">Log In</button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;