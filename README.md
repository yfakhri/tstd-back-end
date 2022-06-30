
# Tracer Study Back-end

Back-end application for [tracer study web application](https://github.com/yfakhri/tstd-front-end)




## Installation

Install tstd-back-end dependencies with npm

```bash
  npm install
```
then, run with npm


-  Dev mode

```bash
  npm run dev
```

- Prod mode
```bash
  npm run start
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NODE_ENV` 
- `NODE_ENV=development` to enable graphQL playground
- `NODE_ENV=production` to disable graphQL playground


`MONGODB_URI_PROD` mongoDB server URL
 - Example `MONGODB_URI_PROD=mongodb://127.0.0.1:27017/tstd`


