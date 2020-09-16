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
        rowCoord: i,
        colCoord: j
      }
      row.push(cell)
    }
    grid.push(row)
  }
  return grid
}

// formatter to convert alphabetic label to column index
const lettersToCellCoords = (inputValue) => {
  let charArray = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  // needs refactoring...
  let gridCoordArr = inputValue.substring(1).split('+').map((coords, i)=> {
    let gridCoords = coords.split('').map((coord, i) => {
      if(isNaN(coord)){
        coord = charArray.indexOf(coord) + 1
      }
      return coord
    })
    return gridCoords.join('')
  })
  return gridCoordArr
}

// handles basic formula input to a cell
const basicFormula = (targetCell) => {
  // this is where I'm currently up to at ~4.5 hours, feels so close to getting basic functionality! Definitely needs to be refactored....
  let cellsForEquation = lettersToCellCoords(targetCell.value)
  return cellState.map(row => {
    return row.map(cell => {
      if(cell.colCoord == targetCell.data.colCoord && cell.rowCoord == targetCell.data.rowCoord){
        let firstCellValue = cellState[cellsForEquation[0][0]][cellsForEquation[0][1]].value
        let secondCellValue = cellState[cellsForEquation[1][0]][cellsForEquation[1][1]].value
      
        cell.value = (firstCellValue + secondCellValue)
      }
      return cell
    })
  })
}

// updates the cellState data following user input
const setCellStateFromInput = (targetCell) => {
  return cellState.map(row => {
    return row.map(cell => {
      if(cell.colCoord == targetCell.data.colCoord && cell.rowCoord == targetCell.data.rowCoord){
        cell.value = targetCell.value
      } 
      return cell
    })
  })
}

// handles input information to update cell data
const handleInput = (e) => {
  if(e.target.value[0] == "="){
    basicFormula(e.target)
  }else {
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
  let firstLetter = (charArray[Math.ceil(n/26) - 2] || '') 
  let secondLetter = charArray[(n -1) % 26]
  return firstLetter + secondLetter
}

const createCellNode = (cell) => {
  const newCell = document.createElement('td')
  // checks to see if first cell and creates button
  if(cell.colCoord == 0 && cell.rowCoord == 0){
    const refreshButton = document.createElement('button')
    refreshButton.onclick = refresh
    refreshButton.setAttribute('id', 'refresh-button')
    newCell.appendChild(refreshButton)
    // checks to see if first column to add index formatting
  } else if(cell.colCoord == 0){
    newCell.innerHTML = cell.rowCoord
    newCell.classList.add('first-col')
    // checks to see if first row to add index formatting
  } else if(cell.rowCoord == 0 && cell.colCoord !== 0){
     newCell.innerHTML = indexToLetters(cell.colCoord)
     newCell.classList.add('first-row')
     // appends an input to each cell and gives it information references matching cellState data cell
  } else {
    const input = document.createElement('input')
    input.data = cell
    input.onchange = handleInput
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
