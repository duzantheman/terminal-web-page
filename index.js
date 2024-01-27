/**
 * --- TODOS ---
 * [x] move inline css to separate file
 * [x] move js to separate file
 * [x] clean up javascript (reuse stuff)
 * [x] clean up css
 * [] handle output of commands
 * [] show output of commands on page reload
 * [] figure out any cool commands to add
 * [] add an easter egg command 🥚
 * [] build a fake file structure that can be navigated (probably using nested arrays)
 * [] add "last login" message on page load (see Mac terminal app for example)
 * [] add page load animation (dial up tone and ASCII animation of connection)
 */

// terminal color schemes
//
// solarized dark
// background: #002b36
// foreground: #839496
// black:      #073642
// red:        #dc322f
// green:      #859900
// yellow:     #b58900
// blue:       #268bd2
// magenta:    #d33682
// cyan:       #2aa198
// white:      #eee8d5
// brightblack:    #002b36
// brightred:      #cb4b16
// brightgreen:    #586e75
// brightyellow:   #657b83
// brightblue:     #839496
// brightmagenta:  #6c71c4
// brightcyan:     #93a1a1
// brightwhite:    #fdf6e3

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
  userText.textContent = "guest";

  const atText = document.createElement("span");
  atText.className = "separator";
  atText.textContent = "@";

  const domainText = document.createElement("span");
  domainText.className = "domain-text";
  domainText.textContent = "term.chrisduzan.com";

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
    console.log('add command')
    // add command
    const userCommand = document.createElement("p");
    userCommand.textContent = command;

    inputContainer.appendChild(userCommand);
  } else {
    console.log('add input')
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

const runCommand = (command) => {
  switch (command) {
    case "help":
      return "help";
    case "ls":
      return "ls";
    case "cd":
      return "cd";
    case "pwd":
      return "pwd";
    case "clear":
      return "clear";
    case "exit":
      return "exit";
    default:
      return "command not found";
  }
}

// load command history from local storage
let commandHistory = JSON.parse(localStorage.getItem('commandHistory') || '[]');

// add command history elements
const commandList = document.getElementById("command-list");
commandHistory.forEach(command => {
  commandList.appendChild(createCommandRowElement(command));
})

// add command input element
commandList.appendChild(createCommandRowElement());

// add listener on command-input element
const commandInputContainer = document.getElementById("command-input-container");
const commandInput = document.getElementById("command-input");
commandInput.addEventListener("keyup", function (event) {
  // Enter key
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();

    // Add command to command history
    commandHistory.push(commandInput.value);
    localStorage.setItem('commandHistory', JSON.stringify(commandHistory));

    // Create new command element
    const commandElement = createCommandRowElement(commandInput.value);

    // insert commandElement before commandInput
    commandList.insertBefore(commandElement, commandInputContainer);

    // Clear command input
    commandInput.value = '';

    // Run command
    const commandOutput = runCommand(commandInput.value);
    // TODO - print command output

    // Scroll to bottom of page
    window.scrollTo(0, document.body.scrollHeight);
  }
});

// keep focus on command input
commandInput.focus();
window.addEventListener('click', function () {
  commandInput.focus();
});