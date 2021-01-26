import React, { Component } from 'react';
import { Button, Form } from 'semantic-ui-react'
import './styles.css';

export class Login extends Component {
  static displayName = Login.name;

  render() {
    return (
      <div className="container">
        <div className="loginModal">
          <Form>
            <Form.Field>
              <input placeholder='user' />
            </Form.Field>
            <Form.Field>
              <input placeholder='password' />
            </Form.Field>
            <Button type='submit'>Login</Button>
          </Form>
        </div>
      </div>
    );
  }
}
