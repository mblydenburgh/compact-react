# Compact React

This CLI tool is used to quickly create a simple React project.
It is based on a simple Webpack and Babel configuration that is viewable
[here](https://github.com/mblydenburgh/no-cra-template).

To start using, first install by running `npm i -g compact-react`. Once installed,
start creating a new project by running `compact-react [insert project name]` from
a terminal window.

Currently, the only customization is choosing a Javascript or Typescript configuration. This
is decided in the terminal after creating an initial project. The base `tsconfig.json` used has
the following contents:
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