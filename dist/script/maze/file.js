import { Maze, Point } from "./maze.js";
export async function NewMazeFromFile(filename) {
    const content = await fetch(filename).then(res => res.text());
    const maze = [];
    let cursor = 0;
    let width = 0;
    let start;
    let goal;
    const tokens = content.match(/(\S+|\n)/g);
    if (tokens === null) {
        throw new Error("failed to parse the file");
    }
    MazeParser: for (let i = 0;; i++) {
        const token = tokens[i];
        switch (token) {
            case "\n":
            case undefined:
                if (cursor === 0) {
                    throw new Error("non-positive row width");
                }
                else if (width === 0) {
                    width = cursor;
                }
                if (maze.length % width !== 0) {
                    throw new Error("inconsistent row width");
                }
                if (token === undefined) {
                    break MazeParser;
                }
                cursor = 0;
                break;
            case "#":
                maze.push(true);
                cursor++;
                break;
            case ".":
                maze.push(false);
                cursor++;
                break;
            case "s":
                if (width === 0) {
                    start = new Point(cursor, 0);
                }
                else {
                    start = new Point(cursor, Math.floor(maze.length / width));
                }
                cursor++;
                maze.push(false);
                break;
            case "g":
                if (width === 0) {
                    goal = new Point(cursor, 0);
                }
                else {
                    goal = new Point(cursor, Math.floor(maze.length / width));
                }
                maze.push(false);
                cursor++;
                break;
            default:
                throw new Error(`unexpected ${token} was found`);
        }
    }
    if (start === undefined || goal === undefined) {
        throw new Error("start and/or goal were not found");
    }
    return new Maze(maze, width, maze.length / width, start, goal);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYXplL2ZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxXQUFXLENBQUE7QUFFdkMsTUFBTSxDQUFDLEtBQUssVUFBVSxlQUFlLENBQUMsUUFBZ0I7SUFDbEQsTUFBTSxPQUFPLEdBQUcsTUFBTSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUE7SUFFN0QsTUFBTSxJQUFJLEdBQWMsRUFBRSxDQUFBO0lBQzFCLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQTtJQUNkLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQTtJQUViLElBQUksS0FBd0IsQ0FBQTtJQUM1QixJQUFJLElBQXVCLENBQUE7SUFFM0IsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQTtJQUN6QyxJQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUUsQ0FBQztRQUNsQixNQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUE7SUFDL0MsQ0FBQztJQUVELFVBQVUsRUFDVixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ3BCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUV2QixRQUFRLEtBQUssRUFBRSxDQUFDO1lBQ2hCLEtBQUssSUFBSSxDQUFDO1lBQ1YsS0FBSyxTQUFTO2dCQUNWLElBQUksTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO29CQUNmLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQTtnQkFDN0MsQ0FBQztxQkFBTSxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUUsQ0FBQztvQkFDckIsS0FBSyxHQUFHLE1BQU0sQ0FBQTtnQkFDbEIsQ0FBQztnQkFFRCxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxLQUFLLENBQUMsRUFBRSxDQUFDO29CQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUE7Z0JBQzdDLENBQUM7Z0JBRUQsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFLENBQUM7b0JBQ3RCLE1BQU0sVUFBVSxDQUFBO2dCQUNwQixDQUFDO2dCQUVELE1BQU0sR0FBRyxDQUFDLENBQUE7Z0JBQ1YsTUFBSztZQUVULEtBQUssR0FBRztnQkFDSixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO2dCQUNmLE1BQU0sRUFBRSxDQUFBO2dCQUNSLE1BQUs7WUFFVCxLQUFLLEdBQUc7Z0JBQ0osSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQkFDaEIsTUFBTSxFQUFFLENBQUE7Z0JBQ1IsTUFBSztZQUVULEtBQUssR0FBRztnQkFDSixJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUUsQ0FBQztvQkFDZCxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFBO2dCQUNoQyxDQUFDO3FCQUFNLENBQUM7b0JBQ0osS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQTtnQkFDOUQsQ0FBQztnQkFFRCxNQUFNLEVBQUUsQ0FBQTtnQkFDUixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUNoQixNQUFLO1lBRVQsS0FBSyxHQUFHO2dCQUNKLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRSxDQUFDO29CQUNkLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUE7Z0JBQy9CLENBQUM7cUJBQU0sQ0FBQztvQkFDSixJQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFBO2dCQUM3RCxDQUFDO2dCQUVELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7Z0JBQ2hCLE1BQU0sRUFBRSxDQUFBO2dCQUNSLE1BQUs7WUFFVDtnQkFDSSxNQUFNLElBQUksS0FBSyxDQUFDLGNBQWMsS0FBSyxZQUFZLENBQUMsQ0FBQTtRQUNwRCxDQUFDO0lBQ0wsQ0FBQztJQUVELElBQUksS0FBSyxLQUFLLFNBQVMsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFLENBQUM7UUFDNUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFBO0lBQ3ZELENBQUM7SUFFRCxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQ2xFLENBQUMifQ==