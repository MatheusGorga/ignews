import Head from 'next/head'
import styles from './styles.module.scss'
import { GetStaticProps } from "next";
import { getPrismicClient } from '../../services/prismic';
import * as Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom'
import Link from 'next/link';

type post = {
  slug: string,
  title: string,
  excerpt: string,
  updatedAt: string,
}
interface PostProps {
  posts: post[]
}


export default function Posts({ posts }: PostProps) {
  return (
    <>
      <Head>
        <title>Post | Ignews</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (

            <Link  href={`/posts/${post.slug}`} key={post.slug}>
             <a href="#" key={post.slug} >
              <time>{post.updatedAt}</time>
              <strong>
                {post.title}
              </strong>
              <p>
                {post.excerpt}
              </p>
            </a>
            </Link>

          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()
  const postsPrismic = await prismic.getByType("post", {
    pageSize: 100,
  });

  const posts = postsPrismic.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-Br', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  })



  return {
    props: {
      posts
    }
  }
}