class: center, middle

# Git

_By: Vahid Mohammadi_

<div class="fz-14">
    <i>Created with: <a href="https://github.com/gnab/remark">RemarkJS</a></i>
</div>

---

<div class="doc-link">
    <a href="https://stackoverflow.com/a/292359/1889607">Fetch vs Pull</a>
</div>

### Init

Inits git in current directory.
Creates `.git` folder

<div data-termynal>
<div data-ty="input">
    <code class="language-bash">git init</code>
</div>
<div data-ty="input">
    <code class="language-bash">ls -a</code>
</div>
<pre data-ty>
<span class="c-green">.git</span> file.txt
</pre>
</div>

--

### Remove git

<div data-termynal>
<div data-ty="input">
    <code class="language-bash">rm -rf .git</code>
</div>
</div>

--

### Workflow

![alt](images/workflow.png)

---

## Remote

<div data-termynal data-ty-lineDelay="1000">
<div data-ty="input">
    <code class="language-bash">git remote -v</code>
</div>
<pre data-ty>
origin  https://github.com/gvmohzibat/vahid-slides.git
</pre>
<div data-ty="input">
    <code class="language-bash">git remote <span class="c-blue">add</span> gitlab-repo https://gitlab.com/vmohir/vahid-slides.git</code>
</div>
<div data-ty="input">
    <code class="language-bash">git remote update</code>
</div>
<pre data-ty>
Fetching origin
Fetching gitlab-repo
</pre>
<div data-ty="input">
    <code class="language-bash">git branch -a</code>
</div>
<pre data-ty>
<div class="d-inline-flex w-100 justify-content-between"><span>* <span class="c-green">master</span></span><span class="c-blue"><- The star shows HEAD</span></div><span class="c-red">
  remotes/gitlab-repo/master
  remotes/origin/HEAD -> origin/master
  remotes/origin/master</span>
</pre>
<div data-ty="input">
    <code class="language-bash">git remote <span class="c-blue">remove</span> gitlab-repo</code>
</div>
</div>

--

#### HEAD

In <span class="c-green">local repo</span>, `HEAD` is the branch to move for new commits.

In <span class="c-green">remote repo</span>, `HEAD` is used to tell new clones which branch to use as their local `HEAD` (default branch).

<div data-termynal>
<div data-ty="input">
    <code class="language-bash">cat .git/HEAD</code>
</div>
<pre data-ty>
ref: refs/heads/master
</pre>
</div>

---

### Status

<div data-termynal>
<div data-ty="input">
    <code class="language-bash">git status</code>
</div>
<div data-ty="input">
    <code class="language-bash"><div class="has-desc"><span>git status -s</span><span class="c-blue"><- short output</span></div></code>
</div>
</div>

--

### Log

<div data-termynal>
<div data-ty="input">
    <code class="language-bash"><div class="has-desc"><span>git log --oneline</span><span class="c-blue"><- Log commits each in one line</span></div></code>
</div>
<div data-ty="input">
    <code class="language-bash"><div class="has-desc"><span>git log --no-merges</span><span class="c-blue"><- Hide merges</span></div></code>
</div>
<div data-ty="input">
    <code class="language-bash"><div class="has-desc"><span>git log {branch}</span><span class="c-blue"><- Log commits of one branch</span></div></code>
</div>
<div data-ty="input">
    <code class="language-bash"><div class="has-desc"><span>git log --stat</span><span class="c-blue"><- Show file changes</span></div></code>
</div>
</div>

--

### Reflog

Every action you perform inside of Git where data is stored, you can find it inside of the reflog.

Options are same is `git log`

<div data-termynal>
<div data-ty="input">
    <code class="language-bash">git reflog</code>
</div>
</div>

---

class: center, middle

# Fix Mistakes

---

## Amend Commit

You did a commit and you want to change the **message** or the **staged files**

- Change a commit's message

<div data-termynal>
<div data-ty="input">
    <code class="language-bash">git commit -m "wrong message"</code>
</div>
<div data-ty="input">
  <code class="language-bash"><div class="has-desc"><span>git commit <span class="c-blue">--amend</span> -m "correct message"</span><span class="c-yellow"><- Or `git commit --amend` and change the message in the editor</span></div></code>
</div>
</div>

- Change a commit's staged files

<div data-termynal>
<div data-ty="input">
  <code class="language-bash">git status</code>
</div>
<pre data-ty>
<div class="d-inline-flex w-100 justify-content-between"><span><span class="c-green">M</span>  file-1.txt</span><span class="c-blue"><- file-1 is staged</span></div>
 <span class="c-red">M</span> file-2.txt
</pre>
<div data-ty="input">
  <code class="language-bash">git add file-2.txt</code>
</div>
<div data-ty="input">
  <code class="language-bash">git commit <span class="c-blue">--amend</span></code>
</div>
<div data-ty="input">
  <code class="language-bash">git status</code>
</div>
<pre data-ty>
<span class="c-green">M</span>  file-1.txt
<span class="c-green">M</span>  file-2.txt
</pre>
</div>

> Don't run amend on commits that you've pushed to remote

---

## Reset

There are 3 kinds of reset:

![alt](images/reset.jpg)

> #### Note:
>
> - mixed reset will also reset files in staging area
> - hard reset will also reset files in staging area & files in working directory
> - hard reset won't delete untracked files

---

<div data-termynal>
<div data-ty="input">
  <code class="language-bash">git log</code>
</div>
<pre data-ty>
<span class="c-yellow">80827b2</span> unwanted commit
<span class="c-yellow">acfbec6</span> older commit
</pre>
</div>

--

<div class="row flex-nowrap align-items-baseline">
    <div class="col-auto flex-basis-small"> <h4> Soft </h4> </div>

