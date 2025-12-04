export class Point {
    readonly X: number
    readonly Y: number

    constructor(x: number, y: number) {
        this.X = x
        this.Y = y
    }

    static Equal(p0: Point, p1: Point): boolean {
        return p0.X === p1.X && p0.Y === p1.Y
    }
}

export class Maze {
    #width: number
    #height: number

    #maze: boolean[]
    #start: Point
    #goal: Point

    constructor(maze: boolean[], width: number, height: number, start: Point, goal: Point) {
        if (height * width !== maze.length) {
            throw new Error("not enough cells")
        }

        this.#maze = maze
        this.#width = width
        this.#height = height
        this.#start = start
        this.#goal = goal
    }

    get Width(): number {
        return this.#width
    }

    get Height(): number {
        return this.#height
    }

    IsWall(x: number, y: number): boolean {
        return this.#maze[y * this.#width + x] !== false
    }

    Start(): Point {
        return this.#start
    }

    Goal(): Point {
        return this.#goal
    }
}