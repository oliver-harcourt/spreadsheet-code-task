let cellState = []
const gridSize = 100
const tableBody = document.getElementById("sheet")

// creates initial grid matrix based on gridSize
const generateGrid = (n) => {
  let grid = []
  for (let i = 0; i <= n; i++) {
    let row = []
    for (let j = 0; j <= n; j++) {
      let cell = {
        value: "",
        formula: "",
        rowCoord: i,
        colCoord: j
      }
      row.push(cell)
    }
    grid.push(row)
  }
  return grid
}

// checks forumala string and returns operators in an array
const isOperator = (inputStr) => {
  let operatorArr = inputStr.filter(str => {
    if (str === "+") return true
    if (str === "-") return true
    if (str === "*") return true
    if (str === "/") return true
  })
  return operatorArr
}

// calls creates string from coords and operators to pass to calculate
const cellValuesToFormulaStr = (coordsArr, operatorsArr) => {
  let formulaStr = ""
  let cellValuesArr = coordsArr.map(coord => {
    return cellState[coord.row][coord.col].value
  })
  operatorsArr.forEach((operator, i) => {
    formulaStr += cellValuesArr[i] + operator
  })
  formulaStr = formulaStr.concat(cellValuesArr.pop())
  return formulaStr
}

// function to parse coordinates from input value
const coordFinder = (inputCharArray, operators) => {
  let charArr = []
  let i
  let k

  for (i = 0, k = -1; i < inputCharArray.length; i++) {
    if((i + 1) >= inputCharArray.length){
      charArr[k].push(inputCharArray[i])
      charArr[k].pop()
    } else if (operators.indexOf(inputCharArray[i + 1]) !== 0) {
      k++;
      charArr[k] = [];
    } 
    charArr[k].push(inputCharArray[i])
  }
  let coordArr = charArr.filter(chars => {
    return chars.length == 2
  })

  return coordArr
}

// formatter to convert alphabetic label to column index
const inputValueToFormulaConverter = (inputValue) => {
  let charArray = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  let formula = inputValue.substring(1)
  let inputStrArr = formula.split('')
  let operatorArr = isOperator(inputStrArr)

  // currently working on getting coords into an array so I can operate on more than one cell
  let coordArr = coordFinder(inputStrArr, operatorArr)

  let gridCoordArr = formula.split(operatorArr[0]).map((coords, i) => {
    let gridCoords = coords.split('').map((coord, i) => {
      if (isNaN(coord)) {
        // need to change this so it can handle mutliple letter and number coords e.g. AA10
        coord = charArray.indexOf(coord) + 1
      }
      return coord
    })
    return {
      row: gridCoords[1],
      col: gridCoords[0],
    }
  })
  return [...gridCoordArr, operatorArr]
}

const calculate = (formulaCoords) => {
  let coordsArr = inputValueToFormulaConverter(formulaCoords)
  let operatorArr = coordsArr.pop()
  let formula = cellValuesToFormulaStr(coordsArr, operatorArr)

  return eval(formula)
}

// handles basic formula input to a cell
const basicFormula = (targetCell) => {
  cellState = cellState.map(row => {
    return row.map(cell => {
      if (cell.colCoord == targetCell.data.colCoord && cell.rowCoord == targetCell.data.rowCoord) {
        let formula = cell.formula == "" ? targetCell.value : cell.formula
        cell.formula = formula
        cell.value = calculate(formula)
      }
      return cell
    })
  })
  refresh()
}

// updates the cellState data following user input
const setCellStateFromInput = (targetCell) => {
  cellState = cellState.map(row => {
    return row.map(cell => {
      if (cell.colCoord == targetCell.data.colCoord && cell.rowCoord == targetCell.data.rowCoord) {
        cell.value = targetCell.value
      }
      return cell
    })
  })
  refresh()
}

// handles input information to update cell data
const handleInput = (e) => {
  if (e.target.value[0] == "=") {
    basicFormula(e.target)
  } else {
    setCellStateFromInput(e.target)
  }
}

// refreshes grid with cellState data
const refresh = (e) => {
  document.getElementById("sheet").innerHTML = ''
  render(cellState)
}

// formatter to convert column index to incrementing alphabetic label
const indexToLetters = (n) => {
  let charArray = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let firstLetter = (charArray[Math.ceil(n / 26) - 2] || '')
  let secondLetter = charArray[(n - 1) % 26]
  return firstLetter + secondLetter
}

const createCellNode = (cell) => {
  const newCell = document.createElement('td')
  const input = document.createElement('input')
  input.data = cell
  input.onchange = handleInput
  // checks to see if first cell and creates button
  if (cell.colCoord == 0 && cell.rowCoord == 0) {
    const refreshButton = document.createElement('button')
    refreshButton.onclick = refresh
    refreshButton.setAttribute('id', 'refresh-button')
    newCell.appendChild(refreshButton)
    // checks to see if first column to add index formatting
  } else if (cell.colCoord == 0) {
    newCell.innerHTML = cell.rowCoord
    newCell.classList.add('first-col')
    // checks to see if first row to add index formatting
  } else if (cell.rowCoord == 0 && cell.colCoord !== 0) {
    newCell.innerHTML = indexToLetters(cell.colCoord)
    newCell.classList.add('first-row')
    // appends an input to each cell and gives it information references matching cellState data cell
  } else if (cell.formula !== "") {
    // if(!calculate(cell.formula)){
    //   input.value = "Sorry, I don't understand that command!"
    // } else {
    input.value = calculate(cell.formula)
    // }

    newCell.appendChild(input)
  } else {
    input.value = cell.value
    newCell.appendChild(input)
  }
  return newCell
}

const createRowNode = (row) => {
  let newRow = document.createElement('tr')
  row.forEach(cell => {
    newRow.appendChild(createCellNode(cell))
  })
  return newRow
}

// renders grid based on cellState
const render = (grid) => {
  return grid.forEach((row, i) => {
    tableBody.appendChild(createRowNode(row))
  });
}

//initialises the spreadsheet by generating the grid and passing it to render
const start = () => {
  cellState = generateGrid(gridSize)
  render(cellState)
}

document.addEventListener('DOMContentLoaded', start)
