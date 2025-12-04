import { Heap } from "../container/heap.js";
import { Set } from "../container/set.js";
var Utility;
(function (Utility) {
    function* Agent(problem, heuristic) {
        const start = problem.Start();
        const current = new Node(0, heuristic(start), start);
        const mem = {
            current: current,
            visited: new Set(problem.Equal),
            edge: new Heap(),
            iteration: 0,
        };
        mem.edge.Push(current);
        for (; mem.edge.Length(); mem.iteration++) {
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
                const heuristic_value = heuristic(next);
                const node = new Node(accumulated, accumulated + heuristic_value, next, mem.current);
                mem.edge.Push(node);
            }
        }
        mem.success = false;
        return mem;
    }
    Utility.Agent = Agent;
    class Node {
        accumulated;
        estimated;
        head;
        prev;
        constructor(accumulated, estimated, head, prev = null) {
            this.accumulated = accumulated;
            this.estimated = estimated;
            this.head = head;
            this.prev = prev;
        }
        Less(other) {
            return this.estimated < other.estimated;
        }
        *[Symbol.iterator]() {
            for (let n = this; n !== null; n = n.prev) {
                yield n.head;
            }
        }
    }
})(Utility || (Utility = {}));
export default Utility;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbGl0eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hZ2VudHMvdXRpbGl0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sc0JBQXNCLENBQUE7QUFDM0MsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLHFCQUFxQixDQUFBO0FBRXpDLElBQVUsT0FBTyxDQXVGaEI7QUF2RkQsV0FBVSxPQUFPO0lBdUJiLFFBQWUsQ0FBQyxDQUFDLEtBQUssQ0FBSSxPQUFtQixFQUFFLFNBQXVCO1FBQ2xFLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUM3QixNQUFNLE9BQU8sR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBRXBELE1BQU0sR0FBRyxHQUFjO1lBQ25CLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLE9BQU8sRUFBRSxJQUFJLEdBQUcsQ0FBSSxPQUFPLENBQUMsS0FBSyxDQUFDO1lBQ2xDLElBQUksRUFBRSxJQUFJLElBQUksRUFBVztZQUV6QixTQUFTLEVBQUUsQ0FBQztTQUNmLENBQUE7UUFFRCxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUV0QixPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsR0FBRyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUM7WUFDeEMsTUFBTSxHQUFHLENBQUE7WUFFVCxHQUFHLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFHLENBQUE7WUFDN0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDckMsU0FBUTtZQUNaLENBQUM7WUFFRCxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUNuQyxHQUFHLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTtnQkFDbEIsT0FBTyxHQUFHLENBQUE7WUFDZCxDQUFDO1lBRUQsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ2pELEtBQUssTUFBTSxJQUFJLElBQUksVUFBVSxFQUFFLENBQUM7Z0JBQzVCLE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUE7Z0JBQ3BGLE1BQU0sZUFBZSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFFdkMsTUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLFdBQVcsR0FBRyxlQUFlLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtnQkFDcEYsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDdkIsQ0FBQztRQUNMLENBQUM7UUFFRCxHQUFHLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQTtRQUNuQixPQUFPLEdBQUcsQ0FBQTtJQUNkLENBQUM7SUF2Q2dCLGFBQUssUUF1Q3JCLENBQUE7SUFFRCxNQUFNLElBQUk7UUFDRyxXQUFXLENBQVE7UUFDbkIsU0FBUyxDQUFRO1FBQ2pCLElBQUksQ0FBRztRQUNQLElBQUksQ0FBZ0I7UUFFN0IsWUFBWSxXQUFtQixFQUFFLFNBQWlCLEVBQUUsSUFBTyxFQUFFLE9BQXVCLElBQUk7WUFDcEYsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUE7WUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUE7WUFDMUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7WUFDaEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7UUFDcEIsQ0FBQztRQUVELElBQUksQ0FBQyxLQUFjO1lBQ2YsT0FBTyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUE7UUFDM0MsQ0FBQztRQUVELENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQ2QsS0FBSyxJQUFJLENBQUMsR0FBbUIsSUFBSSxFQUFFLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDeEQsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFBO1lBQ2hCLENBQUM7UUFDTCxDQUFDO0tBQ0o7QUFDTCxDQUFDLEVBdkZTLE9BQU8sS0FBUCxPQUFPLFFBdUZoQjtBQUVELGVBQWUsT0FBTyxDQUFBIn0=