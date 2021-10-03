var repoNameEl = document.querySelector("#repo-name");
var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");

var getRepoName = function() {
    // grab repo name from url query string
    var queryString = document.location.search;
    var repoName = queryString.split("="[1]); 
    
    if (repoName) {
        // display repo name on the page
        repoName.textContent = repoName;  

        getRepoIssues(repoName);    }
    else {
        // if no repo was given, redirect to the homepage
        document.location.replace("./index.html");
    }
    
}

var getRepoIssues = function(repo) {
    // format the github api url
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    
    // make a get request to url
    fetch(apiUrl).then(function(response) {
        //request was successful        
        if (response.ok) {
            response.json().then(function(data) {                
                displayIssues(data);

            // check if api has paginated issues
            if (response.headers.get("Link")) {
                displayWarning(repo);
            }
        });
        }
        else {
            // if no repo was given, redirect to the homepage
            document.location.replace("./index.html");
        }
    });
  };

var displayIssues = function(issues) { 
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }
       
    // loop over given issues
    for (var i = 0; i < issues.length; i++) {
        //create a link to take users to the issue on github
        var issueEL = document.createElement('a');
        issueEL.classList = "list-item flex-row justify-space-between align-center";
        issueEL.setAttribute("href", issues[i].html_url);
        issueEL.setAttribute("target", "_blank");

        //create span to hold issue  title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;
        
        //append to container
        issueEL.appendChild(titleEl);

        //create a typw element
        var typeEl = document.createElement('span');

        //check if issue is an actual issue or pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } 
        else {
            typeEl.textContent = "(Issue)";
        }

        //append to container
        issueEL.appendChild(typeEl);

        //append to the DOM
        issueContainerEl.appendChild(issueEL);
    }
};

var displayWarning = function(repo) {
        // add text to warning container
        limitWarningEl.textContent = "To see more than 30 issues, visit ";

        // create link element
        var linkEl = document.createElement("a");
        linkEl.textContent = "GitHub.com";
        linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
        linkEl.setAttribute("target", "_blank");

        // append to warning container
        limitWarningEl.appendChild(linkEl);
};

getRepoName();
getRepoIssues("facebook/react");