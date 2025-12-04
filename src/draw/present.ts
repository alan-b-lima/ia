import { Maze, Point } from "../maze/maze.ts"

type Ground = "fore" | "back" | "full" | (string & {})
type Color = string

export class MazePresentation {
    #width: number
    #height: number
    #back: Color[]
    #fore: Color[]

    constructor(maze: Maze, wall: Color, clear: Color, ...layers: { states: Point | Iterable<Point>, ground: Ground, color: Color }[]) {
        this.#height = maze.Height
        this.#width = maze.Width

        this.#back = new Array(this.#height * this.#width)
        this.#fore = new Array(this.#height * this.#width)

        for (let y = 0; y < this.#height; y++) {
            for (let x = 0; x < this.#width; x++) {
                if (maze.IsWall(x, y)) {
                    this.put("full", x, y, wall)
                } else {
                    this.put("full", x, y, clear)
                }
            }
        }

        for (const layer of layers) {
            if (typeof layer.states === "object" && !(Symbol.iterator in layer.states)) {
                layer.states = [layer.states as Point]
            }

            for (const state of layer.states) {
                this.put(layer.ground, state.X, state.Y, layer.color)
            }
        }
    }

    get Width(): number {
        return this.#width
    }

    get Height(): number {
        return this.#height
    }

    BackAt(x: number, y: number): string {
        return this.#back[y * this.#width + x]
    }

    ForeAt(x: number, y: number): string {
        return this.#fore[y * this.#width + x]
    }

    private put(ground: Ground, x: number, y: number, name: string): void {
        const index = y * this.#width + x

        switch (ground) {
        case "full":
            this.#back[index] = name
            this.#fore[index] = name
            break

        case "back":
            this.#back[index] = name
            break

        case "fore":
            this.#fore[index] = name
            break
        }
    }
}
