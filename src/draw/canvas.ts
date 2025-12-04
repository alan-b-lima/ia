import { MazePresentation } from "./present.ts"

export function DrawMaze(ctx: CanvasRenderingContext2D, maze: MazePresentation): void {
    const cell_size = 5
    const border_size = 1
    const inner_size = cell_size - 2 * border_size

    ctx.canvas.width = maze.Width * cell_size
    ctx.canvas.height = maze.Height * cell_size

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    for (let y = 0; y < maze.Height; y++) {
        for (let x = 0; x < maze.Width; x++) {
            const back = maze.BackAt(x, y)
            const fore = maze.ForeAt(x, y)

            if (back === fore) {
                ctx.fillStyle = back
                ctx.fillRect(cell_size * x, cell_size * y, cell_size, cell_size)
                continue
            }

            ctx.fillStyle = back
            const x0 = cell_size * x, y0 = cell_size * y
            const offset = cell_size - border_size
            ctx.fillRect(x0, y0, border_size, cell_size)
            ctx.fillRect(x0, y0, cell_size, border_size)
            ctx.fillRect(x0 + offset, y0, border_size, cell_size)
            ctx.fillRect(x0, y0 + offset, cell_size, border_size)

            ctx.fillStyle = fore
            ctx.fillRect(cell_size * x + border_size, cell_size * y + border_size, inner_size, inner_size)
        }
    }
}