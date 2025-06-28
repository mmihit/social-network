import Link from "next/link";
import styles from "./styles/pages/page.module.css";

export default function Home() {
  return (
    <>
      <h1 className={styles.title}>this is the home page</h1>
      <Link href="/groups">groups</Link>
    </>
  );
}
