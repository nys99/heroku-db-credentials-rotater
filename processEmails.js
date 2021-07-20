require('dotenv').config()

const execSync = require('child_process').execSync;


async function processEmails(emails) {
  // for each email check if the subject matches, if so commence
  for (let email of emails) {
    if (email.subject.toLowerCase().includes('maintenance is required for your database') &&
        email.bodyText.toLowerCase().includes('has completed successfully') &&
        email.historyType === 'messageAdded') {
      
      console.log('match found, begining update')
      await updateEnvVars();
      await redeploySite();
    }
  }
}

async function updateEnvVars() {
  let envVars = execSync('netlify env:list', { encoding: 'utf-8' }); 
  console.log('Current Netlify Env Vars', envVars);

  let dburlOutput = execSync(`heroku config --app ${process.env.NETLIFY_APP_NAME}`, { encoding: 'utf-8' }); 
  let dburl = dburlOutput.slice(dburlOutput.indexOf('postgres://') + 'postgres://'.length);
  console.log('Heroku Postgres DB URL', dburl);

  let username = dburl.substring(0, dburl.indexOf(':')).trim();
  let password = dburl.substring(dburl.indexOf(':') + 1, dburl.indexOf('@')).trim();
  let host = dburl.substring(dburl.indexOf('@') + 1, dburl.indexOf('/')).trim();
  host = host.substring(0, host.indexOf(':')).trim();
  let database = dburl.substring(dburl.indexOf('/') + 1).trim();

  let maxRetry = 300;
  let i = 0;

  while (i < maxRetry) {
    // if dburl is different than our env vars update the env vars
    //if (envVars.includes(username) && envVars.includes(password) && envVars.includes(database) && envVars.includes(host)) {
    //  await sleep(6000)
    //  console.log('credentials have not changed')
    //  i++;
    //} else {
      let output = execSync(`netlify env:set PGUSER ${username}`, { encoding: 'utf-8' }); 
      console.log(output)
      output = execSync(`netlify env:set PGDATABASE ${database}`, { encoding: 'utf-8' }); 
      console.log(output)
      output = execSync(`netlify env:set PGPASSWORD ${password}`, { encoding: 'utf-8' }); 
      console.log(output)
      output = execSync(`netlify env:set PGHOST ${host}`, { encoding: 'utf-8' }); 
      console.log(output)

      output = execSync('netlify env:list', { encoding: 'utf-8' }); 
      console.log(output)

      break;
    //}
  }
}

async function redeploySite() {
  output = execSync(`sudo n 12`, { encoding: 'utf-8' }); 
  console.log(output)
  output = execSync(`cd /home/nikhil/Desktop/startupequity/app/ && yarn build && netlify deploy -f my_functions/ --prod`, { encoding: 'utf-8' }); 
  console.log(output)
  output = execSync(`sudo n 10`, { encoding: 'utf-8' }); 
  console.log(output)
  output = execSync(`cd /home/nikhil/Desktop/heroku-db-credentials-rotater`, { encoding: 'utf-8' }); 
  console.log(output)
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  processEmails
}
