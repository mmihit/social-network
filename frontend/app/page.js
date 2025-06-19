import styles from "./styles/page.module.css";


export default function Home() {
  console.log(styles.title)
  return (
    <h1 className={styles.title}>this is the home page</h1>
  );
}