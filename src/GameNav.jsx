import React from 'react';
import { NavLink } from 'react-router-dom';

function GameNav() {
  return (
    <nav className="nav nav-tabs nav-fill navbar-light bg-light rounded">
      <NavLink to="/game/1" className="nav-item nav-link">Game 1</NavLink>
      <NavLink to="/game/2" className="nav-item nav-link">Game 2</NavLink>
      <NavLink to="/game/3" className="nav-item nav-link">Game 3</NavLink>
      <NavLink to="/game/4" className="nav-item nav-link">Game 4</NavLink>
    </nav>
  )
}

export default GameNav;