

export const TILE_STATUSES = {
  BOMB: "bomb",
  MINE: "mine",
  NUMBER: "number",
  CHOSEN: "chosen",
}

export function createBoard(boardSize, numberOfMines) {
 
  const board = []
  const minePositions = getMinePositions(boardSize, numberOfMines)

  for (let a = 0; a < boardSize; a++) {
    const row = []
    for (let b = 0; b < boardSize; b++) {
      const element = document.createElement("div")
      element.dataset.status = TILE_STATUSES.BOMB

      const tile = {
        element,
        a,
        b,
        mine: minePositions.some(positionMatch.bind(null, { a, b })),
        get status() {
          return this.element.dataset.status
        },
        set status(value) {
          this.element.dataset.status = value
        },
      }

      row.push(tile)
    }
    board.push(row)
  }

  return board
}

export function markTile(tile) {
  if (
    tile.status !== TILE_STATUSES.BOMB &&
    tile.status !== TILE_STATUSES.CHOSEN
  ) {
    return
  }

  if (tile.status === TILE_STATUSES.CHOSEN) {
    tile.status = TILE_STATUSES.BOMB
  } else {
    tile.status = TILE_STATUSES.CHOSEN
   
  }
}

export function revealTile(board, tile) {
  if (tile.status !== TILE_STATUSES.BOMB) {
    return
  }

  if (tile.mine) {
    tile.status = TILE_STATUSES.MINE
    return
  }

  tile.status = TILE_STATUSES.NUMBER
  const adjacentTiles = nearbyTiles(board, tile)
  const mines = adjacentTiles.filter(t => t.mine)
  if (mines.length === 0) {
    adjacentTiles.forEach(revealTile.bind(null, board))
  } else {
    tile.element.textContent = mines.length
  }
}

export function checkWin(board) {
  return board.every(row => {
    return row.every(tile => {
      return (
        tile.status === TILE_STATUSES.NUMBER ||
        (tile.mine &&
          (tile.status === TILE_STATUSES.BOMB ||
            tile.status === TILE_STATUSES.CHOSEN))
      )
    })
  })
}

export function checkLose(board) {
  return board.some(row => {
    return row.some(tile => {
      return tile.status === TILE_STATUSES.MINE
      
    })
  })
}

function getMinePositions(boardSize, numberOfMines) {
  const positions = []

  while (positions.length < numberOfMines) {
    const position = {
      a: randomNumber(boardSize),
      b: randomNumber(boardSize),
    }

    if (!positions.some(positionMatch.bind(null, position))) {
      positions.push(position)
    }
  }

  return positions
}

function positionMatch(one, two) {
  return one.a === two.a && one.b === two.b
}

function randomNumber(size) {
  return Math.floor(Math.random() * size)
}

function nearbyTiles(board, { a, b }) {
  const tiles = []

  for (let aOffset = -1; aOffset <= 1; aOffset++) {
    for (let bOffset = -1; bOffset <= 1; bOffset++) {
      const tile = board[a + aOffset]?.[b + bOffset]
      if (tile) tiles.push(tile)
    }
  }

  return tiles
}
