#!/usr/bin/env node

const path = require("path")
const { stdin, stdout } = process;
const fs = require("fs")
const util = require("util")
const chalk = require("chalk")
const download = require("download-git-repo")

const github = util.promisify(download)
let projectName = "";

// Get runtime arguments
const args = process.argv.slice(2)
if (args.length > 1) {
  console.log(`${ chalk.red("Please only enter 1 argument for project name") }`)
} else if (!args.length < 1) {
  projectName = args[0].trim()
  console.log(chalk.yellow(`*** Creating a tiny project by the name of: ${ projectName } ***`))
}

const main = async () => {
  console.log(chalk.yellow("Welcome to compact-react"))
  // Ensure main is run with a project name specified
  if (!projectName) {
    console.log(chalk.red("Please specify a project name as the 2nd command line argument"))
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
    fs.mkdirSync(projectPath, { recursive: true })
    console.log(chalk.yellow(`Folder created`))
  }

  // Download template project from github
  console.log(chalk.yellow("Downloading template project from Github..."))
  await github("mblydenburgh/no-cra-template", projectPath)

  // Update downloaded project's package.json to match provided project name
  try {
    const packageJsonPath = path.join(projectPath, "package.json")
    const rawPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"))
    const newPackageJson = {
      ...rawPackageJson,
      name: projectName,
      description: ""
    }
    fs.writeFileSync(packageJsonPath, JSON.stringify(newPackageJson), "utf-8")

    // Ask questions to customize packages and configuration
    await customizeBuild(projectPath)

    console.log(chalk.yellow("*****************************"))
    console.log(chalk.yellow("*** SUCCESS! Happy Coding ***"))
    console.log(chalk.yellow("*****************************"))
    process.exit(0)
  } catch (exception) {
    console.log(chalk.red("Error updating package.json"))
    console.log(exception)
  }

}

async function customizeBuild(projectPath) {
  const packageJsonPath = path.join(projectPath, "package.json")
  let rawPackageJson
  let newPackageJson
  let rawDependencies
  let rawDevDependencies
  let newDependencies
  let newDevDependencies

  const typescript = await prompt("Do you want to use Typescript? (y/n) ")
  if (typescript.toString().toLowerCase() === "y") {
    // Update package.json dependencies for Typescript
    rawPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"))
    rawDependencies = rawPackageJson.dependencies
    newDependencies = {
      ...rawDependencies,
      "@types/react": "16.9.19",
      "@types/react-dom": "16.9.5"
    }
    rawDevDependencies = rawPackageJson.devDependencies
    newDevDependencies = {
      ...rawDevDependencies,
      "typescript": "^3.7.5",
      "awesome-typescript-loader": "^5.2.1"
    }

    newPackageJson = {
      ...rawPackageJson,
      scripts: {
        "start": "webpack-dev-server --mode development --open --hot",
        "build": "webpack --mode production"
      },
      dependencies: newDependencies,
      devDependencies: newDevDependencies
    }
    fs.writeFileSync(packageJsonPath, JSON.stringify(newPackageJson), "utf-8")

    // Create Typescript Config File
    const typescriptConfigJson = {
      "compilerOptions": {
        "sourceMap": true,
        "noImplicitAny": false,
        "module": "commonjs",
        "target": "es6",
        "lib": [
          "es2015",
          "es2017",
          "dom"
        ],
        "removeComments": true,
        "allowSyntheticDefaultImports": false,
        "jsx": "react",
        "allowJs": true,
        "baseUrl": "./",
        "paths": {
          "components/*": [
            "src/components/*"
          ],
        }
      }
    }
    fs.writeFileSync(path.join(projectPath, "tsconfig.json"), JSON.stringify(typescriptConfigJson))

    // Create Webpack Config w/ Typescript support
    const tsConfig = `const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: './src/index.tsx',
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      { test: /\\.(js)$/, use: 'babel-loader' },
      { test: /\\.(css)$/, use: ['css-loader', 'style-loader'] },
      { test: /\\.(jpg|png|jpeg|gif)$/, use: ['file-loader'] },
      { test: /\\.tsx?$/, use: ['awesome-typescript-loader'] }
    ]
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]
};
    `

    fs.writeFileSync(path.join(projectPath, "webpack.config.js"), tsConfig)

    // Replace index.js with index.tsx
    const indexFilePath = path.join(projectPath, "src")
    const indexTsx = `import * as React from 'react'
import * as ReactDOM from 'react-dom'

function App() {
  return (
    <h1>Hello!</h1>
  )
}

ReactDOM.render(<App/>, document.querySelector("#app"));
    `

    fs.unlinkSync(path.join(indexFilePath, "index.js"))
    fs.writeFileSync(path.join(indexFilePath, "index.tsx"), indexTsx)
  }

  const graphQL = await prompt("Would you like to use GraphQL? (y/n) ")
  if (graphQL.toString().toLowerCase() === "y") {
    // Update package.json with GraphQL and Apollo dependencies
    rawPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"))
    rawDependencies = rawPackageJson.dependencies
    rawDevDependencies = rawPackageJson.devDependencies

    newDependencies = {
      ...rawDependencies,
      "@apollo/react-hooks": "^3.1.3",
      "apollo-boost": "^0.4.4",
      "apollo-client": "^2.6.4",
      "apollo-link-context": "^1.0.19",
      "graphql": "^14.5.8",
      "graphql-tag": "^2.10.1",
    }
    newDevDependencies = {
      ...rawDevDependencies,
      "eslint-plugin-react-hooks": "^2.3.0",
      "regenerator-runtime": "^0.13.3",
    }
    newPackageJson = {
      ...rawPackageJson,
      dependencies: newDependencies,
      devDependencies: newDevDependencies
    }
    fs.writeFileSync(packageJsonPath, JSON.stringify(newPackageJson), "utf-8")

    // Create GraphQL config file
    const graphQLConfig = {
      "name": "Untitled GraphQL Schema",
      "schemaPath": "schema.graphql",
      "extensions": {
        "endpoints": {
          "Default GraphQL Endpoint": {
            "url": "",
            "headers": {
              "user-agent": "JS GraphQL"
            },
            "introspect": true
          }
        }
      }
    }
    fs.writeFileSync(path.join(projectPath,".graphqlconfig"),JSON.stringify(graphQLConfig),"utf-8")
  }
}

function prompt(question) {
  return new Promise((resolve, reject) => {
    stdin.resume();
    stdout.write(chalk.yellow(question));

    stdin.on('data', data => resolve(data.toString().trim()));
    stdin.on('error', err => reject(err));
  });
}

main()