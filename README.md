# Compact React

This CLI tool is used to quickly create a simple React project.
It is based on a simple Webpack and Babel configuration that is viewable
[here](https://github.com/mblydenburgh/no-cra-template).

To start using, first install by running `npm i -g compact-react`. Once installed,
start creating a new project by running `compact-react [insert project name]` from
a terminal window.

Currently, the two customization options - 
1. Choosing a Javascript or Typescript configuration. 
2. Choosing to add GraphQL & Apollo Client dependencies

This is decided in the terminal after creating an initial project. 

If Typescript is used, the base `tsconfig.json` has the following contents:
```$xslt
{
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
``` 

If GraphQL is used, the base `.graphqlconfig` has the following contents:
```$xslt
{
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
```