# Up-Event
Up Event is a web-based application built with the MERN (MongoDB, Express, React, Node.js) stack, designed to provide users with the ability to host different types of events on a single platform. With Up Event, users can easily create and manage their events, invite attendees, and collaborate with them during the event with video-call, screen sharing, and chat functionalities.



https://user-images.githubusercontent.com/71185961/233144702-d3bac40b-4ac8-45da-8aea-f48d7cd88b37.mp4



## Features

* User authentication and authorization
* Create new events with event details and scheduling
* Invite attendees and manage their attendance
* Host events with video-call, screen sharing, and chat functionalities
* Unique event code generation for every event that serves as an entry ticket

## Technology Stack
* MongoDB: A document-based database used for data storage and retrieval.
* Express: A backend web application framework used to handle HTTP requests and responses.
* React: A frontend JavaScript library used to build user interfaces.
* Node.js: A JavaScript runtime environment used to execute server-side code.
* Socket.io: A JavaScript library used to enable real-time communication between the server and client.
* WebRTC: A set of protocols and APIs used for real-time communication over the web.

## Getting Started

### Prerequisites
* Node.js v14 or higher
* MongoDB server
* Git

### Installation
1. Clone the repository using git clone https://github.com/ayushkumar0208/Up-Event.git
2. Install the required dependencies using ```npm install```
3. Create a .env file in the project up-event/api with the following environment variables:
```
DATABSE=<your-mongodb-uri>
BACKEND_PORT=<your-backend-port-number>
```
4. Run the development server using ```npm run dev```


### Usage
1. Open http://localhost:3000 in your web browser.
2. Register a new account or login with an existing one.
3. Create a new event with event details and scheduling.
4. Invite attendees by sharing the event link and event code.
5. Host the event with video-call, screen sharing, and chat functionalities.

