'use strict';

/**
 * 
 * 出力
 * @const dispResultQz
 * @const dispTitleQz
 * @const displevelQz
 * @const dispQuestionQz
 * 
 * @const dispAnswersQz
 * 
 * Button
 * @const startBtnQz
 * @const restartBtnQz
 * 
 * @const dispStartBtnQz
 * @const dispRestartBtnQz
 * */ 

const dispResultQz = document.getElementById('display_result_quiz_message');
const dispNumQz = document.getElementById('display_quiz_number');
const dispTitleQz = document.getElementById('display_quiz_title');
const displevelQz = document.getElementById('display_quiz_level');
const dispQuestionQz = document.getElementById('display_quiz_question');

const dispAnswersQz = document.getElementById('display_quiz_answers');

const startBtnQz = document.getElementById('start_quiz_button');
const restartBtnQz = document.getElementById('restart_quiz_button');

const dispStartBtnQz = startBtnQz.style.display;
const dispRestartBtnQz = restartBtnQz.style.display;

class Quiz { 
    constructor() {
        this.questions = [];
        this.onesection = [];
        this.trueAnswer = '';
        this.correct = 0;
        this.incorrect = 0;
        this.questionId = 0;
    }
    startQz() {
        dispResultQz.innerHTML = '取得中';
        fetch('https://opentdb.com/api.php?amount=10')
            .then(response => response.json())
            .then(qzData => {
                this.questions = qzData.results;
                dispResultQz.innerHTML = '取得完了';
                this.dispQz(this.questions);
            }).catch(e => console.log(e));
    }
    dispQz(questions) {
        if (this.questions.length === 0) { 
            return
        }
        let i = this.questionId;
        let num = i + 1
        this.onesection = this.questions[i].incorrect_answers;
        this.trueAnswer = this.questions[i].correct_answer;
        this.onesection.push(this.trueAnswer);

        // ディスプレイ出力
        dispNumQz.innerHTML = `問題 : No. ${num}`;
        dispTitleQz.innerHTML = `出題 : ${this.questions[i].category}`;
        displevelQz.innerHTML = `難易度 : ${this.questions[i].difficulty}`;
        dispQuestionQz.innerHTML = this.questions[i].question;
        
        // this.onesectionの展開
        this.onesection.forEach(quiz => {
            const trQz = document.createElement('tr');
            const tdQz = document.createElement('td');
            const btnQz = document.createElement('button');
            btnQz.innerHTML = quiz;

            tdQz.appendChild(btnQz);
            trQz.appendChild(tdQz);
            dispAnswersQz.appendChild(trQz);

            this.checkQz(btnQz, this.onesection);
        })
    }
    checkQz(btnQz, onesection) {
        if (onesection.length === 0) { 
            return;
        }
        btnQz.addEventListener('click', () => {
            console.log(btnQz.innerHTML);
            btnQz.innerHTML === this.trueAnswer ? dispResultQz.innerHTML = `正解! 正解数: ${this.correct += 1}` : dispResultQz.innerHTML = `不正解!! 不正解数: ${this.incorrect += 1}`;
            this.questionId++;
            dispAnswersQz.innerHTML = '';
            this.questionId === 10 ? this.endQz(this.questions): this.dispQz(this.questions);
        })
    }
    endQz(questions) {
        if (!questions) { 
            return;
        } 
        dispResultQz.innerHTML = `あなたの正答数は、10問中、正解: ${this.correct} 不正解: ${this.incorrect}`;
        dispNumQz.innerHTML = '';
        dispTitleQz.innerHTML = '';
        displevelQz.innerHTML = '';
        dispQuestionQz.innerHTML = '';
        restartBtnQz.style.display = '';
        return;
    }
    restart() {     
        // 初期化
        dispResultQz.innerHTML = '';
        this.questions = [];
        this.onesection = [];
        this.trueAnswer = '';
        this.correct = 0;
        this.incorrect = 0;
        this.questionId = 0;
    }
}

const quiz = new Quiz();

startBtnQz.addEventListener('click', () => { 
    startBtnQz.style.display = 'none';
    quiz.startQz();
    quiz.dispQz();
})

restartBtnQz.addEventListener('click', () => {
    startBtnQz.style.display = dispStartBtnQz;
    restartBtnQz.style.display = dispRestartBtnQz;
    quiz.restart();
})
