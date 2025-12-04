import model from "../agents/model.ts"
import { Maze, Point } from "./maze.ts"

export function Next(maze: Maze, state: Point): Point[] {
    const next = []
    if (!maze.IsWall(state.X + 0, state.Y + 1)) { next.push(new Point(state.X + 0, state.Y + 1)) }
    if (!maze.IsWall(state.X + 1, state.Y + 0)) { next.push(new Point(state.X + 1, state.Y + 0)) }
    if (!maze.IsWall(state.X + 0, state.Y - 1)) { next.push(new Point(state.X + 0, state.Y - 1)) }
    if (!maze.IsWall(state.X - 1, state.Y + 0)) { next.push(new Point(state.X - 1, state.Y + 0)) }

    return next
}

export function GreedySearch(maze: Maze, heuristic: (goal: Point, from: Point) => number, memory: model.Memory<Point>, problem: model.Problem<Point>): Point {
    let best: Point | null = null
    let best_cost = Infinity

    const successors = problem.Next(memory.current)
    for (const state of successors) {
        const cost = heuristic(maze.Goal(), state)
        if (!memory.visited.Has(state) && cost < best_cost) {
            best = state
            best_cost = cost
        }
    }
    if (best === null) {
        const index = Math.floor(Math.random() * successors.length)
        return successors[index]
    }

    return best
}

export function Manhattan(goal: Point, from: Point): number {
    return Math.abs(goal.X - from.X) + Math.abs(goal.Y - from.Y)
}

export function Euclidean(goal: Point, from: Point): number {
    return Math.sqrt(Math.pow(goal.X - from.X, 2) + Math.pow(goal.Y - from.Y, 2))
}

const offsets = [
    new Point(0, 1),
    new Point(1, 0),
    new Point(0, -1),
    new Point(-1, 0),
];

export function ManhattanWithLookAhead(maze: Maze, goal: Point, from: Point): number {
    const current = Manhattan(goal, from)

    let count_lesser = 0
    for (const offset of offsets) {
        const cost = Manhattan(goal, new Point(from.X + offset.X, from.Y + offset.Y))
        if (cost < current) {
            count_lesser++
        }
    }

    return (1 - (count_lesser + 1) / (offsets.length + 1)) * current
}