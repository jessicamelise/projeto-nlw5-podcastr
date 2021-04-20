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

// SSG - só funciona em produção, deve gerar uma build do projeto
export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes');
  const data = await response.json();

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8 // atualizar a cada 8h
  }
}

export default function Home(props) {
  console.log(props.episodes)

  return (
    <p></p>
    // <p>{JSON.stringify(props.episodes)}</p>
  )
}
