import React from 'react';
import PropTypes from 'prop-types';

import Button, { TYPES as BUTTON_TYPES } from '../Button';

import DownChevronLight from '../../assets/icons/down-chevron-light.svg';

import styles from './header.module.scss';

const Header = ({ onScrollClick }) => (
  <header>
    <nav>
      <div className={`layout-l ${styles.navContent}`}>
        <p className={styles.company}>SPACE SAVVY</p>
      </div>
    </nav>
    <div className={styles.titleContainer}>
      <h1 className={styles.title}>Discover Space Missions</h1>
    </div>
    <div className={styles.buttonContainer}>
      <Button
        type={BUTTON_TYPES.ICON}
        onClick={onScrollClick}
        ariaLabel="Scroll down to content"
        title="Scroll down"
        icon={DownChevronLight}
      />
    </div>
  </header>
);

Header.propTypes = {
  onScrollClick: PropTypes.func,
}

Header.defaultProps = {
  onScrollClick: () => {},
}

export default Header;
