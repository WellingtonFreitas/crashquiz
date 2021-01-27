/* eslint-disable react/prop-types */
import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { useRouter } from 'next/router';

import db from '../db.json';
import Widget from '../src/Widget';
import QuizBackground from '../src/components/QuizBackground';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GitHubCorner';
import QuizLogo from '../src/components/QuizLogo';
import QuizContainer from '../src/components/QuizContainer';
import Button from '../src/components/Button';




function LoadingWidget() {
    return (
        <Widget>
            <Widget.Header>
                Carregando...
        </Widget.Header>

            <Widget.Content>
                Aguarde carregando perguntas...
        </Widget.Content>
        </Widget>
    );
}

function QuestionWidget({ question, questionIndex, totalQuestions, onSubmit }) {
    const questionId = `question__${questionIndex}`;
    const router = useRouter();
    return (
        <Widget>
            <Widget.Header>
                <h3> {`Pergunta ${questionIndex + 1} de ${totalQuestions}`}</h3>
            </Widget.Header>
            <img alt="Descricao"
                style={{
                    width: '100%',
                    height: '250px',
                    objectFit: 'cover',

                }}
                src={question.image}
            />
            <Widget.Content>
                <h2>
                    {question.title}
                </h2>
                <p>
                    {question.description}
                </p>

                <form onSubmit={(infosDoEvento) => {
                    infosDoEvento.preventDefault();
                    onSubmit();
                }} >
                    {question.alternatives.map((alternative, alternativeIndex) => {
                        const alternativeId = `alternative__${alternativeIndex}`;
                        return (
                            // eslint-disable-next-line react/jsx-key
                            <Widget.Topic as="label" htmlFor={alternativeId}>

                                <input id={questionId}
                                    style={{ display: 'none' }}
                                    type="radio"
                                />
                                {alternative}
                            </Widget.Topic>
                        );
                    })}
                    <Button type="submit">
                        Confirmar
                    </Button>

                    <Button onClick={function (event) {
                        event.preventDefault();
                        router.push('/');
                    }} style={{ backgroundColor: '#dd2c00' }}>
                        Desistir
                    </Button>

                </form>

            </Widget.Content>

        </Widget>
    )
};


const screenStates = {
    QUIZ: 'QUIZ',
    LOADING: 'LOADING',
    RESULT: 'RESULT',
}

export default function QuizPage() {
    const [screenState, setScreenState] = React.useState(screenStates.LOADING);
    const totalQuestions = db.questions.length;
    const [currentQuestion, setCurrentQuestion] = React.useState(0);
    const questionIndex = currentQuestion;
    const question = db.questions[questionIndex];
    const router = useRouter();

    React.useEffect(() => {
        setTimeout(() => {
            setScreenState(screenStates.QUIZ);
        }, 1 * 1000);
    }, []);

    function handleSubmitQuiz() {
        const nextQuestion = questionIndex + 1;
        if (nextQuestion < totalQuestions) {
            setCurrentQuestion(nextQuestion);
        } else {
            setScreenState(screenStates.RESULT);
        }
    }

    return (
        <QuizBackground backgroundImage={db.bg}>
            <Head>
                <title> Crash Quiz</title>
            </Head>
            <QuizContainer>
                <QuizLogo />

                {screenState === screenStates.QUIZ && (
                    <QuestionWidget
                        question={question}
                        questionIndex={questionIndex}
                        totalQuestions={totalQuestions}
                        onSubmit={handleSubmitQuiz}
                    />
                )}
                {screenState === screenStates.LOADING && <LoadingWidget />}

                {screenState === screenStates.RESULT && <Widget>
                    <Widget.Header> voçê ganhou x cristais, parabéns!</Widget.Header>
            <Widget.Content>
                        <form onSubmit={function (event) {
                            event.preventDefault();
                            router.push('/');
                        }} >
                            <Button type="submit">Voltar</Button>
                        </form>
            </Widget.Content>
                </Widget>}

            </QuizContainer>
            <GitHubCorner projectUrl="https://github.com/WellingtonFreitas" />
        </QuizBackground>
    );
}