# heroku-db-credentials-rotater

## TODO
- redeploy netlify site

## the problem
The heroku free tier provides postgres databases, but randomaly rotates the database credentials. This means you have to manually watch for the email from heroku and then update the credentials after.

## the solution
This project uses Gmail Pub/Sub the Heroku CLI and Netlify CLI to automate this process. The project listens for the email from heroku. Then the app will get the new credentials from heroku, updates your Netlify environment variables, and redploys your Netlify site for the new env vars to take effect. 

### Helpful Links
- netlify CLI env var command
> - https://github.com/netlify/cli/blob/main/docs/commands/env.md
- Heroku CLI get credentials command 
> - https://help.heroku.com/SMVK5PMS/why-have-my-heroku-postgres-credentials-changed
- medium article to setup Gmail Pub/Sub
> - https://medium.com/@chesskid98/setting-up-gmail-pub-sub-77e1c8d2661d
