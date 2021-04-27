import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from './episode.module.scss';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { usePlayer } from '../../contexts/PlayerContext';
// import { useRouter } from 'next/router';

type Episode = {
  id: string,
  title: string,
  members: string,
  publishedAt: string,
  thumbnail: string,
  description: string,
  duration: number,
  durationAsString: string,
  url: string,
}

type EpisodeProps = {
  episode: Episode,
}

export default function Episode({ episode }: EpisodeProps) {
  // isso serve para quando estiver fallback true
  // const router = useRouter();

  // if(router.isFallback) {
  //   return(
  //     <p>Carregando...</p>
  //   )
  // }
  const { play } = usePlayer();

  return (
    <div className={styles.episode}>
      <Head>
        <title>{episode.title} | Podcastr</title>
      </Head>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image width={700} height={160} src={episode.thumbnail} alt={episode.title} objectFit="cover" />
        <button type="button" onClick={()=>play(episode)}>
          <img src="/play.svg" alt="Tocar episódio" />
        </button>
      </div>
      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>
      <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description }}></div>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;
  // const { data } = await api.get(`/episodes/${slug}`);
  const data = api.episodes;

  let episode;

  data.map(item => {
    if (item.id == slug) {
      episode = {
        id: item.id,
        title: item.title,
        members: item.members,
        publishedAt: format(parseISO(item.published_at), 'd MMM yy', { locale: ptBR }),
        thumbnail: item.thumbnail,
        description: item.description,
        duration: Number(item.file.duration),
        durationAsString: convertDurationToTimeString(Number(item.file.duration)),
        url: item.file.url,
      }
    }
  })


  return {
    props: { episode },
    revalidate: 60 * 60 * 24 // 24horas
  }
}