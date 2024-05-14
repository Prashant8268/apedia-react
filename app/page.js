import styles from './page.module.css'
import Link from 'next/link';
export default function Home() {
  return (
    <div className={styles.background} >
    <header className={styles.header}> 
        <h1 className={styles.title}>Welcome to <span className={styles.name}>Apedia</span></h1>
        <p>Connect with your friends</p>
    </header>

    <div className={styles.container}> 
        <img
            src="https://cdn-icons-png.flaticon.com/512/5996/5996258.png"
            className={styles['app-image']} 
        />
        <div className={styles['cta-buttons']}> 
            <Link href={'/signIn'} className={styles['cta-button']}>Sign In</Link> 
            <Link href={''} className={styles['cta-button']}>Sign Up</Link> 

        </div>
    </div>
</div>
  );
}

