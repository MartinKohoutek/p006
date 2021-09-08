document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const scoreDisplay = document.getElementById('score')
    const infoDisplay = document.getElementById('info')
    const width = 8
    const squares = []
    let score = 0

    const candyColors = [
        'url("images/red-candy.png")',
        'url("images/yellow-candy.png")',
        'url("images/orange-candy.png")',
        'url("images/purple-candy.png")',
        'url("images/green-candy.png")',
        'url("images/blue-candy.png")'
    ]

    const strippedColors = [
         'url("images/red-stripped.png")',
        'url("images/yellow-stripped.png")',
        'url("images/orange-stripped.png")',
        'url("images/purple-stripped.png")',
        'url("images/green-stripped.png")',
        'url("images/blue-stripped.png")'
    ]

    // Create Board
    function createBoard() {
        for (let i = 0; i < width*width; i++) {
            const square = document.createElement('div')
            square.setAttribute('draggable', true)
            square.setAttribute('id', i)
            let randomColor = Math.floor(Math.random() * candyColors.length)
            square.style.backgroundImage = candyColors[randomColor]
            grid.appendChild(square)
            squares.push(square)
        }
    }

    createBoard()

    // Drag the candies
    let colorBeingDragged
    let colorBeingReplaced
    let squareIdBeingDragged
    let squareIdBeingReplaced

    squares.forEach(square => square.addEventListener('dragstart', dragStart))
    squares.forEach(square => square.addEventListener('dragend', dragEnd))
    squares.forEach(square => square.addEventListener('dragover', dragOver))
    squares.forEach(square => square.addEventListener('dragenter', dragEnter))
    squares.forEach(square => square.addEventListener('dragleave', dragLeave))
    squares.forEach(square => square.addEventListener('drop', dragDrop))

    function dragStart() {
        colorBeingDragged = this.style.backgroundImage
        squareIdBeingDragged = parseInt(this.id)       
    }

    function dragOver(e) {
        e.preventDefault()        
    }

    function dragEnter() {        
    }

    function dragLeave() {        
    }

    function dragEnd() {
        
        let validMoves = [squareIdBeingDragged - 1, 
            squareIdBeingDragged - width, 
            squareIdBeingDragged + 1,
             squareIdBeingDragged + width]
        let validMove = validMoves.includes(squareIdBeingReplaced)
        
        if (squareIdBeingReplaced && validMove) {
            squareIdBeingReplaced = null                    
        } else if (squareIdBeingReplaced && !validMove) {
            squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged                       
        } else {
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged            
        }
    }     

    function dragDrop() {        
        colorBeingReplaced = this.style.backgroundImage
        squareIdBeingReplaced = parseInt(this.id)        

        if ((strippedColors.indexOf(colorBeingReplaced) >= 0) && (strippedColors.indexOf(colorBeingReplaced) == candyColors.indexOf(colorBeingDragged))
          || ((strippedColors.indexOf(colorBeingDragged) >= 0) && (strippedColors.indexOf(colorBeingDragged) == candyColors.indexOf(colorBeingReplaced)))) {
            let color = ""
            if (strippedColors.indexOf(colorBeingDragged) >=0) { 
              color = strippedColors.indexOf(colorBeingDragged)               
            }
            else {
              color = strippedColors.indexOf(colorBeingReplaced)
            }
            colorBeingDragged = ""
            colorBeingReplaced = ""
            
            let start = Math.floor(squareIdBeingReplaced / 8)*8;                       
            for (i=start; i<=start+7; i++) {                            
              squares[i].style.backgroundImage = ""              
            }          
            score += 100
            scoreDisplay.innerHTML = score
            infoDisplay.innerHTML = "Stripped!!!"
            playSound()
        }

        this.style.backgroundImage = colorBeingDragged
        squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced
    }

    //drop candies once some have been cleared
    function moveDown() {
        for (i = 0; i <= 55; i++) {
            if (squares[i + width].style.backgroundImage === '') {             
                squares[i + width].style.backgroundImage = squares[i].style.backgroundImage
                squares[i].style.backgroundImage = ''

                const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
                const isFirstRow = firstRow.includes(i)
                if (isFirstRow && squares[i].style.backgroundImage === '') {
                    let randomColor = Math.floor(Math.random() * candyColors.length)
                    squares[i].style.backgroundImage = candyColors[randomColor]
                    
                }
            }
        }
        
    }

    function playSound() {
      if (document.getElementById('audio').currentTime !== 0 && 
              (document.getElementById('audio').currentTime > 0 && document.getElementById('audio').currentTime < document.getElementById('audio').duration)) {
                document.getElementById('audio').currentTime = 0;
            }
            document.getElementById('audio').play();
    }

    // Checking for matches   

    function checkRowForFive() {
      for (i = 0; i <= 59; i ++) {
          
        let rowOfFive = [i, i+1, i+2, i+3, i+4]
        let decidedColor = squares[i].style.backgroundImage
        const isBlank = squares[i].style.backgroundImage === ''
  
        const notValid = [4, 5, 6, 7, 12, 13, 14, 15, 20, 21, 22, 23, 28, 29, 30, 31, 36, 37, 38, 39, 44, 45, 46, 47, 52, 53, 54, 55]
        if (notValid.includes(i)) { continue }
        
        if(rowOfFive.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {            
          playSound() 
          score += 50
          scoreDisplay.innerHTML = score
          infoDisplay.innerHTML = "Row of Five"
          rowOfFive.forEach(index => { squares[index].style.backgroundImage = ''})
        }
      }
    }
    checkRowForFive()

    //check for row of Four
    function checkRowForFour() {
        for (i = 0; i < 61; i ++) {
            
          let rowOfFour = [i, i+1, i+2, i+3]
          let decidedColor = squares[i].style.backgroundImage
          const isBlank = squares[i].style.backgroundImage === ''
    
          const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55]
          if (notValid.includes(i)) continue
          
          if(rowOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {        
            playSound() 
            score += 10
            scoreDisplay.innerHTML = score
            infoDisplay.innerHTML = "Row of Four"            
            rowOfFour.forEach(index => { squares[index].style.backgroundImage = '' })
            squares[i].style.backgroundImage = strippedColors[candyColors.indexOf(decidedColor)]
          }
        }
      }
      checkRowForFour()

      function checkColumnForFive() {
        for (i = 0; i <= 31; i ++) {
            
          let columnOfFive = [i, i+width, i+width*2, i+width*3, i+width*4]
          let decidedColor = squares[i].style.backgroundImage
          const isBlank = squares[i].style.backgroundImage === ''
    
             
          if(columnOfFive.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
            playSound()
            score += 50   
            scoreDisplay.innerHTML = score  
            infoDisplay.innerHTML = "Column of Five" 
            columnOfFive.forEach(index => {
            squares[index].style.backgroundImage = ''          
            })
          }
        }
      }
      checkColumnForFive()

      //check for column of Four
      function checkColumnForFour() {
        for (i = 0; i <= 39; i ++) {
            
          let columnOfFour = [i, i+width, i+width*2, i+width*3]
          let decidedColor = squares[i].style.backgroundImage
          const isBlank = squares[i].style.backgroundImage === ''
    
             
          if(columnOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
            playSound()
            score += 10
            scoreDisplay.innerHTML = score   
            infoDisplay.innerHTML = "Column of Four"
            columnOfFour.forEach(index => {
              squares[index].style.backgroundImage = ''
            })
          }
        }
      }
      checkColumnForFour()

    //check for row of Three
    function checkRowForThree() {
        for (i = 0; i < 62; i ++) {
            
          let rowOfThree = [i, i+1, i+2]
          let decidedColor = squares[i].style.backgroundImage
          const isBlank = squares[i].style.backgroundImage === ''
    
          const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55]
          if (notValid.includes(i)) continue
          
          if(rowOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
            playSound()
            score += 3 
            infoDisplay.innerHTML = "Row Of Three"
            scoreDisplay.innerHTML = score     
            rowOfThree.forEach(index => {
            squares[index].style.backgroundImage = ''
            })
          }
        }
      }
      checkRowForThree()

      //check for column of Three
    function checkColumnForThree() {
        for (i = 0; i <= 47; i ++) {
            
          let columnOfThree = [i, i+width, i+width*2]
          let decidedColor = squares[i].style.backgroundImage
          const isBlank = squares[i].style.backgroundImage === ''
                 
          if(columnOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
            playSound()
            
            score += 3     
            scoreDisplay.innerHTML = score   
            infoDisplay.innerHTML = "Column of Three" 
            columnOfThree.forEach(index => {
              squares[index].style.backgroundImage = ''              
            })
          }
        }
      }
      checkColumnForThree()

      window.setInterval(function() {
          // infoDisplay.innerHTML = ""
          moveDown()
          checkRowForFive()
          checkColumnForFive()
          checkRowForFour()
          checkColumnForFour()
          checkRowForThree()
          checkColumnForThree()
      }, 100)
})