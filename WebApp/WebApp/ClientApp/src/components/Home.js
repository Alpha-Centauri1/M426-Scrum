import React, { Component } from 'react';

export class Home extends Component {
    static displayName = Home.name;

    render() {
        return (
            <div>
                <h1>Welcome to FlightX</h1>
                <div class="">
                    <h3>Login</h3>
                    <form method="POST">
                        <label htmlFor="username">Username</label>
                        <input id="username" name="username" type="text" />
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" name="password" />
                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        );
    }
}
