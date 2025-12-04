import { AsyncTry } from "../error/try.ts"
import { NewMazeFromFile } from "./file.ts"
import { Maze } from "./maze.ts"

export class MazeKeeper {
    #mazes: Record<string, Maze>

    constructor() {
        this.#mazes = {}
    }

    async Fetch(filename: string): Promise<Maze> {
        const name = filename.slice(filename.lastIndexOf("/") + 1)
        if (Object.hasOwn(this.#mazes, name)) {
            return this.#mazes[name]
        }

        const [maze, error] = await AsyncTry(NewMazeFromFile, filename)
        if (error !== null) {
            throw new Error("invalid maze")
        }

        this.#mazes[name] = maze
        return maze
    }
}