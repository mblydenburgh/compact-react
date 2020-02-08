#!/usr/bin/env node

const path = require("path")
const fs = require("fs")
const util = require("util")
const chalk = require("chalk")
const download = require("download-git-repo")

const github = util.promisify(download)
let projectName;

// Get runtime arguments
const args = process.argv.slice(2)
if (args.length > 1) {
  console.log(`${chalk.red("Please only enter 1 argument for project name")}`)
} else {
  projectName = args[0].trim()
}
console.log(`*** Creating a tiny project by the name of: ${ projectName } ***`)

const main = async () => {
  console.log(chalk.bgYellow(chalk.black("Welcome to libery-react-app")))
  // Ensure main is run with a project name specified
  if (!projectName) {
    console.log(chalk.bgRed("Please specify a project name as the 2nd command line argument"))
    return
  }
  // Create project path by joining current working directory and given project name
  const projectPath = path.join(process.cwd(), projectName)
  console.log(chalk.yellow(`Project will be created in ${ projectPath }`))

  // Create the project folder if it does not exist
  const doesFolderExist = fs.existsSync(projectPath)
  if (doesFolderExist) {
    console.log(chalk.red(`Folder with a name of ${ projectName } already found`))
  } else {
    console.log(chalk.yellow(`Folder not found, creating`))
    fs.mkdirSync(projectPath, { recursive: true })
    console.log(chalk.yellow(`Folder created`))
  }

  // Download template project from github
  console.log(chalk.yellow("Downloading template project from Github..."))
  await github("mblydenburgh/no-cra-template", projectPath)

  // Update downloaded project's package.json to match provided project name
  try {
    const packageJsonPath = path.join(projectPath, "package.json")
    console.log(chalk.yellow(`package.json path: ${ packageJsonPath }`))
    const rawPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"))
    const newPackageJson = {
      ...rawPackageJson,
      name: projectName,
      description: ""
    }
    fs.writeFileSync(packageJsonPath, JSON.stringify(newPackageJson), "utf-8")
    console.log(chalk.yellow("Updates to package.json complete."))
    console.log(chalk.bgYellow(chalk.black("*****************************")))
    console.log(chalk.bgYellow(chalk.black("*** SUCCESS! Happy Coding ***")))
    console.log(chalk.bgYellow(chalk.black("*****************************")))
  } catch (exception) {
    console.log(chalk.bgRed("Error updating package.json"))
    console.log(exception)
  }

}

main()