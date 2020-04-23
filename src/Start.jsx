import React from 'react';
import { Link } from "react-router-dom";
import classnames from "classnames";
import styles from "./Start.module.scss";

function Start() {
  return (
    <div className="container-fluid vh-100 d-flex bg-dark">
      <div className={classnames("alert alert-warning", styles["center"])} role="alert">
        To start the game click <Link to={"/game/1"}>here</Link>.
      </div>
    </div>
  )
}

export default Start;