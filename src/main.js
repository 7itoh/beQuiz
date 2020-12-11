'use strict';

/**
 * Quiz App
 * 
 * 出力
 * @const dispResultQz      Quiz出力結果の表示
 * @const dispTitleQz       Quizタイトルの表示
 * @const displevelQz       Quiz難易度の表示
 * @const dispQuestionQz    Quiz問題の表示
 * 
 * @const dispAnswersQz     Quiz回答リストの表示
 * 
 * Button
 * @const startBtnQz        Quizの開始ボタン
 * @const restartBtnQz      Quizの再開ボタン
 * 
 * @const dispStartBtnQz    Quiz開始ボタンの再表示
 * @const dispRestartBtnQz  Quiz再開ボタンの再非表示
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
                this.dispQz();
            }).catch(e => console.log(e));
    }
    dispQz() {
        if (!this.questions.length) { 
            return
        }
        let id = this.questionId;
        let num = id + 1
        let qzSection = this.questions[id].incorrect_answers;
        let qzTrue = this.questions[id].correct_answer;

        this.onesection = qzSection;
        this.trueAnswer = qzTrue;
        this.onesection.push(this.trueAnswer);
        // 答えシャッフルの実行
        this.shuffle(this.onesection);

        // ディスプレイ出力
        let qzCategory = this.questions[id].category;
        let qzDifficult = this.questions[id].difficulty;
        let qzQuestion = this.questions[id].question;

        dispNumQz.innerHTML = `問題 : No. ${num}`;
        dispTitleQz.innerHTML = `出題 : ${qzCategory}`;
        displevelQz.innerHTML = `難易度 : ${qzDifficult}`;
        dispQuestionQz.innerHTML = qzQuestion
        
        // this.onesectionの展開
        this.onesection.forEach(quiz => {
            const trQz = document.createElement('tr');
            const tdQz = document.createElement('td');
            const btnQz = document.createElement('button');
            btnQz.innerHTML = quiz;

            tdQz.appendChild(btnQz);
            trQz.appendChild(tdQz);
            dispAnswersQz.appendChild(trQz);

            this.checkQz(btnQz);
        })
    }
    shuffle([...onsection]) {
        for (let i = onsection.length - 1; i >= 0; i--) { 
            const j = Math.floor(Math.random() * (i + 1));
            [onsection[i], onsection[j]] = [onsection[j], onsection[i]];
        }
        return this.onesection = onsection;
    }
    checkQz(btnQz) {
        if (!this.onesection.length) { 
            return;
        }
        btnQz.addEventListener('click', () => {
            btnQz.innerHTML === this.trueAnswer ? dispResultQz.innerHTML = `正解! 正解数: ${this.correct += 1}` : dispResultQz.innerHTML = `不正解!! 不正解数: ${this.incorrect += 1}`;
            this.questionId++;
            dispAnswersQz.innerHTML = '';
            this.questionId === 10 ? this.endQz(): this.dispQz();
        })
    }
    endQz() {
        dispResultQz.innerHTML = `あなたの正答数は、10問中、正解: ${this.correct} 不正解: ${this.incorrect}`;
        dispNumQz.innerHTML = '';
        dispTitleQz.innerHTML = '';
        displevelQz.innerHTML = '';
        dispQuestionQz.innerHTML = '';
        restartBtnQz.style.display = '';
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
})

restartBtnQz.addEventListener('click', () => {
    startBtnQz.style.display = dispStartBtnQz;
    restartBtnQz.style.display = dispRestartBtnQz;
    quiz.restart();
})
