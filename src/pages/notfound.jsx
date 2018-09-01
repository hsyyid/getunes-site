import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export default class NotFound extends Component {
  render() {
    return <section className="page-not-found">
      <div className="content404">
        <h2 className="section-title">404</h2>
        <p className="lead">Bummer! The page you were looking for was not found.
        </p>
        <p>
          <Link to="/" className="btn btn-default btn-sm">Back to home</Link>
        </p>
      </div>
    </section>
  }
}
