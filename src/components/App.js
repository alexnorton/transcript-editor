import React from 'react';
import { PageHeader } from 'react-bootstrap';

const App = ({ children }) => (
  <div>
    <PageHeader>Transcriptor</PageHeader>
    {children}
  </div>
);

App.propTypes = {
  children: React.PropTypes.node,
};

export default App;
