
import styles from './IntervalTableGrid.module.css';

const generateGridLabels = () => {
  return new Array(24).fill(1);
};

export const IntervalTableGrid = () => {
  return (
    <div className={styles.intervalTableGrid}>
      {generateGridLabels().map((item, index) => {
        return (
          <div key={index} className={styles.intervalTableGridItem} />
        );
      })}
    </div>
  );
};
