import React, { useState, useEffect } from 'react';
import { Table, Form , Button, Message, List } from 'semantic-ui-react';
import './App.css';
import 'semantic-ui-css/semantic.min.css'
import { createChart, updateChart, clearChart} from './BarChart';
import { createLineChart, updateLineChart, clearLineChart} from './LineChart';
import moment from 'moment';
import useDynamicRefs from 'use-dynamic-refs';
const example = require('./Example.json');
const { Octokit } = require("@octokit/rest");

var octokit = null
var OWNER = null;
var REPO = null;
var hashes = [];
var chart = null;
var lineChart = null;

function validate(owner, repo, auth){
  let p1 = checkUser(owner)
  let p2 = checkRepo(owner, repo)
  let p3 = checkAuth(owner, repo, auth)
  let res = Promise.all([p1, p2, p3])
    .then(msgs =>{
        console.log(msgs)
        return msgs
    })
    .catch(errs => {
      console.log(errs)
      return errs;
    })
  return res;
}

function checkRepo(username, repo){
  let check = new Octokit();
  let p2 = new Promise((resolve, reject) => 
  check.request(`GET /repos/${username}/${repo}`)
  .then(() => {
    resolve({value: true, err: "", val: repo, type: "Repository"})
  })
  .catch(err => {
    console.log(err)
    reject({value: false, err: err, val: repo, type: "Repository"})
  })
  ).catch(err => {
    return err;
  })
  return p2;
}

function checkUser(username){
  let check = new Octokit();
  let p1 = new Promise((resolve, reject) => check.users.getByUsername({
    username,
  })
  .then(() => {
    resolve({value: true, err: "", val: username, type: "Author"})
  })
  .catch(err => {
    reject({value: false, err: err, val: username, type: "Author"})
  })
  ).catch(err => {
    return err;
  })
  return p1;
}

function checkAuth(owner, repo ,auth){
  let check = new Octokit({auth: auth});
  check.log = console;
  let p3 = new Promise((resolve, reject) => check.repos.listCommits({
    owner,
    repo,
  })
  .then(() => {
    resolve({value: true, err: "", val: auth, type: "Authenicator"})
  })
  .catch(err => {
    reject({value: false, err: err, val: auth, type: "Authenicator"})
  })
  ).catch(err => {
    return err;
  })
  return p3;
}

function App(){
  let [owner, setOwner] = useState('');
  let [repo, setRepo] = useState('');
  let [auth, setAuth] = useState('');
  let [check, setCheck] = useState(false);
  let [error, setError] = useState(null);
  let [isError, setIsError] = useState(false);
  let [isExample, setIsExample] = useState(false);

  let notSelected = (
    <div id="info">
      <Form>
        <Message>
        <Form.Field>
          <label>Author</label>
          <input placeholder='Ex: facebook' onChange={(e) => setOwner(e.target.value)}/>
        </Form.Field>
        <Form.Field>
          <label>Repository</label>
          <input placeholder='Ex: react' onChange={(e) => setRepo(e.target.value)}/>
        </Form.Field>
        <Form.Field>
          <label>Authenicator</label>
          <input placeholder='Ex: 0e181d0dffd8dd0e6359d......' onChange={(e) => setAuth(e.target.value)}/>
        </Form.Field>
        <Button onClick={async() => {
          let result = await validate(owner, repo, auth);
          let hasError = false;
          console.log(result)
          result.forEach(res => {
            if(res.value == false){
              hasError = true;
            }
          })

          let errors = result.filter(x => x.value == false).map(res => 
            <div>
              {res.type + ": " + res.err.message}
              <br></br>
            </div> 
          )
          if(!hasError){
            OWNER = result[0].val
            REPO = result[1].val
            let auth = result[2].val
            octokit = new Octokit({auth: auth});
            setCheck(true) 
            setIsError(false)
          } else {
            setError(errors)
            setIsError(true)
          } 
        }}>Submit</Button>
        </Message>
        <Message>
        <Message.Header>How to get authenticated.</Message.Header>
        Unfortunately Github limits the amount of API calls from unauthenticated users so in order for this application to work correctly you need your PAT (Personal Access Token)
        <br></br>
        <a href="https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token">
          Github Documentation
        </a>
        <br></br>
        Perimissions Required:
        <List as='ul'>
        <List.Item as='li'>repo:status</List.Item>
        <List.Item as='li'>public_repo</List.Item>
        </List>
        </Message>
        {isError ?
        <Message negative>
        <Message.Header negative>Errors</Message.Header>
        <p>{error}</p>
        </Message>
       : null}
       <Message>
         Don't wanna make an authenicator just to try it out? Here is an example with just a click of a button!
         <br></br>
         <Button onClick={() => setIsExample(true)}>Example</Button>
       </Message>
      </Form>
    </div>

  )
  return (
    <div>
      <h1 className="title">Repository Viewer</h1>
      {check ? <Selected/> : null}
      {isExample ? 
      <Button style={{display: 'flex', alignContent: 'center', margin: "auto", fontSize: "28px"}} onClick={() => setIsExample(false)}>Back</Button>
      : null}
      {isExample ? <Example /> : null}
      {(check == true || isExample == true) ? null : notSelected}
    </div>

  )
}

