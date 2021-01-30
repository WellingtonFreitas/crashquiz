/* eslint-disable react/prop-types */
import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Lottie } from '@crello/react-lottie';
import db from '../../../db.json';
import Widget from '../../components/Widget';
import QuizLogo from '../../components/QuizLogo';
import QuizBackground from '../../components/QuizBackground';
import QuizContainer from '../../components/QuizContainer';
import GitHubCorner from '../../components/GitHubCorner';
import AlternativesForm from '../../components/AlternativesForm';
import Button from '../../components/Button';
import BackLinkArrow from '../../components/BackLinkArrow';
import loadingAnimation from './animations/loading.json';

function ResultWidget({ results, externalQuestions, externalBg }) {
    const router = useRouter();
    const {
        query: { name },
    } = router
    var score = `${results.filter((x) => x).length}`;
    return (
        <Widget>
            <Widget.Header>
                {score < 5 ?
                    <p> {name} você fez {score} pontos, não desista, tente novamente.</p>
                    : <p> {name} você fez {score} pontos, parabéns</p>
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

            <Widget.Content style={{ display: 'flex', justifyContent: 'center' }}>
                <Lottie
                    width="200px"
                    height="200px"
                    className="lottie-container basic"
                    config={{ animationData: loadingAnimation, loop: true, autoplay: true }}
                />
            </Widget.Content>
        </Widget>
    );
}

function QuestionWidget({ question, questionIndex, totalQuestions, onSubmit, addResult }) {
    const router = useRouter();
    const [selectedAlternative, setSelectedAlternative] = React.useState(undefined);
    const [isQuestionSubmited, setIsQuestionSubmited] = React.useState(false);
    const questionId = `question__${questionIndex}`;
    const isCorrect = selectedAlternative === question.answer;
    const hasAlternativeSelected = selectedAlternative !== undefined;

    return (
        <Widget>
            <Widget.Header>
                <BackLinkArrow href="/" />
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

                    addResult(isCorrect);
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

export default function QuizPage({ externalQuestions, externalBg }) {
    const [screenState, setScreenState] = React.useState(screenStates.LOADING);
    const [results, setResults] = React.useState([]);
    const [currentQuestion, setCurrentQuestion] = React.useState(0);
    const questionIndex = currentQuestion;
    const question = externalQuestions[questionIndex];
    const totalQuestions = externalQuestions.length;
    const bg = externalBg;


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
        <QuizBackground backgroundImage={bg}>
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