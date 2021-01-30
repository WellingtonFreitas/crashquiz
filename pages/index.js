import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

import db from '../db.json';
import Widget from '../src/components/Widget';
import QuizBackground from '../src/components/QuizBackground';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GitHubCorner';
import QuizLogo from '../src/components/QuizLogo';
import Input from '../src/components/Input';
import Button from '../src/components/Button';
import QuizContainer from '../src/components/QuizContainer'; 
import Link from '../src/components/Link';


export default function Home() {

  const router = useRouter();
  const [name, setName] = React.useState('');

  return (
    <QuizBackground backgroundImage={db.bg}> 
      <Head>
        <title> Crash Quiz</title>
      </Head>
      <QuizContainer>
        <Widget
          as={motion.section}
          transition={{ delay: 0, duration: 1.5 }}
          variants={{
            show: { opacity: 1, y: '0' },
            hidden: { opacity: 0, y: '100%' },
          }}
          initial="hidden"
          animate="show"
        >
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
              <Input
                name="userName"
                onChange={infosDoevento => { setName(infosDoevento.target.value); }}
                placeholder="Digite seu nome para iniciar">

              </Input>
              <Button type="submit" disabled={name.length === 0}>
                {`Iniciar como ${name}`}
              </Button>
            </form>
          </Widget.Content>
        </Widget>

        <Widget
          as={motion.section}
          transition={{ delay: 0.5, duration: 1 }}
          variants={{
            show: { opacity: 1 },
            hidden: { opacity: 0 },
          }}
          initial="hidden"
          animate="show"
        >
          <Widget.Content>
            <h1>Galeria de Quizes</h1>

            <ul>
              {db.external.map((linkExterno) => {
                const [projectName, githubUser] = linkExterno
                  .replace(/\//g, '')
                  .replace('https:', '')
                  .replace('.vercel.app', '')
                  .split('.');

                return (
                  // eslint-disable-next-line react/jsx-key
                  <li key={linkExterno}>
                    <Widget.Topic as={Link} href={`/quiz/${projectName}___${githubUser}`}>
                      {`${projectName} - ${githubUser}`}
                    </Widget.Topic>
                  </li>
                );
              })}
            </ul>

          </Widget.Content>
        </Widget>
        <Footer
          as={motion.footer}
          transition={{ delay: 1, duration: 1.5 }}
          variants={{
            show: { opacity: 1 },
            hidden: { opacity: 0 },
          }}
          initial="hidden"
          animate="show"
        />
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/WellingtonFreitas" />
    </QuizBackground>
  );
}
