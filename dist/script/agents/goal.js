import { Queue } from "../container/queue.js";
import { Set } from "../container/set.js";
import { Stack } from "../container/stack.js";
var Goal;
(function (Goal) {
    function* Agent(problem, ds, memory) {
        const start = problem.Start();
        const current = new Node(0, start);
        let edge;
        if (ds === "BFS") {
            edge = new Queue();
        }
        else {
            edge = new Stack();
        }
        let set;
        if (memory) {
            set = new Set(problem.Equal);
        }
        else {
            set = new MockSet(problem.Equal);
        }
        const mem = {
            current: current,
            visited: set,
            edge: edge,
            iteration: 0,
        };
        mem.edge.Push(current);
        for (; !mem.edge.Empty(); mem.iteration++) {
            yield mem;
            mem.current = mem.edge.Pop();
            if (!mem.visited.Add(mem.current.head)) {
                continue;
            }
            if (problem.IsGoal(mem.current.head)) {
                mem.success = true;
                return mem;
            }
            const successors = problem.Next(mem.current.head);
            for (const next of successors) {
                const accumulated = mem.current.accumulated + problem.Weight(mem.current.head, next);
                const node = new Node(accumulated, next, mem.current);
                mem.edge.Push(node);
            }
        }
        mem.success = false;
        return mem;
    }
    Goal.Agent = Agent;
    class Node {
        accumulated;
        head;
        prev;
        constructor(accumulated, head, prev = null) {
            this.accumulated = accumulated;
            this.head = head;
            this.prev = prev;
        }
        *[Symbol.iterator]() {
            for (let node = this; node !== null; node = node.prev) {
                yield node.head;
            }
        }
    }
    class MockSet extends Set {
        Has(_) {
            return false;
        }
        Add(_) {
            return true;
        }
    }
})(Goal || (Goal = {}));
export default Goal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29hbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hZ2VudHMvZ29hbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sdUJBQXVCLENBQUE7QUFDN0MsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLHFCQUFxQixDQUFBO0FBQ3pDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQTtBQUU3QyxJQUFVLElBQUksQ0FtR2I7QUFuR0QsV0FBVSxJQUFJO0lBbUJWLFFBQWUsQ0FBQyxDQUFDLEtBQUssQ0FBSSxPQUFtQixFQUFFLEVBQWlCLEVBQUUsTUFBZTtRQUM3RSxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUE7UUFDN0IsTUFBTSxPQUFPLEdBQUcsSUFBSSxJQUFJLENBQUksQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBRXJDLElBQUksSUFBNEIsQ0FBQTtRQUNoQyxJQUFJLEVBQUUsS0FBSyxLQUFLLEVBQUUsQ0FBQztZQUNmLElBQUksR0FBRyxJQUFJLEtBQUssRUFBVyxDQUFBO1FBQy9CLENBQUM7YUFBTSxDQUFDO1lBQ0osSUFBSSxHQUFHLElBQUksS0FBSyxFQUFXLENBQUE7UUFDL0IsQ0FBQztRQUVELElBQUksR0FBVyxDQUFBO1FBQ2YsSUFBSSxNQUFNLEVBQUUsQ0FBQztZQUNULEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBSSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDbkMsQ0FBQzthQUFNLENBQUM7WUFDSixHQUFHLEdBQUcsSUFBSSxPQUFPLENBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3ZDLENBQUM7UUFFRCxNQUFNLEdBQUcsR0FBYztZQUNuQixPQUFPLEVBQUUsT0FBTztZQUNoQixPQUFPLEVBQUUsR0FBRztZQUNaLElBQUksRUFBRSxJQUFJO1lBRVYsU0FBUyxFQUFFLENBQUM7U0FDZixDQUFB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