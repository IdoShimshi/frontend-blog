import React from 'react';
import styles from './Spinner.module.css'; // Import CSS module styles

const Spinner = () => {
  return (
    <div className={styles.spinner}>
      <div className={styles['spinner-inner']} />
    </div>
  );
};

export default Spinner;