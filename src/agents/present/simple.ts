import { Set } from "../../container/set.ts"
import { MazePresentation } from "../../draw/present.ts"
import { State } from "../../event.ts"
import { Next } from "../../maze/agent.ts"
import { Maze, Point } from "../../maze/maze.ts"
import simple from "../simple.ts"
import { Color } from "./common.ts"

export default class SimpleReflexAgent {
    #generator: Generator<simple.Memory<Point>, simple.Memory<Point>, void>
    #memory: simple.Memory<Point> | null
    #visited: Set<Point>
    #maze: Maze

    constructor(maze: Maze, reflex: simple.Reflex<Point> = simple.reflex.Random) {
        const problem: simple.Problem<Point> = {
            Start() { return maze.Start() },
            Next: Next.bind(null, maze),
            IsGoal(state: Point) { return Point.Equal(state, maze.Goal()) },
        }

        this.#generator = simple.Agent(problem, reflex)
        this.#memory = null
        this.#visited = new Set(Point.Equal)
        this.#maze = maze
    }

    Advance(config: State): boolean {
        if (this.#memory?.success !== undefined) {
            return false
        }

        const memory = this.#generator.next().value
        config.Iteration = memory.iteration

        this.#memory = memory
        return true
    }

    Render(): MazePresentation {
        let present: MazePresentation

        if (this.#memory === null) {
            present = new MazePresentation(this.#maze, Color["wall"], Color["clear"],
                { states: this.#maze.Start(), ground: "back", color: Color["start"] },
                { states: this.#maze.Goal(), ground: "back", color: Color["goal"] },
                { states: this.#maze.Start(), ground: "fore", color: Color["agent"] },
            )
        } else {
            this.#visited.Add(this.#memory.current)

            present = new MazePresentation(this.#maze, Color["wall"], Color["clear"],
                { states: this.#visited, ground: "full", color: Color["visited"] },
                { states: this.#maze.Start(), ground: "back", color: Color["start"] },
                { states: this.#maze.Goal(), ground: "back", color: Color["goal"] },
                { states: this.#memory.current, ground: "fore", color: Color["agent"] },
            )
        }

        return present
    }
}
