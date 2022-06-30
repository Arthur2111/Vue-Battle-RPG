//we can define a regular funtion if we call this funtion inside the js code only (not be called inside html or not use vue controls( data computed etc))
function getRandomValue(min,max) {
    return Math.floor(Math.random() * (max-min)) + min
}


const app = Vue.createApp({
    data() {
        return {
            playerHealth : 100, 
            monsterHealth : 100,
            currentRound: 0 , //this will not be a regular js as we need this to be accessed by vue 
            winner: null, //null is false
            battleLog: [],
            log: ''

        }
    },
    watch: {
        //we add a watcher to determine win lose scenario
        playerHealth(value) {
            if (value <= 0 && this.monsterHealth <= 0) {
                //draw
                this.winner = 'draw'
            } else if (value <= 0 ) {
                this.winner = 'monster'
            }
        },
        monsterHealth(value) {
            if (value <= 0 && this.playerHealth <= 0) {
                this.winner = 'draw'
            }   else if ( value <= 0 ) {
                this.winner = 'player'
            }
        }
    },
    computed: {
        monsterBarStyles() {
            if ( this.monsterHealth < 0 ) {
                return { width:  '0%'}
            } else {
                return {width: this.monsterHealth + '%'}
            }
            
        },
        playerBarStyles() {
            if (this.playerHealth <0 ) {
                return {width : '0%'}
            } else {
                return {width: this.playerHealth + '%'}
            }
        },
        mayUseSpecialAttack() {
            return this.currentRound % 3 !== 0
        }
    },
    methods: {
        startGame () {
            this.playerHealth= 100, 
            this.monsterHealth= 100,
            this.currentRound= 0 ,
            this.winner= null,
            this.battleLog= []
        },
        attackMonster() {
            this.currentRound ++
            //this will return a value between 12 and 5 randomly and math.floor will round down the floats
            const attackValue = getRandomValue(5,12)
            //this.monsterHealth = this.monsterHealth - attackValue
            this.monsterHealth -= attackValue
            this.addLogMessage('player', 'attack',attackValue)
            this.attackPlayer() //we can also access methods inside the this keyword
            // attack player will be called after attack monster
            //maybe attach attackPlayerSpecial and wrap in an if function
            
        },
        attackPlayer() {
            const attackValue = getRandomValue(8,15)
            this.playerHealth -= attackValue
            this.addLogMessage('monster', 'attack',attackValue)
        },
        //special attack should only come in after 3 rounds and deal more damage
        specialAttackMonster() {
            this.currentRound ++
            const specialAttackValue = getRandomValue(10,25) 
            this.monsterHealth -= specialAttackValue
            this.addLogMessage('player', 'Special - Attack ',specialAttackValue)
            this.attackPlayer()
        },
        healPlayer() {
            const healValue = getRandomValue(8,18)
            this.currentRound ++
            //remember we cannot go above 100 hence we do an if statement
            if(this.playerHealth + healValue > 100) {
                this.playerHealth = 100
            } else {
                this.playerHealth += healValue
            }
            this.addLogMessage('player', 'heal',healValue)
            this.attackPlayer()
        },
        surrender () {
            this.winner = 'monster'

        },
        addLogMessage (who, what, value) {
            this.battleLog.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value
            })
        }
    }

})

app.mount('#game')