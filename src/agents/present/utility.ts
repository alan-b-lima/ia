import { MazePresentation } from "../../draw/present.ts"
import { State } from "../../event.ts"
import { Next } from "../../maze/agent.ts"
import { Maze, Point } from "../../maze/maze.ts"
import { VisitedSet } from "../../maze/visited.ts"
import utility from "../utility.ts"
import { Color, Heat } from "./common.ts"

export default class UtilityAgent {
    #generator: Generator<utility.Memory<Point>, utility.Memory<Point>, void>
    #memory: utility.Memory<Point> | null
    #visited: VisitedSet
    #maze: Maze

    constructor(maze: Maze, heuristic: (to: Point, from: Point) => number) {
        const problem: utility.Problem<Point> = {
            Start() { return maze.Start() },
            Next: Next.bind(null, maze),
            IsGoal(state: Point) { return Point.Equal(state, maze.Goal()) },
            Weight(): number { return 1 },
            Equal: Point.Equal,
        }

        this.#generator = utility.Agent(problem, heuristic.bind(null, maze.Goal()))
        this.#visited = new VisitedSet()
        this.#memory = null
        this.#maze = maze
    }

    Advance(config: State): boolean {
        if (this.#memory?.success !== undefined) {
            return false
        }

        const memory = this.#generator.next().value
        config.Iteration = memory.iteration
        config.Accumulated = memory.current.accumulated
        config.Estimated = memory.current.estimated

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
            this.#visited.Add(this.#memory.current.head, this.#memory.current.accumulated)
            
            const colored = new Array<{ states: Point, ground: "full", color: string }>(this.#visited.Length())
            let i = 0
            for (const [point, color] of this.#visited) {
                colored[i] = { states: point, ground: "full", color: Heat(0, this.#memory.current.estimated, color) }
                i++
            }

            const edge = new Array<Point>(this.#memory.edge.Length())
            i = 0
            for (const node of this.#memory.edge) {
                edge[i] = node.head
                i++
            }

            present = new MazePresentation(this.#maze, Color["wall"], Color["clear"],
                ...colored,
                { states: this.#memory.current, ground: "fore", color: Color["path"] },
                { states: edge, ground: "back", color: Color["edge"] },
                { states: this.#maze.Start(), ground: "back", color: Color["start"] },
                { states: this.#maze.Goal(), ground: "back", color: Color["goal"] },
                { states: this.#memory.current.head, ground: "fore", color: Color["agent"] },
            )
        }

        return present
    }
}
