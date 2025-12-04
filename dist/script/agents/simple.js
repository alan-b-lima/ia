var SimpleReflex;
(function (SimpleReflex) {
    function* Agent(problem, reflex) {
        const mem = {
            current: problem.Start(),
            iteration: 0,
        };
        for (;; mem.iteration++) {
            yield mem;
            if (problem.IsGoal(mem.current)) {
                mem.success = true;
                return mem;
            }
            const next = problem.Next(mem.current);
            if (next.length === 0) {
                break;
            }
            mem.current = reflex(mem.current, next);
        }
        mem.success = false;
        return mem;
    }
    SimpleReflex.Agent = Agent;
    let reflex;
    (function (reflex) {
        function Random(_, states) {
            const index = Math.floor(Math.random() * states.length);
            return states[index];
        }
        reflex.Random = Random;
    })(reflex = SimpleReflex.reflex || (SimpleReflex.reflex = {}));
})(SimpleReflex || (SimpleReflex = {}));
export default SimpleReflex;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FnZW50cy9zaW1wbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBVSxZQUFZLENBa0RyQjtBQWxERCxXQUFVLFlBQVk7SUFrQmxCLFFBQWUsQ0FBQyxDQUFDLEtBQUssQ0FBSSxPQUFtQixFQUFFLE1BQWlCO1FBQzVELE1BQU0sR0FBRyxHQUFjO1lBQ25CLE9BQU8sRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFO1lBQ3hCLFNBQVMsRUFBRSxDQUFDO1NBQ2YsQ0FBQTtRQUVELFFBQVMsR0FBRyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUM7WUFDdkIsTUFBTSxHQUFHLENBQUE7WUFFVCxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7Z0JBQzlCLEdBQUcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFBO2dCQUNsQixPQUFPLEdBQUcsQ0FBQTtZQUNkLENBQUM7WUFFRCxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUN0QyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7Z0JBQ3BCLE1BQUs7WUFDVCxDQUFDO1lBRUQsR0FBRyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUMzQyxDQUFDO1FBRUQsR0FBRyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUE7UUFDbkIsT0FBTyxHQUFHLENBQUE7SUFDZCxDQUFDO0lBeEJnQixrQkFBSyxRQXdCckIsQ0FBQTtJQUVELElBQWlCLE1BQU0sQ0FLdEI7SUFMRCxXQUFpQixNQUFNO1FBQ25CLFNBQWdCLE1BQU0sQ0FBSSxDQUFJLEVBQUUsTUFBVztZQUN2QyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDdkQsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDeEIsQ0FBQztRQUhlLGFBQU0sU0FHckIsQ0FBQTtJQUNMLENBQUMsRUFMZ0IsTUFBTSxHQUFOLG1CQUFNLEtBQU4sbUJBQU0sUUFLdEI7QUFDTCxDQUFDLEVBbERTLFlBQVksS0FBWixZQUFZLFFBa0RyQjtBQUVELGVBQWUsWUFBWSxDQUFBIn0=