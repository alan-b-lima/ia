import { Set } from "../../container/set.ts"
import { MazePresentation } from "../../draw/present.ts"
import { State } from "../../event.ts"
import { Next } from "../../maze/agent.ts"
import { Maze, Point } from "../../maze/maze.ts"
import goal from "../goal.ts"
import { Color } from "./common.ts"

export default class GoalAgent {
    #generator: Generator<goal.Memory<Point>, goal.Memory<Point>, void>
    #memory: goal.Memory<Point> | null
    #maze: Maze

    constructor(maze: Maze, ds: "BFS" | "DFS", memory: boolean) {
        const problem: goal.Problem<Point> = {
            Start() { return maze.Start() },
            Next: Next.bind(null, maze),
            IsGoal(state: Point) { return Point.Equal(state, maze.Goal()) },
            Weight(): number { return 1 },
            Equal: Point.Equal,
        }

        this.#generator = goal.Agent(problem, ds, memory)
        this.#memory = null
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
            const edge = new Array<Point>(this.#memory.edge.Length())
            let i = 0
            for (const node of this.#memory.edge) {
                edge[i] = node.head
                i++
            }

            present = new MazePresentation(this.#maze, Color["wall"], Color["clear"],
                { states: this.#memory.visited, ground: "full", color: Color["visited"] },
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
