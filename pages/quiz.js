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


function ResultWidget({ results }) {
    const router = useRouter();
    const {
        query: { name },
    } = router
    var score = `${results.filter((x) => x).length}`;
    return (
        <Widget>
            <Widget.Header>
                {score < 5 ?
                    <p> {name} você ganhou {score} cristais, não desista, tente novamente.</p>
                    : <p> {name} você ganhou {score} cristais, parabéns</p>
                    
                }
            </Widget.Header>

            <Widget.Content>
                <form onSubmit={function (event) {
                    event.preventDefault();
                    router.push('/');
                }} >
                    {score < 5 ?
                        <img alt="Descricao"
                            style={{
                                width: '100%',
                                height: '250px',
                                objectFit: 'cover'
                            }}
                            src={db.resultsImage.low}
                        />
                        : <img alt="Descricao"
                            style={{
                                width: '100%',
                                height: '250px',
                                objectFit: 'cover'
                            }}
                            src={db.resultsImage.max}
                        />
                    }
                    <Button type="submit">Voltar</Button>
                </form>
            </Widget.Content>
        </Widget>
    );
}

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

function QuestionWidget({ question, questionIndex, totalQuestions, onSubmit, addResult }) {
    const router = useRouter();
    const [selectedAlternative, setSelectedAlternative] = React.useState(undefined);
    const [isQuestionSubmited, setIsQuestionSubmited] = React.useState(false);
    const questionId = `question__${questionIndex}`;
    const isCorect = selectedAlternative === question.answer;
    const hasAlternativeSelected = selectedAlternative !== undefined;

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
                    setIsQuestionSubmited(true);

                    addResult(isCorect);
                    onSubmit();
                    setIsQuestionSubmited(false);
                    setSelectedAlternative(undefined);  

                }} >
                    {question.alternatives.map((alternative, alternativeIndex) => {
                        const alternativeId = `alternative__${alternativeIndex}`;
                        return (
                            // eslint-disable-next-line react/jsx-key
                            <Widget.Topic as="label" key={alternative} htmlFor={alternativeId}>

                                <input
                                    id={alternativeId}
                                    name={questionId}
                                    //style={{ display: 'none' }}
                                    onChange={() => setSelectedAlternative(alternativeIndex)}
                                    type="radio"

                                />
                                {alternative}
                            </Widget.Topic>
                        );
                    })}
                    <Button type="submit" disabled={!hasAlternativeSelected}>
                        Confirmar
                    </Button>

                    <Button type="button" onClick={function (event) {
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
    const [results, setResults] = React.useState([]);
    const totalQuestions = db.questions.length;
    const [currentQuestion, setCurrentQuestion] = React.useState(0);
    const questionIndex = currentQuestion;
    const question = db.questions[questionIndex];
    const router = useRouter();

    function addResult(result) {
        setResults([
            ...results,
            result
        ]);
    };

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
                        addResult={addResult}
                    />
                )}
                {screenState === screenStates.LOADING && <LoadingWidget />}

                {screenState === screenStates.RESULT && <ResultWidget results={results} />}

            </QuizContainer>
            <GitHubCorner projectUrl="https://github.com/WellingtonFreitas" />
        </QuizBackground>
    );
}