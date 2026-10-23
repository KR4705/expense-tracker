import styles from './PlaceholderScreen.module.css';

/**
 * Temporary landing screen shown until the expense-entry flow is built.
 * Contains no actions, so it has no primary button (SG-01 applies to entry screens).
 */
export function PlaceholderScreen() {
  return (
    <section className={styles.screen} aria-labelledby="placeholder-title">
      <h1 id="placeholder-title" className={styles.title}>
        Expense Tracker
      </h1>
      <p className={styles.description}>
        This app is under development. Soon you’ll be able to record an expense in a few taps and see
        where your money goes.
      </p>
    </section>
  );
}
