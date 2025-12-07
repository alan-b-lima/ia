import GoalAgent from "./agents/present/goal.js";
import ModelBasedReflexAgent from "./agents/present/model.js";
import SimpleReflexAgent from "./agents/present/simple.js";
import UtilityAgent from "./agents/present/utility.js";
import { AsyncTry } from "./error/try.js";
import { Euclidean, GreedySearch as GreddySearch, Manhattan } from "./maze/agent.js";
import { MazeKeeper } from "./maze/keeper.js";
import { Orquestrator } from "./tabs.js";
const Agents = {
    "reativo simples": "SimpleReflexAgent",
    "reativo baseado em modelo": "ModelBasedAgent",
    "orientado a objetivo por profundidade": "DepthGoalAgent",
    "orientado a objetivo por largura": "BreadthGoalAgent",
    "orientado a objetivo por profundidade com memória": "DepthGoalAgentWithMemory",
    "orientado a objetivo por largura com memória": "BreadthGoalAgentWithMemory",
    "orientado a utilidade euclidiana": "EuclideanUtilityAgent",
    "orientado a utilidade com Manhattan": "ManhattanUtilityAgent",
    "orientado a utilidade com Manhattan x1.5": "Manhattan1point5UtilityAgent",
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
    "gigante 3": "./mazes/gigantic_3.txt",
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
    Manhattan1point5UtilityAgent: (maze) => new UtilityAgent(maze, (goal, from) => 1.5 * Manhattan(goal, from)),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxNQUFNLDBCQUEwQixDQUFBO0FBQ2hELE9BQU8scUJBQXFCLE1BQU0sMkJBQTJCLENBQUE7QUFDN0QsT0FBTyxpQkFBaUIsTUFBTSw0QkFBNEIsQ0FBQTtBQUMxRCxPQUFPLFlBQVksTUFBTSw2QkFBNkIsQ0FBQTtBQUN0RCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZ0JBQWdCLENBQUE7QUFDekMsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLElBQUksWUFBWSxFQUFFLFNBQVMsRUFBRSxNQUFNLGlCQUFpQixDQUFBO0FBQ3BGLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQTtBQUU3QyxPQUFPLEVBQUUsWUFBWSxFQUFhLE1BQU0sV0FBVyxDQUFBO0FBRW5ELE1BQU0sTUFBTSxHQUFHO0lBQ1gsaUJBQWlCLEVBQUUsbUJBQW1CO0lBQ3RDLDJCQUEyQixFQUFFLGlCQUFpQjtJQUM5Qyx1Q0FBdUMsRUFBRSxnQkFBZ0I7SUFDekQsa0NBQWtDLEVBQUUsa0JBQWtCO0lBQ3RELG1EQUFtRCxFQUFFLDBCQUEwQjtJQUMvRSw4Q0FBOEMsRUFBRSw0QkFBNEI7SUFDNUUsa0NBQWtDLEVBQUUsdUJBQXVCO0lBQzNELHFDQUFxQyxFQUFFLHVCQUF1QjtJQUM5RCwwQ0FBMEMsRUFBRSw4QkFBOEI7Q0FDcEUsQ0FBQTtBQUVWLE1BQU0sS0FBSyxHQUFHO0lBQ1YsV0FBVyxFQUFFLG9CQUFvQjtJQUNqQyxhQUFhLEVBQUUsc0JBQXNCO0lBQ3JDLGFBQWEsRUFBRSxzQkFBc0I7SUFDckMsT0FBTyxFQUFFLG1CQUFtQjtJQUM1QixPQUFPLEVBQUUsbUJBQW1CO0lBQzVCLFNBQVMsRUFBRSxrQkFBa0I7SUFDN0IsU0FBUyxFQUFFLG9CQUFvQjtJQUMvQixTQUFTLEVBQUUsa0JBQWtCO0lBQzdC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