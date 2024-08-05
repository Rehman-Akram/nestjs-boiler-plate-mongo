# Boiler-plate
Boiler plate for nest js with mongo db. 

It has following modules

1. Auth module (JwtAuth Guard, Permission Guard)
2. Permissions module (with rbac)
3. Roles module
6. Shared module (custom decorators, etc.)
8. Users module
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

## Running the app

1. npm i
2. create db and update env accordingly
3. seed data using npm run seed (script in package.json)
4. nest start

## Authentication
For authentication JWT is used with passport strategy

