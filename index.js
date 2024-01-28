/**
 * --- TODOS ---
 * [x] move inline css to separate file
 * [x] move js to separate file
 * [x] clean up javascript (reuse stuff)
 * [x] clean up css
 * [x] handle output of commands
 * [x] show output of commands on page reload
 * [x] press up arrow to cycle through command history
 * [] add border to whole window
 * [x] add remaining commands
 * [] add footer - "Built with {} and hosted on {}" - can we pass these in using env variables?
 * [] add loading animation for commands that take a while
 * [] autocomplete commands
 * [] figure out any cool commands to add
 * [] add command highlighting (turn green if valid)
 * [] add an easter egg command 🥚
 * [] add the "ah ah ah" from Jurassic Park when you try to access a secure file/folder
 *    - not sure how to do this, maybe a gif and some audio?
 * [] build a fake file structure that can be navigated (probably using nested arrays)
 * [x] add "last login" message on page load (see Mac terminal app for example)
 * [] add page load animation (dial up tone and ASCII animation of connection)
 * [] change color themes (provide a list of themes to choose from)
 */

// --- CONSTANTS ---

const HOSTNAME = "term.chrisduzan.com";
const USERNAME = "guest";
const VALID_COMMANDS = [
  "help",
  "hostname",
  "whoami",
  "date",
  "echo",
  "repo",
  "resume",
  "email",
  "weather",
  "banner",
  "curl",
  "clear",
];

// --- FUNCTIONS ---

const createCommandRowElement = (command) => {
  const commandRow = document.createElement("div");
  if (!command) {
    commandRow.id = "command-input-container";
  }
  commandRow.className = "command-row";

  const hostText = document.createElement("p");
  hostText.className = "host-text";

  const userText = document.createElement("span");
  userText.className = "user-text";
  userText.textContent = USERNAME;

  const atText = document.createElement("span");
  atText.className = "separator";
  atText.textContent = "@";

  const domainText = document.createElement("span");
  domainText.className = "domain-text";
  domainText.textContent = HOSTNAME;

  const separator = document.createElement("span");
  separator.className = "separator";
  separator.textContent = ":~$";

  hostText.appendChild(userText);
  hostText.appendChild(atText);
  hostText.appendChild(domainText);
  hostText.appendChild(separator);

  const inputContainer = document.createElement("div");
  inputContainer.className = "input-container";

  if (command) {
    // add command
    const userCommand = document.createElement("p");
    userCommand.textContent = command;

    inputContainer.appendChild(userCommand);
  } else {
    // add command input
    const input = document.createElement("input");
    input.id = "command-input";
    input.name = "command-input";
    input.ariaLabel = "Command input";
    input.type = "text";

    inputContainer.appendChild(input);
  }

  commandRow.appendChild(hostText);
  commandRow.appendChild(inputContainer);

  return commandRow;
}

const runCommand = async ([command, ...args], firstLoad = false) => {
  switch (command.toLowerCase().trim()) {
    case "help":
      return `Available commands: ${VALID_COMMANDS.join(", ")}`;
    case "banner":
      return `
██╗  ██╗███████╗██╗     ██╗      ██████╗     ██╗    ██╗ ██████╗ ██████╗ ██╗     ██████╗ ██╗
██║  ██║██╔════╝██║     ██║     ██╔═══██╗    ██║    ██║██╔═══██╗██╔══██╗██║     ██╔══██╗██║
███████║█████╗  ██║     ██║     ██║   ██║    ██║ █╗ ██║██║   ██║██████╔╝██║     ██║  ██║██║
██╔══██║██╔══╝  ██║     ██║     ██║   ██║    ██║███╗██║██║   ██║██╔══██╗██║     ██║  ██║╚═╝
██║  ██║███████╗███████╗███████╗╚██████╔╝    ╚███╔███╔╝╚██████╔╝██║  ██║███████╗██████╔╝██╗
╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝ ╚═════╝      ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═════╝ ╚═╝

Type 'help' to see list of available commands.
      `
    case "hostname":
      return HOSTNAME;
    case "whoami":
      return USERNAME;
    case "date":
      return new Date().toLocaleString();
    case "echo":
      return args.join(" ");
    case "repo":
      if (!firstLoad) {
        window.open('https://github.com/duzantheman/terminal-web-page', '_blank');
      }
      return 'Opening repo...'
    case "resume":
      if (!firstLoad) {
        window.open('https://standardresume.co/r/QJ_hCYRLyUAn3zHJmXCYV', '_blank');
      }
      return 'Opening resume...'
    case "email":
      if (!firstLoad) {
        window.open('mailto:cgduzan@gmail.com?subject=Hey%20Chris%20👋', '_blank');
      }
      return 'Opening mailto:cgduzan@gmail.com...'
    case "weather":
      return (await fetch(`https://wttr.in/${args.join(' ')}?AT`)).text()
    case "curl":
      if (!args.length) return 'curl: no URL specified'

      return (await fetch(args.join(' '))).text()
    case "clear":
      localStorage.removeItem('commandHistory');
      commandHistory = [];
      commandHistoryIndex = 0;
      const commandList = document.getElementById("command-list");
      while (commandList.firstChild && commandList.firstChild.id !== "command-input-container") {
        commandList.removeChild(commandList.firstChild);
      }
      return
    // TODO - navigation commands (ls, cd, pwd)?
    // case "help":
    //   return "help";
    // case "ls":
    //   return "ls";
    // case "cd":
    //   return "cd";
    // case "pwd":
    //   return "pwd";
    default:
      return `command not found: ${command}`;
  }
}

