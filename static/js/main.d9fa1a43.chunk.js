(this.webpackJsonprepoviewrreact=this.webpackJsonprepoviewrreact||[]).push([[0],{170:function(e,t,n){e.exports=n(298)},175:function(e,t,n){},177:function(e,t,n){},298:function(e,t,n){"use strict";n.r(t);var a=n(0),l=n.n(a),r=n(29),c=n.n(r),o=(n(175),n(155)),u=n(13),i=n.n(u),s=n(30),m=n(10),h=n(309),f=n(313),d=n(312),E=n(311),v=(n(177),n(178),n(133)),g=n.n(v),p=n(153),b=n(314);var y=n(85),w=n.n(y),C=n(134),O=n(297).Octokit,j=null,k=null,S=null,A=[],F=null;function H(e,t,n){var a=function(e){var t=new O;return new Promise((function(n,a){return t.users.getByUsername({username:e}).then((function(){n({value:!0,err:"",val:e,type:"Author"})})).catch((function(t){a({value:!1,err:t,val:e,type:"Author"})}))})).catch((function(e){return e}))}(e),l=function(e,t){var n=new O;return new Promise((function(a,l){return n.request("GET /repos/".concat(e,"/").concat(t)).then((function(){a({value:!0,err:"",val:t,type:"Repository"})})).catch((function(e){console.log(e),l({value:!1,err:e,val:t,type:"Repository"})}))})).catch((function(e){return e}))}(e,t),r=function(e,t,n){var a=new O({auth:n});return a.log=console,new Promise((function(l,r){return a.repos.listCommits({owner:e,repo:t}).then((function(){l({value:!0,err:"",val:n,type:"Authenicator"})})).catch((function(e){r({value:!1,err:e,val:n,type:"Authenicator"})}))})).catch((function(e){return e}))}(e,t,n);return Promise.all([a,l,r]).then((function(e){return console.log(e),e})).catch((function(e){return console.log(e),e}))}function x(){var e=Object(a.useState)([]),t=Object(m.a)(e,2),n=t[0],r=t[1],c=Object(a.useState)(!1),u=Object(m.a)(c,2),i=u[0],s=u[1];Object(a.useEffect)((function(){var e=k,t=S;return j.repos.listCommits({owner:e,repo:t}).then((function(e){e.data.forEach((function(e){A.push(e.sha)}))})).finally((function(){A.forEach((function(n){j.request("GET /repos/".concat(e,"/").concat(t,"/commits/").concat(n)).then((function(e){var t=e.data;r((function(e){return[].concat(Object(o.a)(e),[{date:w()(t.commit.author.date).format("MMM Do YY"),parents:t.parents,author:t.author.login,files:t.files,stats:t.stats}])}))})).finally((function(){s(!0)})).catch((function(e){console.log(e)}))}))})),F=new g.a(document.getElementById("canvas"),{type:"bar",data:{labels:null,datasets:[{label:"Number of changes",backgroundColor:"#FFFFFF",data:null}]},options:{legend:{display:!1},title:{display:!0,text:"File Changes"}}}),function(){}}),[]);var h=l.a.createElement("div",{id:"table"},l.a.createElement(B,{commits:n}));return l.a.createElement("div",{className:"mainContainer"},i?h:null,l.a.createElement("div",null,l.a.createElement("canvas",{id:"canvas"})))}function P(e,t){e.current.style.backgroundColor="In"==t?"lightgray":"white"}function M(e){console.log(e);var t=e.files.map((function(e){return{name:e.filename,changes:e.changes}}));console.log(t),function(e,t){var n=0;e.forEach((function(e){e.changes>n&&(n=e.changes)})),console.log(n);var a=p.a(b.a).domain([0,n]);e.sort((function(e,t){return t.changes-e.changes}));var l=[],r=[],c=[];e.forEach((function(e){e.name.length>20?l.push(e.name.slice(e.name.length-20,e.name.length)):l.push(e.name),r.push(e.changes),c.push(a(e.changes))})),t.data.datasets[0].backgroundColor=c,t.data.datasets[0].data=r,t.data.labels=l,t.update()}(t,F)}function B(e){var t=Object(C.a)(),n=Object(m.a)(t,2),a=n[0],r=n[1];return l.a.createElement(E.a,null,l.a.createElement(E.a.Header,null,l.a.createElement(E.a.Row,null,l.a.createElement(E.a.HeaderCell,null,"Author"),l.a.createElement(E.a.HeaderCell,null,"Date"),l.a.createElement(E.a.HeaderCell,null,"Changes"),l.a.createElement(E.a.HeaderCell,null,"Additions"),l.a.createElement(E.a.HeaderCell,null,"Deletions"),l.a.createElement(E.a.HeaderCell,null,"Files"))),l.a.createElement(E.a.Body,null,e.commits.map((function(e,t){return l.a.createElement("tr",{key:t,ref:r(t.toString()),onMouseEnter:function(e){return P(a(t.toString()),"In")},onMouseLeave:function(e){return P(a(t.toString()),"Out")},onClick:function(){return M(e)}},l.a.createElement(E.a.Cell,null,e.author),l.a.createElement(E.a.Cell,null,e.date),l.a.createElement(E.a.Cell,null,e.stats.total),l.a.createElement(E.a.Cell,null,e.stats.additions),l.a.createElement(E.a.Cell,null,e.stats.deletions),l.a.createElement(E.a.Cell,null,e.files.length))}))))}var I=function(){var e=Object(a.useState)(""),t=Object(m.a)(e,2),n=t[0],r=t[1],c=Object(a.useState)(""),o=Object(m.a)(c,2),u=o[0],E=o[1],v=Object(a.useState)(""),g=Object(m.a)(v,2),p=g[0],b=g[1],y=Object(a.useState)(!1),w=Object(m.a)(y,2),C=w[0],A=w[1],F=Object(a.useState)(null),P=Object(m.a)(F,2),M=P[0],B=P[1],I=l.a.createElement("div",{id:"info"},l.a.createElement(h.a,null,l.a.createElement(h.a.Field,null,l.a.createElement("label",null,"Author"),l.a.createElement("input",{placeholder:"Ex: facebook",onChange:function(e){return r(e.target.value)}})),l.a.createElement(h.a.Field,null,l.a.createElement("label",null,"Repository"),l.a.createElement("input",{placeholder:"Ex: react",onChange:function(e){return E(e.target.value)}})),l.a.createElement(h.a.Field,null,l.a.createElement("label",null,"Authenicator"),l.a.createElement("input",{placeholder:"Ex: 0e181d0dffd8dd0e6359d......",onChange:function(e){return b(e.target.value)}})),l.a.createElement(f.a,{onClick:Object(s.a)(i.a.mark((function e(){var t,a,r,c;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,H(n,u,p);case 2:t=e.sent,a=!1,console.log(t),t.forEach((function(e){0==e.value&&(a=!0)})),r=t.filter((function(e){return 0==e.value})).map((function(e){return l.a.createElement("div",null,e.type+": "+e.err.message,l.a.createElement("br",null))})),a?B(r):(k=t[0].val,S=t[1].val,c=t[2].val,j=new O({auth:c}),A(!0));case 8:case"end":return e.stop()}}),e)})))},"Submit"),l.a.createElement(d.a,null,l.a.createElement(d.a.Header,null,"How to get authenticated."),"Unfortunately Github limits the amount of API calls from unauthenticated users so in order for this application to work correctly you need your PAC (Personal Access Token)",l.a.createElement("br",null),l.a.createElement("a",{href:"https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token"},"Github Documentation")),l.a.createElement(d.a,{negative:!0},l.a.createElement(d.a.Header,{negative:!0},"Errors"),l.a.createElement("p",null,M))));return l.a.createElement("div",null,l.a.createElement("h1",{className:"title"},"Repository Viewer"),C?l.a.createElement(x,null):I)};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(l.a.createElement(l.a.StrictMode,null,l.a.createElement(I,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[170,1,2]]]);
//# sourceMappingURL=main.d9fa1a43.chunk.js.map