<div class="col min-width-0">
    <div data-termynal>
    <div data-ty="input">
      <code class="language-bash">git <span class="c-blue">reset --soft</span> acfbec6</code>
    </div>
    <div data-ty="input">
      <code class="language-bash">git log</code>
    </div>
<pre data-ty>
<span class="c-yellow">acfbec6</span> older commit
</pre>
    <div data-ty="input">
      <code class="language-bash">git status</code>
    </div>
<pre data-ty>
<div class="d-inline-flex w-100 justify-content-between"><span><span class="c-green">M</span>  file.txt</span><span class="c-blue"><- File is in staging area</span></div>
</pre>
</div>
</div>
</div>

--

<div class="row flex-nowrap align-items-baseline">
    <div class="col-auto flex-basis-small"> <h4> Mixed </h4> </div>
    
<div class="col min-width-0">
    <div data-termynal>
    <div data-ty="input">
        <code class="language-bash"><div class="has-desc"><span>git <span class="c-blue">reset</span> acfbec6</span><span class="c-blue"><- Default is mixed</span></div></code>
    </div>
    <div data-ty="input">
        <code class="language-bash">git log</code>
    </div>
<pre data-ty>
<span class="c-yellow">acfbec6</span> older commit
</pre>
    <div data-ty="input">
        <code class="language-bash">git status</code>
    </div>
<pre data-ty>
<div class="d-inline-flex w-100 justify-content-between"><span> <span class="c-red">M</span> file.txt</span><span class="c-blue"><- File is in working directory</span></div>
</pre>
    </div>
</div>
</div>

--

<div class="row flex-nowrap align-items-baseline">
    <div class="col-auto flex-basis-small"> <h4> Hard </h4> </div>
    
<div class="col min-width-0">
    <div data-termynal>
    <div data-ty="input">
    git <span class="c-blue">reset --hard</span> acfbec6
    </div>
    <div data-ty="input">
        <code class="language-bash">git log</code>
    </div>
<pre data-ty>
<span class="c-yellow">acfbec6</span> older commit
</pre>
    <div data-ty="input">
        <code class="language-bash">git status</code>
    </div>
    </div>
</div>
</div>

---

## Clean

`git reset --hard` won't get read of **untracked** files.

<div data-termynal>
<div data-ty="input">
    <code class="language-bash">git status</code>
</div>
<pre data-ty>
<div class="d-inline-flex w-100 justify-content-between"><span><span class="c-red">??</span> an-untracked-file.txt</span><span class="c-blue"><- Untracked File</span></div>
<div class="d-inline-flex w-100 justify-content-between"><span> <span class="c-red">M</span> a-modified-file.txt</span><span class="c-blue"><- Modified File</span></div>
</pre>
<div data-ty="input">
    <code class="language-bash">git reset --hard HEAD</code>
</div>
<div data-ty="input">
    <code class="language-bash">git status</code>
</div>
<pre data-ty>
<div class="d-inline-flex w-100 justify-content-between"><span><span class="c-red">??</span> an-untracked-file.txt</span><span class="c-blue"><- The untracked file isn't removed</span></div>
</pre>

<div data-ty="input">
    <code class="language-bash">git <span class="c-green">clean</span></code>
</div>
<div data-ty="input">
    <code class="language-bash">git status</code>
</div>
</div>

---

## Cherry-pick

Move a commit to another branch

<div data-termynal>
<div data-ty="input">
  <code class="language-bash">git log</code>
</div>
<pre data-ty>
<span class="c-yellow">80827b2</span> commit in the wrong branch
<span class="c-yellow">acfbec6</span> older commit
</pre>
<div data-ty="input">
  <code class="language-bash">git branch</code>
</div>
<pre data-ty>
* <span class="c-green">master</span>
  dest-branch
</pre>
<div data-ty="input">
  <code class="language-bash">git checkout <span class="c-yellow">dest-branch</span></code>
</div>
<div data-ty="input">
  <code class="language-bash"><div class="has-desc"><span>git <span class="c-blue">cherry-pick</span> 80827b2</span><span class="c-blue"><- Copy the commit to current branch</span></div></code>
</div>
</div>

Now the commit is copied, we should go back and remove the wrong commit.

<div data-termynal>
<div data-ty="input">
  <code class="language-bash">git checkout master</code>
</div>
<div data-ty="input">
  <code class="language-bash">git reset --hard origin/master</code>
</div>
</div>

<!-- tags -->

---

### Config

<div data-termynal data-ty-typeDelay="40" data-ty-lineDelay="1000">
<div data-ty="input">
    <code class="language-bash">git config --global user.name "Vahid Mohammadi"</code>
</div>
<div data-ty="input">
    <code class="language-bash">git config --global user.email "email@ex.com"</code>
</div>
<div data-ty="input">
<code class="language-bash"><div class="has-desc"><span>git config --global credentials.helper store</span><span class="c-yellow"><- Store username & password in <span class="no-break">~/.git-credentials</span></span></div></code>
    <code class="language-bash"></code>
</div>
<div data-ty="input">
<code class="language-bash"><div class="has-desc"><span>git config --global log.abbrevCommit true</span><span class="c-yellow"><- `git log` shows short hashes</span></div></code>
    <code class="language-bash"></code>
</div>
<div data-ty="input">
<code class="language-bash"><div class="has-desc"><span>git config --global status.short true</span><span class="c-yellow"><- `git status` short mode</span></div></code>
    <code class="language-bash"></code>
</div>
<div data-ty="input">
    <code class="language-bash">git config --list # List all configs</code>
</div>
</div>

<!-- Advancded Configs
- git commands alias
- http.proxy
-->
