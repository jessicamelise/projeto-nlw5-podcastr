// import axios from 'axios';

// export const api = axios.create({
//   baseURL: 'http://localhost:3333/',
// });


export const api = async () => {
  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/server.json"
      : `projeto-nlw5-podcastr-4u05et710-jessicamelise.vercel.app/server.json`

  const response = await fetch(url);
  const data = await response.json();
  return data.episodes;
}

