import { Queue } from "../container/queue.ts"
import { Set } from "../container/set.ts"
import { Stack } from "../container/stack.ts"

namespace Goal {
    export interface Problem<E> {
        Start(): E
        Next(state: E): E[]
        IsGoal(state: E): boolean

        Weight(o0: E, o1: E): number
        Equal(o0: E, o1: E): boolean
    }

    export interface Memory<E> {
        current: Node<E>
        visited: Set<E>
        edge: DataStructure<Node<E>>

        iteration: number
        success?: boolean
    }

    export function* Agent<E>(problem: Problem<E>, ds: "BFS" | "DFS", memory: boolean): Generator<Memory<E>, Memory<E>, void> {
        const start = problem.Start()
        const current = new Node<E>(0, start)

        let edge: DataStructure<Node<E>>
        if (ds === "BFS") {
            edge = new Queue<Node<E>>()
        } else {
            edge = new Stack<Node<E>>()
        }

        let set: Set<E>
        if (memory) {
            set = new Set<E>(problem.Equal)
        } else {
            set = new MockSet<E>(problem.Equal)
        }

        const mem: Memory<E> = {
            current: current,
            visited: set,
            edge: edge,

            iteration: 0,
        }

        mem.edge.Push(current)

        for (; !mem.edge.Empty(); mem.iteration++) {
            yield mem

            mem.current = mem.edge.Pop()!
            if (!mem.visited.Add(mem.current.head)) {
                continue
            }

            if (problem.IsGoal(mem.current.head)) {
                mem.success = true
                return mem
            }

            const successors = problem.Next(mem.current.head)
            for (const next of successors) {
                const accumulated = mem.current.accumulated + problem.Weight(mem.current.head, next)
                const node = new Node<E>(accumulated, next, mem.current)
                mem.edge.Push(node)
            }
        }

        mem.success = false
        return mem
    }

    class Node<E> {
        readonly accumulated: number
        readonly head: E
        readonly prev: Node<E> | null

        constructor(accumulated: number, head: E, prev: Node<E> | null = null) {
            this.accumulated = accumulated
            this.head = head
            this.prev = prev
        }

        *[Symbol.iterator](): Iterator<E> {
            for (let node: Node<E> | null = this; node !== null; node = node.prev) {
                yield node.head
            }
        }
    }

    class MockSet<E> extends Set<E> {
        override Has(_: E): boolean {
            return false
        }

        override Add(_: E): boolean {
            return true
        }
    }
}

export default Goal