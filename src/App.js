import React, { useState, useEffect } from 'react';
import { Table, Form , Button, Message } from 'semantic-ui-react';
import './App.css';
import 'semantic-ui-css/semantic.min.css'
import { createChart, updateChart, clearChart} from './BarChart';
import moment from 'moment';
import useDynamicRefs from 'use-dynamic-refs';
const { Octokit } = require("@octokit/rest");

var octokit = null
var OWNER = null;
var REPO = null;
var hashes = [];
var chart = null;

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
  let [error, setError] = useState(null)

  let notSelected = (
    <div id="info">
      <Form>
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
          } else {
            setError(errors)
          } 
        }}>Submit</Button>
        <Message>
        <Message.Header>How to get authenticated.</Message.Header>
        Unfortunately Github limits the amount of API calls from unauthenticated users so in order for this application to work correctly you need your PAC (Personal Access Token)
        <br></br>
        <a href="https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token">
          Github Documentation
        </a>
        </Message>
        <Message negative>
        <Message.Header negative>Errors</Message.Header>
        <p>{error}</p>
        </Message>
      </Form>
    </div>

  )
  return (
    <div>
      <h1 className="title">Repository Viewer</h1>
      {check ? <Selected/> : notSelected}
    </div>

  )
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
          updateCommits(commits => [...commits, {date: moment(data.commit.author.date).format("MMM Do YY"), parents: data.parents, author: data.author.login,files:data.files, stats:data.stats}])
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
    return () => {
      
    }
  }, [])

  let table = 
    <div id="table">
      <CommitTable commits={commits}/>
    </div>

  return (
    <div className="mainContainer">
      {loaded ? table : null}
      <div>
        <canvas id="canvas"></canvas>
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

function updateCommit(commit){
  console.log(commit)
  let data = commit.files.map((file) => {
    return {name: file.filename, changes: file.changes}
  })
  console.log(data)
  updateChart(data, chart)
}

function CommitTable(props) {
  let [getRef, setRef] = useDynamicRefs();

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
            onMouseEnter={(e) => highlight(getRef(key.toString()), "In")} 
            onMouseLeave={(e) => highlight(getRef(key.toString()), "Out")}
            onClick={() => updateCommit(commit)}>
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
