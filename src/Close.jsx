import React from 'react';
import { Link } from "react-router-dom";

const center = {
  margin: "auto"
}

function Close() {
  return (
    <div className="container-fluid vh-100 d-flex bg-dark">
      <div className="alert alert-danger" style={center} role="alert">
        Connection closed. Start <Link to={"/"}>again</Link>.
      </div>
    </div>
  )
}

export default Close;