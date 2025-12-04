import { Maze, Point } from "./maze.ts"

export async function NewMazeFromFile(filename: string): Promise<Maze> {
    const content = await fetch(filename).then(res => res.text())

    const maze: boolean[] = []
    let cursor = 0
    let width = 0

    let start: Point | undefined
    let goal: Point | undefined

    const tokens = content.match(/(\S+|\n)/g)
    if (tokens === null) {
        throw new Error("failed to parse the file")
    }

    MazeParser:
    for (let i = 0; ; i++) {
        const token = tokens[i]

        switch (token) {
        case "\n":
        case undefined:
            if (cursor === 0) {
                throw new Error("non-positive row width")
            } else if (width === 0) {
                width = cursor
            }

            if (maze.length % width !== 0) {
                throw new Error("inconsistent row width")
            }

            if (token === undefined) {
                break MazeParser
            }

            cursor = 0
            break

        case "#":
            maze.push(true)
            cursor++
            break

        case ".":
            maze.push(false)
            cursor++
            break

        case "s":
            if (width === 0) {
                start = new Point(cursor, 0)
            } else {
                start = new Point(cursor, Math.floor(maze.length / width))
            }

            cursor++
            maze.push(false)
            break

        case "g":
            if (width === 0) {
                goal = new Point(cursor, 0)
            } else {
                goal = new Point(cursor, Math.floor(maze.length / width))
            }

            maze.push(false)
            cursor++
            break

        default:
            throw new Error(`unexpected ${token} was found`)
        }
    }

    if (start === undefined || goal === undefined) {
        throw new Error("start and/or goal were not found")
    }

    return new Maze(maze, width, maze.length / width, start, goal)
}
