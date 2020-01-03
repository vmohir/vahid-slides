class: center, middle

# Git

_By: Vahid Mohammadi_

<div class="fz-14">
    <i>Created with: <a href="https://github.com/gnab/remark">RemarkJS</a></i>
</div>

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
    <code class="language-bash">git config --list # List all configs</code>
</div>
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
    <code class="language-bash">git remote <span class="c-blue">remove</span> gitlab-repo</code>
</div>
<div data-ty="input">
    <code class="language-bash">git branch -a</code>
</div>
<pre data-ty>
<div class="d-inline-flex w-100 justify-content-between"><span>* <span class="c-green">master</span></span><span class="c-blue"><- The star shows HEAD</span></div><span class="c-red">
  remotes/gitlab-repo/master
  remotes/origin/HEAD -> origin/master
  remotes/origin/master</span>
</pre>
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
    <code class="language-bash"><div class="has-desc"><span>git log --pretty=oneline</span><span class="c-blue"><- Log commits each in one line</span></div></code>
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

## Fix Mistakes

#### Amend Commit

Don't do this on commits that you've pushed to remote

<div data-termynal>
<div data-ty="input">
    <code class="language-bash">git commit -m "wrong message"</code>
</div>
<div data-ty="input">
  <code class="language-bash"><div class="has-desc"><span>git commit <span class="c-blue">--amend</span> -m "correct message"</span><span class="c-yellow"><- Or git commit --amend and change the message in the editor</span></div></code>
</div>
<div data-ty="input">
  <code class="language-bash">git add file.txt</code>
</div>
<div data-ty="input">
  <code class="language-bash">git commit <span class="c-blue">--amend</span></code>
</div>
</div>

#### Cherry-pick

Move a commit to another branch

<div data-termynal>
<div data-ty="input">
  <code class="language-bash">git log -s</code>
</div>
<pre data-ty>
<span class="c-yellow">80827b2</span> commit in the wrong branch
<span class="c-yellow">acfbec6</span> older commit
</pre>
<div data-ty="input">
  <code class="language-bash">git checkout dest-branch</code>
</div>
<div data-ty="input">
<code class="language-bash"><div class="has-desc"><span>git <span class="c-blue">cherry-pick</span> 80827b2</span><span class="c-yellow"><- Copy the commit to current branch</span></div></code>
</div>
</div>

<!-- tags -->
