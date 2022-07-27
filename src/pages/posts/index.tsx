import Head from 'next/head'
import styles from './styles.module.scss'

export default function Posts() {
  return (
    <>
      <Head>
        <title>Post | Ignews</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {[1, 2, 3].map(() => {
            return (
              <>
                <a href="#" key={Math.random()} >
                  <time>12 de março de 2021</time>
                  <strong>
                    Creating a Monorepo with Lerna & Yarn Workspaces
                  </strong>
                  <p>
                    In this guide, you will learn how to create a Monorepo to manage multiple packages with a shared build, test, and release process.
                  </p>
                </a>
              </>
            )
          })}
        </div>
      </main>
    </>
  )
}