
import styles from './IntervalTableGrid.module.css';

export const IntervalTableGrid = () => {
  return (
    <div className={styles.intervalTableGrid}>
      {new Array(24).fill(1).map((item, index) => {
        return (
          <div key={index} className={styles.intervalTableGridItem} />
        );
      })}
    </div>
  );
};
