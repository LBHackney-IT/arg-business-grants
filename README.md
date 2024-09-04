# Additional Restrictions Grant

This application and its cloud resources _(except the S3 bucket)_ have been decommissioned.

**NOTE: This application is based on the work in [Mandatory Business Grants](https://github.com/LBHackney-IT/mandatory-business-grants)
(which in turn is based on [Discretionary Business Grants](https://github.com/LBHackney-IT/discretionary-business-grants) (we know this is not good...) - which
provides all the groundwork for this application. The clone of the work is to enable this application, and
the Mandatory Business Grants application to be running at the same time while being able to rapidly
change each application without affecting the other.**

## Table of Contents

- [Overview](#overview)
- [AWS Architecture](#aws-architecture)
- [Technology](#technology)
  - [PostgresSQL](#postgresql)
- [Known Issues](#known-issues)
  - [API and front end application submission blocking](#api-and-front-end-application-submission-blocking)
  - [MIME types on S3 files](#mime-types-on-s3-files)
- [Getting Started](#getting-started)
  - [Install](#install)
  - [Database](#database)
    - [Setup](#setup)
    - [Seed](#seed)
    - [Migrations](#migrations)
- [Staging/Production Environment](#stagingproduction-environment)
  - [Migrations and seeding](#migrations-and-seeding)
  - [PostgresSQL command line access](#postgressql-command-line-access)
  - [RDS Jump Box setup](#rds-jump-box-setup)

## Overview

This application was developed, for [Hackney Council](https://hackney.gov.uk/), to allow small businesses to
apply for COVID-19 support grants during the second government mandated lockdown during the 2020 Coronavirus
(COVID-19) pandemic.

It consists of a publicly available front end for applicants, and a restricted back end for Grant
Administrators to process claims.

## AWS Architecture

![architecture](dbg-aws.jpg)
[Editable Diagram Source](dbg-aws.drawio)

## Technology

This is a [Next.js](https://nextjs.org/) project bootstrapped with
[`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### PostgreSQL

The database engine is [PostgreSQL](https://www.postgresql.org/), version 11 in
[AWS RDS](https://aws.amazon.com/rds/).

![db-schema](dbg-schema.png)

## Known Issues

### API and front end application submission blocking

Application submissions were closed at 2020-06-26T23:00:00.000Z. The front end reads an environment variable
to enable this. The back end API blocks new submissions in `pages/api/applications/index.js`. In the event
that applications are re-enabled, the back end should read the same environment variable.

### MIME types on S3 files

If the application is re-enabled - when users upload supporting documents they will be stored in S3 with the
wrong MIME type set.
See [here](https://github.com/LBHackney-IT/arg-business-grants/blob/master/docs/S3-METADATA.md) for a
complete description and fix.

## Getting Started

### Requirements

You must have the following installed

- Node.js 12 if you have [NVM](https://github.com/nvm-sh/nvm) installed, run `$ nvm use` in your terminal.
- PostgreSQL 11 installed and running

### Install

Install the dependencies:

    $ yarn install

Create your `.env` file from `.env.sample`. You will need to grab some secrets from (TBC, it's not clear at
the time of writing, but you can view the environment variables on the AWS Lambda if it is already running).

So that the auth token from using Staging/Production can work with your local environment, and you will be
able to access the admin section etc., add the following to your `/etc/hosts` file:

    127.0.0.1    dev.additionalrestrictionsgrant.hackney.gov.uk

Run the development server:

    $ yarn dev

Open [http://dev.additionalrestrictionsgrant.hackney.gov.uk:3000](http://dev.additionalrestrictionsgrant.hackney.gov.uk:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

### Database

Below is a short guide to get started with configuring the database for your local development environment.

#### Setup

1.  Create the database:

    ```sh
    $ createdb arg
    ```

2.  Add the database URL as an environment variable in `.env`. On Linux, you may need to provide a username
    and password.

    ```sh
    $ echo DATABASE_URL=postgresql://localhost/arg >> .env
    # For Linux
    $ echo DATABASE_URL=postgresql://username:password@localhost/arg >> .env
    ```

3.  Run all migrations

    ```sh
    $ yarn dbmigrate up
    ```

#### Seed

To seed your database with data to get going quickly, you can run the file under `db/seeds.sql` by doing the
following:

```sh
$ cat db/seeds.sql | psql arg
```

You'll also want to submit an application via the API to bootstrap the grant officer list.

```bash
curl --data @utils/fixtures/toAPI.json --header "Content-Type: application/json" --request POST http://dev.additionalrestrictionsgrant.hackney.gov.uk:3000/api/applications
```

#### Migrations

Database migrations are managed with [db-migrate](https://github.com/db-migrate/node-db-migrate). To create
a new migration, run the following command:

```sh
$ yarn dbmigrate create description-for-your-migration
```

This will create an `up` and `down` migration as `.sql` files in `db/migrations/sqls` as well as a
JavaScript file in `db/migrations` to run the SQL files.

Migrations are run with:

```sh
$ yarn dbmigrate up
```

Migrations can be rolled back with:

```sh
$ yarn dbmigrate down
```

You can do a dry-run to view the changes that will be applied without making any changes (for both up and
down migrations)

```sh
$ yarn dbmigratedry up
```

## Staging/Production Environment

### Migrations and seeding

To run database migrations against the RDS databases on AWS, you need to run the `dbmigrate up` command via
AWS Systems Manager.

1. Log into the AWS account
2. Go to System Manager
3. Go to Session Manager
4. Click 'Start Session'
5. Select an instance (there should only be 1)
6. Click 'Start Session' - This should open up a terminal like window in your browser
7. Run `source ~/.bashrc` to prepare the exported environment variable
8. Run `cd ~/arg-business-grants/ && git pull && npm run dbmigrate up`

To seed the AWS database, start a session as above. Then, run the following command:

```sh
$ cd ~/arg-business-grants/ && cat db/seeds.sql | psql $DATABASE_URL
```

### PostgresSQL command line access

Start a Session Manager session as above, and run the following command:

```sh
$ psql $DATABASE_URL
```

### RDS Jump Box setup

Currently, this is created manually, which is not ideal. We could perhaps look at triggering a Lambda
function to run the migrations, but that would not give us command line access to administer the database,
so perhaps the Jump Box is best, in which case it should really be created with code (Terraform or
CloudFormation), but in the meantime, below are the steps to recreate it manually.

- Create a new EC2 instance
  - Amazon Linux 2 AMI
  - t2.micro
  - same region/availability zone/subnet as the RDS database
  - The poorly named “bastion_profile“ role which has the correct Systems manager policy etc. and will come
    out the other end as "instance_role"
  - "Access to Postgres" security group
  - SessionManagerKey
  - Name “RDS Jump Box - Additional Restrictions Grant"
- Then you probably need to add it to Systems Manager
  - Go to AWS Systems Manager Quick Setup
  - Client "Edit all"
  - Scroll to bottom and select "Choose all instances in the current AWS account and Region"
  - Click "Reset" and wait for the magic to happen
- Configure the instance
  - Start a new session via Systems Manager > Session Manager
  - Create SSH key
  ```bash
  mkdir ~/.ssh
  cd ~/.ssh
  ssh-keygen -t rsa -b 4096 -C "database-migrations-<environment>@jumpbox-<instance_id>"
  cat ~/.ssh/id_rsa.pub
  ```
  - Add SSH key as a deployment key on the repository
  - Install Git
  ```bash
  sudo yum install -y git
  ```
  - Install Node.js 12
  ```bash
  curl -sL https://rpm.nodesource.com/setup_12.x | sudo bash -
  sudo yum install -y nodejs
  ```
  - Clone the repository
  ```bash
  cd ~ && git clone git@github.com:LBHackney-IT/arg-business-grants.git
  ```
  - Install dependencies
  ```bash
  cd ~/arg-business-grants && npm install
  ```
  - Add the DATABASE_URL environment variable (you can get the database details from the Lambda environment
    variables)
  ```bash
  echo "export DATABASE_URL=postgres://<username>:<password>@<endpoint>:<port>/<database>" >> ~/.bashrc
  source ~/.bashrc
  ```
  - Install PostgreSQL so we can use the client
  ```bash
  sudo amazon-linux-extras install -y postgresql11
  ```

## Preventing submissions after a given date

There's an environment variable `EXPIRATION_DATE` which is configured in the
[CircleCI project](https://app.circleci.com/settings/project/github/LBHackney-IT/arg-business-grants/environment-variables).
That must be provided an ISO-8601 date.

After this date, the button to start the forms will disappear, anyone attempting to navigate manually through the forms
will be redirected, and new submissions will be rejected by the API.
