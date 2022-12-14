# Remix Indie Stack

![The Remix Indie Stack](https://repository-images.githubusercontent.com/465928257/a241fa49-bd4d-485a-a2a5-5cb8e4ee0abf)

Learn more about [Remix Stacks](https://remix.run/stacks).

```
npx create-remix@latest --template remix-run/indie-stack
```

## What's in the stack

- [Fly app deployment](https://fly.io) with [Docker](https://www.docker.com/)
- Production-ready [SQLite Database](https://sqlite.org)
- Healthcheck endpoint for [Fly backups region fallbacks](https://fly.io/docs/reference/configuration/#services-http_checks)
- [GitHub Actions](https://github.com/features/actions) for deploy on merge to production and staging environments
- Email/Password Authentication with [cookie-based sessions](https://remix.run/docs/en/v1/api/remix#createcookiesessionstorage)
- Database ORM with [Prisma](https://prisma.io)
- Styling with [Tailwind](https://tailwindcss.com/)
- End-to-end testing with [Cypress](https://cypress.io)
- Local third party request mocking with [MSW](https://mswjs.io)
- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

Not a fan of bits of the stack? Fork it, change it, and use `npx create-remix --template your/repo`! Make it your own.

## Quickstart

Click this button to create a [Gitpod](https://gitpod.io) workspace with the project set up and Fly pre-installed

[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/remix-run/indie-stack/tree/main)

## Development

- This step only applies if you've opted out of having the CLI install dependencies for you:

  ```sh
  npx remix init
  ```

- Initial setup: _If you just generated this project, this step has been done for you._

  ```sh
  npm run setup
  ```

- Start dev server:

  ```sh
  npm run dev
  ```

This starts your app in development mode, rebuilding assets on file changes.

The database seed script creates a new user with some data you can use to get started:

- Email: `rachel@remix.run`
- Password: `racheliscool`

### Relevant code:

This is a pretty simple note-taking app, but it's a good example of how you can build a full stack app with Prisma and Remix. The main functionality is creating users, logging in and out, and creating and deleting notes.

- creating users, and logging in and out [./app/models/user.server.ts](./app/models/user.server.ts)
- user sessions, and verifying them [./app/session.server.ts](./app/session.server.ts)
- creating, and deleting notes [./app/models/note.server.ts](./app/models/note.server.ts)

## Deployment

This Remix Stack comes with two GitHub Actions that handle automatically deploying your app to production and staging environments.

Prior to your first deployment, you'll need to do a few things:

- [Install Fly](https://fly.io/docs/getting-started/installing-flyctl/)

- Sign up and log in to Fly

  ```sh
  fly auth signup
  ```

  > **Note:** If you have more than one Fly account, ensure that you are signed into the same account in the Fly CLI as you are in the browser. In your terminal, run `fly auth whoami` and ensure the email matches the Fly account signed into the browser.

- Create two apps on Fly, one for staging and one for production:

  ```sh
  fly apps create remix-portfolio-d109
  fly apps create remix-portfolio-d109-staging
  ```

  > **Note:** Make sure this name matches the `app` set in your `fly.toml` file. Otherwise, you will not be able to deploy.

  - Initialize Git.

  ```sh
  git init
  ```

- Create a new [GitHub Repository](https://repo.new), and then add it as the remote for your project. **Do not push your app yet!**

  ```sh
  git remote add origin <ORIGIN_URL>
  ```

- Add a `FLY_API_TOKEN` to your GitHub repo. To do this, go to your user settings on Fly and create a new [token](https://web.fly.io/user/personal_access_tokens/new), then add it to [your repo secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) with the name `FLY_API_TOKEN`.

- Add a `SESSION_SECRET` to your fly app secrets, to do this you can run the following commands:

  ```sh
  fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app remix-portfolio-d109
  fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app remix-portfolio-d109-staging
  ```

  If you don't have openssl installed, you can also use [1password](https://1password.com/password-generator/) to generate a random secret, just replace `$(openssl rand -hex 32)` with the generated secret.

- Create a persistent volume for the sqlite database for both your staging and production environments. Run the following:

  ```sh
  fly volumes create data --size 1 --app remix-portfolio-d109
  fly volumes create data --size 1 --app remix-portfolio-d109-staging
  ```

Now that everything is set up you can commit and push your changes to your repo. Every commit to your `main` branch will trigger a deployment to your production environment, and every commit to your `dev` branch will trigger a deployment to your staging environment.


# Github Workflow
## Local dev -> Remote dev -> main/master 

```
# git checkout -b dev
Switched to a new branch 'dev'
```

- git checkout command will try to checkout the given branch.
- In our case, we don’t have a branch called “dev”. So, the above command will create a new “dev” branch.
- Once the empty dev branch is created, it will also switch to the dev branch and make that as our working branch.

Verify that the new branch got created:

```
# git branch -a
* dev
  master
  remotes/origin/HEAD -> origin/master
  remotes/origin/master
```

-  The `*` is now in front of dev, which indicates the current working branch is dev.

The following git status command indicates that we are currently on the new “dev” branch.

```
# git status
On branch dev
nothing to commit, working tree clean
```


Commit changes to `dev` branch: 
```
git commit -a -m "Fixed email address"
```

__Important!__
 
 >Initially when we created our `dev` branch, it exists only locally on our local laptop. It’s better to push our local “dev” branch to the remote git repository.

> Even if you are the only person who is working on the “dev” branch

> Its still a good idea to push local changes to remote git repo to keep a remote backup of your changes.

> This way, you can push all your changes to the remote dev branch, and someone else who is working on the “dev” branch can then checkout the changes. 

> Even if you are the only person who is working on the “dev” branch, it is still a good idea to push your local changes to remote git repo to keep a remote backup of your changes.

When you do a git push at this stage, it will give the following error message, as we don’t have the “dev” branch in the remote git repository.

```
# git push
fatal: The current branch dev has no upstream branch.
```

Push to `dev` branch when working locally: 
```
git push --set-upstream origin dev
```

Once you are done with your development work on the “dev” branch, and validated your changes, you may want to merge the changes to the master branch.

1. Switch your working branch from dev to master:

```
# git checkout master
Switched to branch 'master'
Your branch is up-to-date with 'origin/master'.
```

Once you are in the master branch, execute git merge dev as shown below to merge the “dev” branch with master.

```
# git merge dev
Updating 03c769c..b0147e6
Fast-forward
 index.txt | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

You’ll see the word “Fast-forward” in the above output. All git does in the master branch is to move the HEAD pointer in the master branch to the latest commit from the “dev” branch.

Once the merge is done, make sure to do a git push, to push your changes to the remote repository.

```
# git push
Total 0 (delta 0), reused 0 (delta 0)
To https://remote-git-repo-url/demoproject
   03c769c..b0147e6  master -> master
```

Now that you’e completed your development work, and merged the changes to master branch, you may want to delete your “dev” branch.

```
# git branch -d dev
Deleted branch dev (was b0147e6).
```

You see from the following output, the “dev” branch is still in the remote git repository.

```
# git branch -a
* master
  remotes/origin/HEAD -> origin/master
  remotes/origin/dev
  remotes/origin/master
```

The following command will delete the remote “dev” branch.

```
# git branch -d -r origin/dev
Deleted remote-tracking branch origin/dev (was b0147e6).
```

After the above clean-up, now we just have only the master branch which includes all the development work that we recently did.

```
# git branch -a
* master
  remotes/origin/HEAD -> origin/master
  remotes/origin/master
```

### Connecting to your database

The sqlite database lives at `/data/sqlite.db` in your deployed application. You can connect to the live database by running `fly ssh console -C database-cli`.

### Getting Help with Deployment

If you run into any issues deploying to Fly, make sure you've followed all of the steps above and if you have, then post as many details about your deployment (including your app name) to [the Fly support community](https://community.fly.io). They're normally pretty responsive over there and hopefully can help resolve any of your deployment issues and questions.

## GitHub Actions

We use GitHub Actions for continuous integration and deployment. Anything that gets into the `main` branch will be deployed to production after running tests/build/etc. Anything in the `dev` branch will be deployed to staging.

## Testing

### Cypress

We use Cypress for our End-to-End tests in this project. You'll find those in the `cypress` directory. As you make changes, add to an existing file or create a new file in the `cypress/e2e` directory to test your changes.

We use [`@testing-library/cypress`](https://testing-library.com/cypress) for selecting elements on the page semantically.

To run these tests in development, run `npm run test:e2e:dev` which will start the dev server for the app as well as the Cypress client. Make sure the database is running in docker as described above.

We have a utility for testing authenticated features without having to go through the login flow:

```ts
cy.login();
// you are now logged in as a new user
```

We also have a utility to auto-delete the user at the end of your test. Just make sure to add this in each test file:

```ts
afterEach(() => {
  cy.cleanupUser();
});
```

That way, we can keep your local db clean and keep your tests isolated from one another.

### Vitest

For lower level tests of utilities and individual components, we use `vitest`. We have DOM-specific assertion helpers via [`@testing-library/jest-dom`](https://testing-library.com/jest-dom).

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.
