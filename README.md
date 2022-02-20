# middlePromotionProject

This project is designed to show the ability to use the core Angular features and other tools needed for the Middle FE developer level. 

It provides the example of the full-fledged authentication that includes Email, Google, Facebook auth methods, password changing and resetting, avatar / user info changes. 

Users can view and sort the list of articles by different types, queries, and orders. They also can add a new article to the list and manipulate its own articles (edit or delete).

Also, the users are able to see the Weather widget for 3 cities (Lviv, Ivano-Frankivsk, Kyiv).

## Additional features and tools used for developing 
Lazy loading, Service workers, CI/CD with Travis CI, Backend API (Firebase), RxJs, Angular 13, Open Weather Map, Cypress (e2e)

## To start the project:
- Install "Node JS" and "Npm"
- Clone the repository and navigate to the project folder
- In the project folder, run command "npm install" to install all dependencies
- Run "ng serve" to start the project locally on http://localhost:4200

## Useful npm scripts:
- "start" : starts the project locally on http://localhost:4200
- "cypress:open" : opens e2e testing interface
- "cypress:run": runs e2e tests
- "build:prod" : makes the production build
- "start:prod": starts an http server on http://localhost:4200
- "build-and-deploy:prod": builds the latest application and starts it on http://localhost:4200
- "e2e": builds the latest application and starts it on http://localhost:4200, and after that runs e2e tests
