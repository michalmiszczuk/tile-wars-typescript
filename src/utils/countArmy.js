export function countSoldiers(board, player) {
  let total = board
    .filter(tile => tile.player === player)
    .reduce((currentTotal, tile) => {
      return currentTotal + tile.soldiers;
    }, 0);

  return total;
}
export function countTanks(board, player) {
  let total = board
    .filter(tile => tile.player === player)
    .reduce((currentTotal, tile) => {
      return currentTotal + tile.tanks;
    }, 0);

  return total;
}
export function countPlanes(board, player) {
  let total = board
    .filter(tile => tile.player === player)
    .reduce((currentTotal, tile) => {
      return currentTotal + tile.planes;
    }, 0);

  return total;
}
