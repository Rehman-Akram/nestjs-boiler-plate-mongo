# Boiler-plate
Boiler plate for nest js with mongo db. 

It has following modules

1. Auth module (JwtAuth Guard, Permission Guard)
4. Permissions module (with rbac)
5. Roles module
6. Shared module (custom decorators, transformers, etc.)
8. Users module
10. Users-role module
11. Seeders (users, roles, permissions)
12. Passport jwt strategy
13. Global exception handling

# Database
1. Mongo 

# Getting started

## Pre-requisites
1. Node 20.14.0
2. Nestjs 10.3.2
3. MongoDB 5.0.17 Community

## APIs documentation 
APIs swagger docuementaion is available at baseUrl + /api-docuementation
e.g.
if you are using localhost at port 3000, then this app backend will work at url: "https://localhost:3000"
you can find apis documentation at "https://localhost:3000/api-documentation" 

### Swagger documentation
For swagger documentation, @nestjs/swagger plugin is used in nest-cli with suitable options.

## Running the app

1. npm i
2. create db and update env accordingly
4. run seeders using package.json script

$ npm run start 
or
$ npm run start:dev (watch mode)

## Authentication
For authentication JWT is used with passport strategy
