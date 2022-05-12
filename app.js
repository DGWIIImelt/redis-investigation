import { createClient } from 'redis';
import axios from 'axios';
import testArticles from './testData/articlesSome.js';

async function nodeRedisDemo () {
  // hitting Intercom API
  // let articles = await axios.get(
  //   // `https://api.intercom.io/articles?per_page=250`, //shotgun all of our articles 
  //   // `https://api.intercom.io/articles?page=2`, // paginate, defaults to 25 results / page
  //   // `https://api.intercom.io/articles/6110474`, // specific article, accepts only ids
  //   `https://api.intercom.io/articles`, // returns first page, defaults to 25 results / page
  //   {
  //     headers: {
  //       authorization: "Bearer dG9rOmI2YWE3YzQ3X2Y5M2NfNDBmZV85YjM5XzE4MjMzNDhjODZkZjoxOjA="
  //     }
  //   })
  //   .then((response) => {
  //     return massageData(response.data.data);
  //   })
  //   .catch((error) => {
  //     console.log('INTERCOM ERROR!!! ', error)
  //     return;
  //   });

  // testing data, captured from intercom
  let articles = massageData(testArticles.testArticles.data);

  try {
    const client = createClient();
    await client.connect();

    articles.forEach( async(article) => {
      await client.set(article.title, JSON.stringify(article)); // not sure what shenanigans stringifying it 
    });

    await client.quit();
  } catch (e) {
    console.error(e);
  }
}

function massageData(data){
  return data
    .filter((article) => article.state != "draft")
    .map((article) => {
      return {
        title: article.title, // will be english title
        ...article.translated_content // includes translations [title, description, body], also has type as an attribute
      }
    });
}

nodeRedisDemo();