class Game {
    constructor(Tiles, msgBox) {
        this.gameMode = document.getElementById("mode").value
        this.Tiles = Tiles
        this.msgBox = msgBox
        this.currPlayer = "1"
        this.currMarker = "X"
        this.gameGrid = [" ", " ", " ", " ", " ", " ", " ", " ", " "]
        this.winConditions = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6] ]
        this.gameEnabled = false
    }

    toggleGame() {
        // Hide or show play button
        if (this.gameEnabled === false) { 
            document.getElementById("play").style.visibility = "hidden"
            document.getElementById("mode").style.visibility = "hidden"
        }
        else {
            document.getElementById("play").style.visibility = "visible"
            document.getElementById("mode").style.visibility = "visible"
        }

        // Enable or disable each button
        Tiles.forEach(button => {
            button.disabled = this.gameEnabled
        })

        // Enable or disable each button's cursor
        for (var i = 0; i < 9; i++) {
            if (this.gameEnabled === false) {
                document.getElementById(i.toString()).style.cursor = "pointer"
            }
            else {
                document.getElementById(i.toString()).style.cursor = "not-allowed"
            }
        }

        this.gameEnabled = !this.gameEnabled
    }

    resetGame() {
        this.gameMode = document.getElementById("mode").value

        for (var i = 0; i < 9; i++) {
            this.gameGrid[i] = " "
            this.Tiles.item(i).innerText = this.gameGrid[i]
        }

        this.setMessageBox("Player 1, choose a square! (X)")
        this.currMarker = "X"
        this.currPlayer = "1"
    }

    changeTurn() {
        if (this.currPlayer === "1") {
            this.currPlayer = "2"
            this.currMarker = "O"
        }
        else {
            this.currPlayer = "1"
            this.currMarker = "X"
        }
    }

    getRandomTile() {
        var isValid = false
        while (!isValid) {
            var rand = Math.floor(Math.random() * Math.floor(9))
            if (this.gameGrid[rand] === " ") isValid = true
        }
        return rand
    }

    makeTurn(tile) {
        if (this.gameGrid[tile] !== " ") return
        this.gameGrid[tile] = this.currMarker
        if (this.checkForWin() !== true && this.checkForDraw() !== true ) this.changeTurn()

        if (this.gameMode === "pvc" && this.gameEnabled === true) {
            this.gameGrid[this.getRandomTile()] = this.currMarker
            this.changeTurn()
        }
    }

    checkForWin() {
        if (this.gameEnabled === false) return
        for (var i = 0; i < 8; i++) {
            if (this.gameGrid[this.winConditions[i][0]] === this.currMarker && this.gameGrid[this.winConditions[i][1]] === this.currMarker && this.gameGrid[this.winConditions[i][2]] === this.currMarker) {
                this.toggleGame()
                this.setMessageBox("Player " + this.currPlayer + " has won!")
                return true
            }
        }
        return false
    }

    checkForDraw() {
        if (this.gameEnabled === false) return
        for (var i = 0; i < 9; i++) {
            if (this.gameGrid[i] === " ") return false
        }
        this.toggleGame()
        this.setMessageBox("There has been a draw!")
        return true
    }

    setMessageBox(msg) {
        this.msgBox.innerText = msg
    }

    updateDisplay() {
        if (this.gameEnabled !== false) this.setMessageBox("Player " + this.currPlayer + ", choose a square! (" + this.currMarker + ")")
        for (var i = 0; i < 9; i++) {
            this.Tiles.item(i).innerText = this.gameGrid[i]
        }
    }
}

const Tiles = document.querySelectorAll('[data-tile]')
const Play = document.querySelector('[data-play]')
const Mode = document.querySelector('[data-mode]')
var msgBox = document.getElementById("hintBox")

const T3 = new Game(Tiles, msgBox)

Play.addEventListener('click', () => {
    T3.resetGame()
    T3.toggleGame()
})

Tiles.forEach(button => {
    button.addEventListener('click', () => {
        T3.makeTurn(parseInt(button.id))
        T3.updateDisplay()
    })
})
