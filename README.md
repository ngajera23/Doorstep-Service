# Doorstep-Service


Requirements
- Node (version 17.0.0 +)
- MongoDB (should be running on port `27017` in localhost)


Database dump is provided inside `dump` folder to test the project with dummy data


to apply the database dump

```
cd <Project root folder>
mongorestore --db test-dump dump/my-web-project/
```

Steps to run this project

1. Install the dependencies
```
npm install
```

2. Run the project
```
npm start
```

Test accounts for Employer and worker
```
Employer - nikunj007.gajera@gmail.com
Password - Nikunj231

Worker - Surbhidhanani094@gmail.com
Pass - Surbhi2810
```

The project will be started on http://localhost:3000.
