# Qawem (قاوم)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Create React App](https://img.shields.io/badge/Create%20React%20App-react--scripts%205.0.1-09D3AC?logo=createreactapp&logoColor=white)
![React Router](https://img.shields.io/badge/React%20Router-7-CA4245?logo=reactrouter&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase&logoColor=black)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel&logoColor=white)

The web app behind **Qawem**, a Ramadan challenge built around daily faith-focused tasks and competitions.


> قاوم مش للكل. قاوم للي هيكمل.
> *Qawem is not for everyone. Qawem is for those who finish.*

<img width="915" height="476" alt="image" src="https://github.com/user-attachments/assets/43a0245d-f4aa-482c-8ec5-2063ed1cea1f" />


---

## Overview

**Qawem** (قاوم) is a Ramadan challenge project. It does not promise easy motivation. It aims to fill Ramadan with real spiritual effort through competitions and simple tasks delivered day by day, starting with an acceptance challenge and continuing through everything that follows.

Not every participant is expected to complete the challenge. After the elimination rounds, the participant group closes and only a small number of people who proved themselves remain.

This repository contains the project's web application, a React single-page app deployed on Vercel.

## The Challenge

| Element | Description |
| ------- | ----------- |
| Daily tasks | Simple tasks delivered to participants day by day |
| Competitions | Contests aimed at building genuine spiritual habits during Ramadan |
| Eliminations | Qualifying rounds after which the group closes and only a few participants remain |
| Group | Participants are gathered in a WhatsApp group before the elimination rounds |

## Features

Verified from the project configuration:

- Single-page application built on React 19
- Client-side routing with `react-router-dom`
- Firebase SDK (`firebase`) included as a dependency
- Testing setup with React Testing Library and Jest DOM
- Web Vitals reporting dependency (`web-vitals`)
- Live deployment on Vercel

## Technologies

| Technology | Purpose |
| ---------- | ------- |
| [React](https://react.dev/) 19 | UI library |
| [Create React App](https://create-react-app.dev/) (`react-scripts` 5.0.1) | Project tooling, dev server and build |
| [React Router](https://reactrouter.com/) 7 | Client-side routing |
| [Firebase](https://firebase.google.com/) 12 | Firebase SDK dependency |
| React Testing Library, Jest DOM, user-event | Testing utilities |
| [Vercel](https://vercel.com/) | Hosting |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) and npm (a specific Node.js version is not specified in the repository)

### Installation

```bash
git clone https://github.com/adelmhmd77/qawem.git
cd qawem
npm install
```

### Usage

Start the development server:

```bash
npm start
```

Other available scripts:

| Command | Description |
| ------- | ----------- |
| `npm start` | Runs the app in development mode |
| `npm run build` | Creates a production build |
| `npm test` | Runs the test runner |
| `npm run eject` | Ejects from Create React App |

## Project Structure

```text
qawem/
├── public/
├── src/
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── SECURITY.md
```

## Live Demo

[qawem.vercel.app](https://qawem.vercel.app/)

## Repository

[GitHub Repository](https://github.com/adelmhmd77/qawem)

## License

Not specified

## Notes

- The default branch is `master`.
- The deployed site is a client-rendered single-page application (Create React App build).
- The challenge description above comes from the project's own announcement. The repository does not document which challenge features are implemented inside the app itself.
- The Firebase SDK is listed as a dependency, but the specific Firebase services in use and the required configuration keys are not documented.
- Environment variables needed to run the app locally are not specified.
- A [`SECURITY.md`](SECURITY.md) file is included in the repository.

## Author

[adelmhmd77](https://github.com/adelmhmd77)