function Example(props){
  let commits = example;
  let table = 
  <div id="table">
    <CommitTable commits={commits} example={true}/>
  </div>

  useEffect(() => {
    chart = createChart(chart);
    lineChart = createLineChart(lineChart);
    lineChart = updateLineChart(commits, lineChart);
    return () => {
    }
  },)

  return (
    <div className="mainContainer">
      {table}
      <div>
        <canvas id="canvas"></canvas>
        <canvas id="canvas2"></canvas>
      </div>
    </div>
  );
}


function Selected() {
  let [commits, updateCommits] = useState([]);
  let [loaded, updateLoad] = useState(false);

  useEffect(() => {
    let owner = OWNER;
    let repo = REPO;
    octokit.repos.listCommits({
      owner,
      repo,
    })
    .then(({data}) => {
      data.forEach(function(hash){
        hashes.push(hash.sha)
      })
    })
    .finally(() => {
       hashes.forEach(function(hash){
        octokit.request(`GET /repos/${owner}/${repo}/commits/${hash}`)
        .then(({data}) => {
          updateCommits(commits => [...commits, {date: moment(data.commit.author.date).format("MMM DD YYYY"), parents: data.parents, author: data.author.login,files:data.files, stats:data.stats}])
        })
        .finally(() => {
          updateLoad(true)
        })
        .catch(err => {
          console.log(err)
        })
      })
    })

    chart = createChart(chart);
    lineChart = createLineChart(lineChart);
    return () => {
      
    }
  }, [])

  let table = 
    <div id="table">
      <CommitTable commits={commits} example={false}/>
    </div>

  return (
    <div className="mainContainer">
      {loaded ? table : null}
      <div>
        <canvas id="canvas"></canvas>
        <Message>
          <Button onClick={() => load(commits)}>Load More</Button>
          <Button onClick={() => load(commits)}>Sort</Button>
        </Message>
        <canvas id="canvas2"></canvas>
      </div>
    </div>
  );
}


function highlight(key, str){
  if(str == "In"){
    key.current.style.backgroundColor = "lightgray";
  } else {
    key.current.style.backgroundColor = "white";
  }
}

function updateCommit(commit, key){
  let data = commit.files.map((file) => {
    return {name: file.filename, changes: file.changes}
  })
  updateChart(data, chart)

  if(key.current.style.backgroundColor == "gray"){
    key.current.style.backgroundColor = "darkgray";
  } else {
    key.current.style.backgroundColor = "gray";
  }
}

function getCommitData(sha){
  let owner = OWNER;
  let repo = REPO;
  let newHashes = [];
  let newCommits = [];
  let a = octokit.repos.listCommits({
    owner,
    repo,
    sha
  })
  .then(({data}) => {
    data.forEach(function(hash){
      newHashes.push(hash.sha)
    })
  })
  .finally(() => {
     newHashes.forEach(function(hash){
      octokit.request(`GET /repos/${owner}/${repo}/commits/${hash}`)
      .then(({data}) => {
        return newCommits = [...newCommits, {date: moment(data.commit.author.date).format("MMM Do YY"), parents: data.parents, author: data.author.login,files:data.files, stats:data.stats}]
      })
      .catch(err => {
        console.log(err)
      })
    })
  })

  return a;
}

async function load(oldCommits){
  let oldestParentSha = oldCommits[oldCommits.length-1].parents[0].sha;
  let newCommits = await getCommitData(oldestParentSha)
  //console.log(newCommits)
}

function CommitTable(props) {
  let [getRef, setRef] = useDynamicRefs();
  if(props.example == false){
    lineChart = updateLineChart(props.commits, lineChart);
  }
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Author</Table.HeaderCell>
          <Table.HeaderCell>Date</Table.HeaderCell>
          <Table.HeaderCell>Changes</Table.HeaderCell>
          <Table.HeaderCell>Additions</Table.HeaderCell>
          <Table.HeaderCell>Deletions</Table.HeaderCell>
          <Table.HeaderCell>Files</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
      {props.commits.map((commit, key) => 
          <tr key={key} ref={setRef(key.toString())} 
            onMouseEnter={() => highlight(getRef(key.toString()), "In")} 
            onMouseLeave={() => highlight(getRef(key.toString()), "Out")}
            onClick={() => updateCommit(commit, getRef(key.toString()))}>
            <Table.Cell>{commit.author}</Table.Cell>
            <Table.Cell>{commit.date}</Table.Cell>
            <Table.Cell>{commit.stats.total}</Table.Cell>
            <Table.Cell>{commit.stats.additions}</Table.Cell>
            <Table.Cell>{commit.stats.deletions}</Table.Cell>
            <Table.Cell>{commit.files.length}</Table.Cell>
          </tr>
      )}

    </Table.Body>
    </Table>
  )
}


export default App;
