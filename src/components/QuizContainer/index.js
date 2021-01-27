import styled from 'styled-components';


const QuizContainer = styled.div`
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

export default QuizContainer;