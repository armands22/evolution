import React from 'react';
import styles from './Spinner.module.scss';
import classnames from 'classnames';

function Spinner(props) {
  const size = (props.size) ? props.size : "sm"
  const color = (props.color) ? props.color : "text-light"
  return (
    <div className={classnames("spinner-grow align-self-center", color, styles[size], styles["center"])}/>
  )
}

export default Spinner;