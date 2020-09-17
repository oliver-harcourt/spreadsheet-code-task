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

const isOperator = () => {

}

// formatter to convert alphabetic label to column index
const lettersToCellCoords = (inputValue) => {
  let charArray = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  // needs refactoring...
  let gridCoordArr = inputValue.substring(1).split('+').map((coords, i) => {
    let gridCoords = coords.split('').map((coord, i) => {
      if (isNaN(coord)) {
        coord = charArray.indexOf(coord) + 1
      }
      return coord
    })
    return gridCoords.join('')
  })
  return gridCoordArr
}

const calculate = (letterCoords) => {
  let cellsForEquation = lettersToCellCoords(letterCoords)
  let firstCellValue = cellState[cellsForEquation[0][1]][cellsForEquation[1][1]].value
  let secondCellValue = cellState[cellsForEquation[0][0]][cellsForEquation[1][0]].value
  return Number(firstCellValue) + Number(secondCellValue)
}

// handles basic formula input to a cell
const basicFormula = (targetCell) => {
  // Definitely needs to be refactored....
  // render cell.value based on formula data if existing
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
  if (e.target.value[0] == "=" || e.target.data.formula[0] == "=") {
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
    input.value = calculate(cell.formula)
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
