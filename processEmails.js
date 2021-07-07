const execSync = require('child_process').execSync;


function processEmails(emails) {
  // for each email check if the subject matches, if so commence
  for (let email of emails) {
    console.log(email)
    console.log(email.subject)
    if (email.subject.toLowerCase().includes('maintenance is required for your database') &&
        email.bodyText.toLowerCase().includes('has completed successfully')) {
      
      console.log('match found, begining update')
      updateEnvVars();
    }
  }
}

async function updateEnvVars() {
  let envVars = execSync('netlify env:list', { encoding: 'utf-8' }); 
  console.log('Current Netlify Env Vars', envVars);

  let dburlOutput = execSync('heroku config --app startup-equity', { encoding: 'utf-8' }); 
  let dburl = dburlOutput.slice(dburlOutput.indexOf('postgres://') + 'postgres://'.length);
  console.log('Heroku Postgres DB URL', dburl);

  let username = dburl.substring(0, dburl.indexOf(':')).trim();
  let password = dburl.substring(dburl.indexOf(':') + 1, dburl.indexOf('@')).trim();
  let host = dburl.substring(dburl.indexOf('@') + 1, dburl.indexOf('/')).trim();
  host = host.substring(0, host.indexOf(':')).trim();
  let database = dburl.substring(dburl.indexOf('/') + 1).trim();

  let maxRetry = 1000;
  let i = 0;

  while (i < maxRetry) {
    // if dburl is different than our env vars update the env vars
    if (envVars.includes(username) && envVars.includes(password) && envVars.includes(database) && envVars.includes(host)) {
      await sleep(2000)
      console.log('credentials have not changed')
      i++;
    } else {
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
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  processEmails
}
