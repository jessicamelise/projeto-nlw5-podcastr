import { GetStaticProps } from 'next';
import { api } from '../services/api';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import styles from './home.module.scss';
import Image from 'next/image';
import Link from 'next/link';

// import { useEffect, useState } from "react"

// export default function Home() {
//   SPA
//   const [spa, setSpa] = useState('');
//   useEffect(() => {
//     fetch('http://localhost:3333/episodes')
//     .then(response => response.json())
//     .then(data => setSpa(JSON.stringify(data)))
//     // console.log(data)
//   }, []);

//   return (
//     <p>{spa}</p>

//   )
// }

// SSR
// export async function getServerSideProps() {
//   const response = await fetch('http://localhost:3333/episodes');
//   const data = await response.json();

//   return {
//     props: {
//       episodes: data,
//     }
//   }
// }

// export default function Home(props) {
//   console.log(props.episodes)

//   return (
//     <p>{JSON.stringify(props.episodes)}</p>
//   )
// }

// interface ou type
type Episode = {
  id: string,
  title: string,
  members: string,
  publishedAt: string,
  thumbnail: string,
  // description: string,
  duration: number,
  durationAsString: string,
  url: string,
}
type HomeProps = {
  latestEpisodes: Array<Episode> // ou Episode[]
  allEpisodes: Array<Episode> // ou Episode[]
}
// SSG - só funciona em produção, deve gerar uma build do projeto
export const getStaticProps: GetStaticProps =  async () => {
  // const response = await fetch('http://localhost:3333/episodes?_limit=12&_sort=published_at&_order=desc');
  // const data = await response.json();
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    }
  });

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      thumbnail: episode.thumbnail,
      // description: episode.description,
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,
    }
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8 // atualizar a cada 8h
  }
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map(episode=> {
            return (
              <li key={episode.id}>
                {/* <Image 
                  width={192} 
                  height={192} 
                  src={episode.thumbnail} 
                  alt={episode.title}
                  objectFit="cover" 
                /> */}
                <img src={episode.thumbnail} alt={episode.title}/>
                <div className={styles.episodeDetails}>
                  <Link href={`/episode/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>
                <button type="button">
                  <img src="/play-green.svg" alt="Tocar episódio"/>
                </button>
              </li>
            )
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos os episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map(episode => {
              return (
                <tr key={episode.id}>
                  <td style={{width: 72}}>
                    {/* <Image width={120} height={120} src={episode.thumbnail} alt={episode.title} objectFit="cover"/> */}
                    <img src={episode.thumbnail} alt={episode.title} />
                  </td>
                  <td>
                    <Link href={`/episode/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{width: 100}}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button">
                      <img src="/play-green.svg" alt="Tocar episódio"/>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
      {/* tratar informação direto na exibição não é bom pois em cada requisição será feito essa 
      formatação de novo e de novo, para isso faz direto na requisição */}
      {/* <p>{ new Date(props.episodes[0].published_at)}</p> */}

    </div>
    // <p>{JSON.stringify(props.episodes)}</p>
  )
}
