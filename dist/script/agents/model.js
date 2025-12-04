import { Set } from "../container/set.js";
var ModelBasedReflex;
(function (ModelBasedReflex) {
    function* Agent(problem, reflex) {
        const mem = {
            current: problem.Start(),
            visited: new Set(problem.Equal),
            iteration: 0,
        };
        for (;; mem.iteration++) {
            yield mem;
            mem.visited.Add(mem.current);
            if (problem.IsGoal(mem.current)) {
                mem.success = true;
                return mem;
            }
            const next = reflex(mem, problem);
            if (next === null) {
                break;
            }
            mem.current = next;
            mem.visited.Add(mem.current);
        }
        mem.success = false;
        return mem;
    }
    ModelBasedReflex.Agent = Agent;
})(ModelBasedReflex || (ModelBasedReflex = {}));
export default ModelBasedReflex;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWdlbnRzL21vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQTtBQUV6QyxJQUFVLGdCQUFnQixDQW1EekI7QUFuREQsV0FBVSxnQkFBZ0I7SUFxQnRCLFFBQWUsQ0FBQyxDQUFDLEtBQUssQ0FBSSxPQUFtQixFQUFFLE1BQWlCO1FBQzVELE1BQU0sR0FBRyxHQUFjO1lBQ25CLE9BQU8sRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFO1lBQ3hCLE9BQU8sRUFBRSxJQUFJLEdBQUcsQ0FBSSxPQUFPLENBQUMsS0FBSyxDQUFDO1lBRWxDLFNBQVMsRUFBRSxDQUFDO1NBQ2YsQ0FBQTtRQUVELFFBQVMsR0FBRyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUM7WUFDdkIsTUFBTSxHQUFHLENBQUE7WUFFVCxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUE7WUFFNUIsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO2dCQUM5QixHQUFHLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTtnQkFDbEIsT0FBTyxHQUFHLENBQUE7WUFDZCxDQUFDO1lBRUQsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQTtZQUNqQyxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUUsQ0FBQztnQkFDaEIsTUFBSztZQUNULENBQUM7WUFFRCxHQUFHLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTtZQUNsQixHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDaEMsQ0FBQztRQUVELEdBQUcsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBO1FBQ25CLE9BQU8sR0FBRyxDQUFBO0lBQ2QsQ0FBQztJQTdCZ0Isc0JBQUssUUE2QnJCLENBQUE7QUFDTCxDQUFDLEVBbkRTLGdCQUFnQixLQUFoQixnQkFBZ0IsUUFtRHpCO0FBRUQsZUFBZSxnQkFBZ0IsQ0FBQSJ9