import math, {
  matrix,
  ones,
  multiply,
  zeros,
  subtract,
  eigs
} from 'mathjs'
import p5 from 'p5'
const width = 400
const height = 400
const n = 10

let checkboxes = []
const s = (p:p5) => {

  p.setup = function() {
    p.frameRate(1)
    p.createCanvas(width, height)
    
    for (let i = 0; i < n; i++) {
      checkboxes.push([])
      for (let j = 0; j < n; j++) {
        let checkbox = p.createCheckbox()
        if (i < j) {
          checkbox.position(i * 15, j * 15 + height + 10)
        } else {
          checkbox.position(-100, -100)
        }
        checkboxes[checkboxes.length - 1].push(checkbox)
      }
      p.createDiv()
    }
  }

  p.draw = function() {
    p.background(0)
    p.translate(100, 100)
    const M: math.Matrix = (matrix(checkboxes.map((row: p5.Element[]) =>
      row.map(({ checked }: any) =>
        checked() ? 1 : 0
    ))) as any).map((_, [i, j], M) => M.valueOf()[j][i] || M.valueOf()[i][j])
    const d = multiply(M, ones(n, 1))
    const D: math.Matrix = (zeros(n, n) as any).map((_, [i, j]) => i === j ? d.get([i, 0]) : 0)
    const L = subtract(D, M)
    try {
      let firstNonZero = -1
      const { values, vectors }= eigs(L)
      for (let i = 0; i < n; i++) {
        if (values.valueOf()[i] > 0) {
          firstNonZero = i
          break
        }
      }
      if (firstNonZero === -1) {
        throw new Error('No eigenvalues > 0')
      }
      if (n - firstNonZero < 2) {
        throw new Error('Not enough eigenvalues > 0')
      }

      const positions: math.Matrix = (zeros(n, 2) as any).map((_, [i, j]) =>
        vectors.valueOf()[i][j+firstNonZero]*100
      )
      p.stroke(255)
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (M.get([i, j]) === 1) {
            const x1 = positions.get([i, 0])
            const y1 = positions.get([i, 1])
            const x2 = positions.get([j, 0])
            const y2 = positions.get([j, 1])
            p.line(x1, y1, x2, y2)
          }
        }
      }
      for(let i = 0; i < n; i++) {
        const x = positions.get([i, 0])
        const y = positions.get([i, 1])
        p.circle(x, y, 5)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

new p5(s)