const main = document.getElementById("main");
const scrollToBottom = () => {
  main.scrollTo(0, main.scrollHeight);
}

// --- MAIN ---

let commandHistory = [];
let commandHistoryIndex = 0;

const run = async () => {

  const commandList = document.getElementById("command-list");

  // print login time
  const loginTime = localStorage.getItem('loginTime');
  if (loginTime) {
    const loginTimeElement = document.createElement("p");
    loginTimeElement.textContent = `Last login: ${loginTime}`;
    commandList.appendChild(loginTimeElement);
  }

  // write login time to local storage
  localStorage.setItem('loginTime', new Date().toLocaleString());

  // load command history from local storage
  commandHistory = JSON.parse(localStorage.getItem('commandHistory') || '[]');
  commandHistoryIndex = commandHistory.length;

  if (commandHistory.length === 0) {
    // add default commands to command history
    commandHistory.push('banner');
  }

  // add command history elements
  for (const command of commandHistory) {
    commandList.appendChild(createCommandRowElement(command));

    const commandOutput = await runCommand(command.split(' '), true);
    if (commandOutput) {
      // Create new command output element
      const commandOutputElement = document.createElement("p");
      commandOutputElement.textContent = commandOutput;

      commandList.appendChild(commandOutputElement);
    }
  }

  // add command input element
  commandList.appendChild(createCommandRowElement());

  // add listener on command-input element
  const commandInputContainer = document.getElementById("command-input-container");
  const commandInput = document.getElementById("command-input");
  commandInput.addEventListener("keyup", async function (event) {
    // Enter key
    if (event.key === 'Enter') {
      // Cancel the default action, if needed
      event.preventDefault();

      const commandValue = commandInput.value.trim();
      if (!commandValue) return

      // Clear command input
      commandInput.value = '';

      // Add command to command history
      commandHistory.push(commandValue);
      localStorage.setItem('commandHistory', JSON.stringify(commandHistory));
      commandHistoryIndex = commandHistory.length;

      // Create new command element
      const commandElement = createCommandRowElement(commandValue);

      // insert commandElement before commandInput
      commandList.insertBefore(commandElement, commandInputContainer);

      // Run command
      const commandOutput = await runCommand(commandValue.split(' '));
      if (commandOutput) {
        // Create new command output element
        const commandOutputElement = document.createElement("p");
        commandOutputElement.textContent = commandOutput;

        // insert commandOutputElement before commandInput
        commandList.insertBefore(commandOutputElement, commandInputContainer);
      }

      scrollToBottom()
    }

    // up arrow key
    if (event.key === 'ArrowUp') {
      // Cancel the default action, if needed
      event.preventDefault();

      if (commandHistoryIndex === 0) return

      // update command input value
      commandInput.value = commandHistory[--commandHistoryIndex];

      // move cursor to end of input
      commandInput.setSelectionRange(commandInput.value.length, commandInput.value.length);
    }

    // down arrow key
    if (event.key === 'ArrowDown') {
      // Cancel the default action, if needed
      event.preventDefault();

      if (commandHistoryIndex === commandHistory.length) return

      // update command input value
      commandInput.value = commandHistory[++commandHistoryIndex] || '';

      // move cursor to end of input
      commandInput.setSelectionRange(commandInput.value.length, commandInput.value.length);
    }

    // control + c
    if (event.ctrlKey && event.key === 'c') {
      // Cancel the default action, if needed
      event.preventDefault();

      // Clear command input
      commandInput.value = '';

      // reset command history index
      commandHistoryIndex = commandHistory.length;
    }

    // TODO - can we do some autocomplete stuff?
    // // key is a letter or number
    // if (event.key.match(/[a-z0-9]/i)) {
    //   // see if command matches any valid commands
    //   const matchingCommands = commandHistory.filter(command => command.startsWith(commandInput.value));
    //   console.log(matchingCommands);
    // }
  });

  // keep focus on command input
  commandInput.focus();
  window.addEventListener('click', function () {
    commandInput.focus();
  });
}

run();