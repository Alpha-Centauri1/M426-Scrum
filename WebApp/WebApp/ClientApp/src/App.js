import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import firebase from 'firebase/app';
import 'firebase/firestore';

import { useCollectionData } from 'react-firebase-hooks/firestore';

import './custom.css'

firebase.initializeApp({
  apiKey: "AIzaSyBAeUTbYIdivZ54w_iyCWG6iU_7ETysLfM",
  authDomain: "flights-ca9a7.firebaseapp.com",
  projectId: "flights-ca9a7",
  storageBucket: "flights-ca9a7.appspot.com",
  messagingSenderId: "460027677107",
  appId: "1:460027677107:web:dc3d37c30b316f8cc5e3c6"
});

const firestore = firebase.firestore();


export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/counter' component={Counter} />
        <Route path='/fetch-data' component={FetchData} />
      </Layout>
    );
  }
}
