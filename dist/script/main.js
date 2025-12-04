import GoalAgent from "./agents/present/goal.js";
import ModelBasedReflexAgent from "./agents/present/model.js";
import SimpleReflexAgent from "./agents/present/simple.js";
import UtilityAgent from "./agents/present/utility.js";
import { AsyncTry } from "./error/try.js";
import { Euclidean, Manhattan, ManhattanWithLookAhead, GreedySearch as GreddySearch } from "./maze/agent.js";
import { MazeKeeper } from "./maze/keeper.js";
import { Orquestrator } from "./tabs.js";
const Agents = {
    "agente reativo simples": "SimpleReflexAgent",
    "agente reativo baseado em modelo": "ModelBasedAgent",
    "agente orientado a objetivo por profundidade": "DepthGoalAgent",
    "agente orientado a objetivo por largura": "BreadthGoalAgent",
    "agente orientado a objetivo por profundidade com memória": "DepthGoalAgentWithMemory",
    "agente orientado a objetivo por largura com memória": "BreadthGoalAgentWithMemory",
    "agente orientado a utilidade euclidiana": "EuclideanUtilityAgent",
    "agente orientado a utilidade com Manhattan": "ManhattanUtilityAgent",
    "agente orientado a utilidade com Manhattan espião": "ManhattanUtilityAgentWithLookAhead",
};
const Mazes = {
    "aleatório": "./mazes/random.txt",
    "aleatório 2": "./mazes/random_2.txt",
    "aleatório 3": "./mazes/random_3.txt",
    "aneis": "./mazes/rigns.txt",
    "campo": "./mazes/field.txt",
    "colmeia": "./mazes/hive.txt",
    "espiral": "./mazes/spiral.txt",
    "estrela": "./mazes/star.txt",
    "gigante": "./mazes/gigantic.txt",
    "gigante 2": "./mazes/gigantic_2.txt",
    "onda": "./mazes/wave.txt",
};
function main() {
    const orq = new_orquestrator();
    setup_navigation(orq);
}
const AgentFactory = {
    SimpleReflexAgent: (maze) => new SimpleReflexAgent(maze),
    ModelBasedAgent: (maze) => new ModelBasedReflexAgent(maze, GreddySearch.bind(null, maze, Manhattan)),
    DepthGoalAgent: (maze) => new GoalAgent(maze, "DFS", false),
    DepthGoalAgentWithMemory: (maze) => new GoalAgent(maze, "DFS", true),
    BreadthGoalAgent: (maze) => new GoalAgent(maze, "BFS", false),
    BreadthGoalAgentWithMemory: (maze) => new GoalAgent(maze, "BFS", true),
    EuclideanUtilityAgent: (maze) => new UtilityAgent(maze, Euclidean),
    ManhattanUtilityAgent: (maze) => new UtilityAgent(maze, Manhattan),
    ManhattanUtilityAgentWithLookAhead: (maze) => new UtilityAgent(maze, ManhattanWithLookAhead.bind(null, maze)),
};
function new_orquestrator() {
    const canvas = document.querySelector("#canvas");
    if (canvas === null) {
        throw new Error("there must be a #canvas element");
    }
    const ctx = canvas.getContext('2d');
    if (ctx === null) {
        throw new Error("fail to get 2d context");
    }
    return new Orquestrator(ctx);
}
function setup_navigation(orq) {
    const navbar = document.querySelector("#navbar");
    if (navbar === null) {
        throw new Error("there must be a #navbar element");
    }
    const new_tab = document.querySelector("#new-tab");
    if (new_tab === null) {
        throw new Error("there must be a #new-tab element");
    }
    const dialog = document.querySelector("#dialog");
    if (dialog === null) {
        throw new Error("there must be a #dialog element");
    }
    const form = dialog.querySelector("form");
    if (form === null) {
        throw new Error("there must be a #dialog form element");
    }
    const tab_input = form.querySelector("#tab");
    if (tab_input === null) {
        throw new Error("there must be a #dialog form #tab form element");
    }
    {
        const agent_select = form.querySelector("#agent");
        if (agent_select === null) {
            throw new Error("there must be a #dialog form #agent form element");
        }
        for (const agent in Agents) {
            const option = document.createElement("option");
            option.value = Agents[agent];
            option.textContent = agent;
            agent_select.append(option);
        }
        const maze_select = form.querySelector("#maze");
        if (maze_select === null) {
            throw new Error("there must be a #dialog form #agent form element");
        }
        for (const maze in Mazes) {
            const option = document.createElement("option");
            option.value = Mazes[maze];
            option.textContent = maze;
            maze_select.append(option);
        }
        const cancel = form.querySelector("#cancel");
        if (cancel === null) {
            throw new Error("there must be a #dialog form #cancel button");
        }
        cancel.addEventListener("click", function (event) {
            event.preventDefault();
            dialog.close();
        });
        const submit = form.querySelector("#submit");
        if (submit === null) {
            throw new Error("there must be a #dialog form #submit button");
        }
        submit.addEventListener("click", function (event) {
            event.preventDefault();
            form.requestSubmit();
        });
    }
    const mazes = new MazeKeeper();
    let count = 0;
    new_tab.addEventListener("click", async function () {
        form.reset();
        tab_input.value = `Agente ${count + 1}`;
        await new Promise(function (resolve) {
            dialog.onclose = function (event) {
                event.preventDefault();
                resolve();
            };
            form.oncancel = function (event) {
                event.preventDefault();
                resolve();
            };
            form.onsubmit = async function (event) {
                event.preventDefault();
                await insert_tab(orq, navbar, new_tab, form, mazes);
                resolve();
            };
            dialog.showModal();
        });
        dialog.onclose = null;
        form.oncancel = null;
        form.onsubmit = null;
        count++;
        dialog.close();
    });
}
async function insert_tab(orq, navbar, nav_tab, form, mazes) {
    const data = new FormData(form);
    const tab_name = data.get("tab");
    const agent_name = data.get("agent");
    const maze_name = data.get("maze");
    const [maze, error] = await AsyncTry(() => mazes.Fetch(maze_name));
    if (error !== null) {
        return;
    }
    if (!Object.hasOwn(AgentFactory, agent_name)) {
        return;
    }
    orq.Link(tab_name, AgentFactory[agent_name](maze));
    orq.SwapTo(tab_name);
    const tab = document.createElement("div");
    tab.addEventListener("click", handle_navbar_click.bind(null, orq, navbar, tab));
    tab.dataset["name"] = tab_name;
    tab.classList.add("tab");
    const name = document.createElement("span");
    name.textContent = tab_name;
    const close = document.createElement("button");
    close.addEventListener("click", handle_close_click.bind(null, orq, navbar, tab));
    close.textContent = "×";
    tab.append(name, close);
    navbar.insertBefore(tab, nav_tab);
    handle_navbar_click(orq, navbar, tab);
}
function handle_navbar_click(orq, navbar, option) {
    const tab_name = option.dataset["name"];
    if (tab_name === undefined) {
        return;
    }
    if (!orq.SwapTo(tab_name)) {
        return;
    }
    const options = navbar.querySelectorAll(".tab");
    for (let i = 0; i < options.length; i++) {
        options[i].classList.remove("selected");
    }
    option.classList.add("selected");
}
function handle_close_click(orq, navbar, option) {
    navbar.removeChild(option);
    const tab_name = option.dataset["name"];
    if (tab_name === undefined) {
        return;
    }
    orq.Unlink(tab_name);
    const current = orq.Current();
    if (current === undefined) {
        return;
    }
    const options = navbar.querySelectorAll(".tab");
    for (let i = 0; i < options.length; i++) {
        if (options[i].dataset["name"] === current) {
            options[i].classList.add("selected");
            return;
        }
    }
}
window.addEventListener("DOMContentLoaded", main, { once: true });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxNQUFNLDBCQUEwQixDQUFBO0FBRWhELE9BQU8scUJBQXFCLE1BQU0sMkJBQTJCLENBQUE7QUFDN0QsT0FBTyxpQkFBaUIsTUFBTSw0QkFBNEIsQ0FBQTtBQUMxRCxPQUFPLFlBQVksTUFBTSw2QkFBNkIsQ0FBQTtBQUN0RCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZ0JBQWdCLENBQUE7QUFDekMsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsc0JBQXNCLEVBQUUsWUFBWSxJQUFJLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFBO0FBQzVHLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQTtBQUU3QyxPQUFPLEVBQUUsWUFBWSxFQUFhLE1BQU0sV0FBVyxDQUFBO0FBRW5ELE1BQU0sTUFBTSxHQUFHO0lBQ1gsd0JBQXdCLEVBQUUsbUJBQW1CO0lBQzdDLGtDQUFrQyxFQUFFLGlCQUFpQjtJQUNyRCw4Q0FBOEMsRUFBRSxnQkFBZ0I7SUFDaEUseUNBQXlDLEVBQUUsa0JBQWtCO0lBQzdELDBEQUEwRCxFQUFFLDBCQUEwQjtJQUN0RixxREFBcUQsRUFBRSw0QkFBNEI7SUFDbkYseUNBQXlDLEVBQUUsdUJBQXVCO0lBQ2xFLDRDQUE0QyxFQUFFLHVCQUF1QjtJQUNyRSxtREFBbUQsRUFBRSxvQ0FBb0M7Q0FFbkYsQ0FBQTtBQUVWLE1BQU0sS0FBSyxHQUFHO0lBQ1YsV0FBVyxFQUFFLG9CQUFvQjtJQUNqQyxhQUFhLEVBQUUsc0JBQXNCO0lBQ3JDLGFBQWEsRUFBRSxzQkFBc0I7SUFDckMsT0FBTyxFQUFFLG1CQUFtQjtJQUM1QixPQUFPLEVBQUUsbUJBQW1CO0lBQzVCLFNBQVMsRUFBRSxrQkFBa0I7SUFDN0IsU0FBUyxFQUFFLG9CQUFvQjtJQUMvQixTQUFTLEVBQUUs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