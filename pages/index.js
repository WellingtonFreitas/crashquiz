import React from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import { useRouter } from 'next/router';

import db from '../db.json';
import Widget from '../src/Widget';
import QuizBackground from '../src/components/QuizBackground';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GitHubCorner';
import QuizLogo from '../src/components/QuizLogo';



export const QuizContainer = styled.div`
  width: 100%;
  max-width: 320px;
  padding-top: 45px;
  margin: auto 10%;
  margin-left:60%;
  margin-top: 11%;
  @media screen and (max-width: 780px){
    margin: auto;
    padding: 5%;
  }
  @media screen and (max-width: 500px){
    margin: auto;
    padding: 15%;
  }
`;

export default function Home() {

  const router = useRouter();
  const [name, setName] = React.useState('');

  return (
    <QuizBackground backgroundImage={db.bg}>
      <Head>
        <title> Crash Quiz</title>
      </Head>
      <QuizContainer>
        <QuizLogo />
        <Widget>
          <Widget.Header>
            <h1>{db.title}</h1>
          </Widget.Header>
          <Widget.Content>
            <p>{db.description}</p>
          </Widget.Content>
          <Widget.Content>
            <form onSubmit={infosDoevento => {
              infosDoevento.preventDefault();
              router.push(`/quiz?name=${name}`)
            }}>
              <input
                onChange={infosDoevento => {
                  setName(infosDoevento.target.value);
                }}
                placeholder="Digite seu nome">

              </input>
              <button type="submit" disabled={name.length === 0}>
                Iniciar como {name}
              </button>
            </form>
          </Widget.Content>
        </Widget>

        <Widget>
          <Widget.Content>
            <h1>Quizes da Galera</h1>

            <p>lorem ipsum dolor sit amet...</p>
          </Widget.Content>
        </Widget>
        <Footer />
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/WellingtonFreitas" />
    </QuizBackground>
  );
}
